import { UserService } from "@core/modules/user/user.service";
import type { Campaign as CampaignFromApi } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Icon } from "dappkit";
import { useCallback, useMemo } from "react";
import Token from "../../token/components/element/Token";
import type { Campaign } from "../campaign.model";
import type { RuleType } from "../components/rules/Rule";

// to refactor when we handles all hooks (type should be handled by apiTyping)
export type HookJumper = {
  fromChains: number[];
  hookType: number;
  tokens: string[];
  since: number;
  minAmountInUSD: number;
};

/**
 * Formats basic metadata for a given opportunity
 */
export default function useCampaignRules(campaign: CampaignFromApi, opportunity?: Opportunity) {
  /**
   * Get weighted liquidity/fees campaigns rules
   */
  const getLiquidityProfileRules = useCallback(
    ({ params }: Campaign["params"]) => {
      const onlyTypes: CampaignFromApi["type"][] = ["CLAMM"];
      const arr: RuleType[] = [];

      if (!opportunity || !onlyTypes.includes(opportunity.type)) return [];

      //fees rule
      arr.push({
        type: "liquidity" as const,
        value: {
          description: `${
            params.weightFees / 100
          }% of campaign rewards are split amongst liquidity providers based on the fees their positions earn`,
          label: (
            <>
              <Icon remix="RiDiscountPercentFill" />
              Fees
            </>
          ),
          percentage: params.weightFees,
        },
      });

      //token weight rules
      for (const tokenIndex of [0, 1]) {
        const token =
          opportunity.tokens.find(t => UserService({}).isSame(t.address, params[`token${tokenIndex}`])) ??
          opportunity.tokens[tokenIndex];
        const weight = params[`weightToken${tokenIndex}`];

        if (!token || weight === undefined) continue;

        arr.push({
          type: "liquidity" as const,
          value: {
            description: `${
              params[`weightToken${tokenIndex}`] / 100
            }% of campaign rewards are split amongst liquidity providers based on the amount of ${
              token.symbol
            } held in their positions. The more ${
              token.symbol
            } they hold over time relative to others, the greater their share of rewards`,
            label: <Token value token={token} />,
            percentage: params[`weightToken${tokenIndex}`],
          },
        });
      }

      //range rule
      !params.isOutOfRangeIncentivized &&
        arr.push({
          type: "boolean",
          value: {
            description: "Out-of-range positions do not earn rewards",
            label: (
              <>
                <Icon remix="RiStockFill" />
                In Range
              </>
            ),
          },
        });

      return arr;
    },
    [opportunity],
  );

  /**
   * Get whitelist/blacklist address rules
   */
  const getListRestrictionRules = useCallback(
    ({ params, chain }: Campaign["params"]) => {
      const excludeTypes = ["JSON_AIRDROP", "ERC20_SNAPSHOT", "INVALID"] satisfies CampaignFromApi["type"][];
      const arr: RuleType[] = [];

      if (!opportunity || (excludeTypes as CampaignFromApi["type"][]).includes(opportunity.type)) return [];

      const { blacklist, whitelist } = params as Campaign<(typeof excludeTypes)[number]>["params"];

      blacklist.length &&
        arr.push({
          type: "address",
          value: {
            label: (
              <>
                <Icon remix="RiSpam3Fill" />
                Blacklist
              </>
            ),
            chain,
            description:
              "The following blacklisted addresses don’t earn rewards. If a liquidity manager (ALM) address is blacklisted, any addresses linked to it are also ineligible",
            addresses: blacklist,
          },
        });

      whitelist.length &&
        arr.push({
          type: "address",
          value: {
            description:
              "Only the following whitelisted addresses are eligible for rewards. If one of this address is a liquidity manager (ALM)vault, any addresses that provided liquidity via such ALM will be eligible.",
            label: (
              <>
                <Icon remix="RiProhibitedFill" />
                Whitelist
              </>
            ),
            chain,
            addresses: whitelist,
          },
        });

      return arr;
    },
    [opportunity],
  );

  /**
   * Get Hooks (to refactor when we handles all hooks)
   */
  const getJumperHook = useCallback((campaign: Campaign) => {
    const jumperHook: HookJumper | undefined = campaign.params?.hooks?.find((hook: HookJumper) => hook.hookType === 0);
    if (!jumperHook) return;
    return {
      type: "jumper",
      value: {
        label: "Jumper bridge needed",
        fromchains: jumperHook.fromChains,
        hooktype: jumperHook.hookType,
        tokens: jumperHook.tokens,
        since: jumperHook.since,
        minAmountInUSD: jumperHook.minAmountInUSD,
      },
    } as RuleType;
  }, []);

  /**
   * Aggregate all rules for given campaign
   */
  const rules = useMemo(() => {
    const typeSpecificRule: { [C in CampaignFromApi["type"]]?: (scopedCampaign: Campaign<C>) => RuleType[] } = {
      CLAMM: c => getLiquidityProfileRules(c),
    };

    return (
      ([] as RuleType[])
        // biome-ignore lint/suspicious/noExplicitAny: type is enforced above
        .concat(typeSpecificRule?.[campaign.type]?.(campaign as any) ?? [])
        .concat(getListRestrictionRules(campaign).filter(a => !!a))
        .concat([getJumperHook(campaign)].filter(a => !!a))
    );
  }, [campaign, getListRestrictionRules, getLiquidityProfileRules, getJumperHook]);

  return {
    rules,
  };
}
