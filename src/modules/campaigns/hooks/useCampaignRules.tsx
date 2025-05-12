import { useMerklConfig } from "@core/index.generated";
import { UserService } from "@core/modules/user/user.service";
import type { Campaign as CampaignFromApi, CampaignParams } from "@merkl/api";
import type { Opportunity } from "@merkl/api";
import { Group, Icon, Text } from "dappkit";
import { useCallback, useMemo } from "react";
import Token from "../../token/components/element/Token";
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
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);
  /**
   * Get weighted liquidity/fees campaigns rules
   */
  const getLiquidityProfileRules = useCallback(
    ({ params }: CampaignFromApi["params"]) => {
      const onlyTypes: CampaignFromApi["type"][] = ["CLAMM", "UNISWAP_V4"];

      const arr: RuleType[] = [];

      if (!opportunity || !onlyTypes.includes(opportunity.type)) return [];

      const keys = {
        tokenAddresses: ["token0", "token1"],
        tokenWeight: ["weightToken0", "weightToken1"],
      };
      switch (opportunity.type) {
        case "UNISWAP_V4":
          keys.tokenAddresses = ["currency0", "currency1"];
          break;
      }

      // Fees / Liquidity Contribution rule
      const isUniswapV4 = opportunity.type === "UNISWAP_V4";

      arr.push({
        type: "liquidity" as const,
        value: {
          description: isUniswapV4
            ? `${params.weightFees / 100}% of campaign rewards are distributed based on the time-weighted liquidity contribution of each position. Positions that remain highly concentrated over time earn a greater share of rewards.`
            : `${params.weightFees / 100}% of campaign rewards are split amongst liquidity providers based on the fees their positions earn`,
          label: isUniswapV4 ? (
            <>
              <Icon remix="RiWaterFlashFill" />
              Liquidity Contribution
            </>
          ) : (
            <>
              <Icon remix="RiDiscountPercentFill" />
              Fees
            </>
          ),
          percentage: params.weightFees,
        },
      });

      if (!!params.upperPriceBond)
        arr.push({
          type: "liquidity",
          value: {
            description: `Only positions with an upper tick price below ${params.upperPriceBond / 10000} are eligible for rewards. Here, "price" refers to the ratio of token 1 to token 0 — for example, if token 1 is ETH and token 0 is BTC, the price represents the ETH/BTC rate. This rule sets a strict upper limit on the price range for qualifying positions: any position with an upper tick price above this threshold is not eligible for rewards. Example: If the threshold is 1,050 token 1 per token 0, then only positions where the upper tick corresponds to a price of 1,050 or less are eligible. A position ranging from 980 to 1,040 qualifies; a position from 990 to 1,080 does not.`,
            label: (
              <Group size="sm">
                <Icon remix="RiDiscountPercentFill" />
                <Text size={"xs"} look="bold">
                  Upper Price Bound
                </Text>
                <Text size="xs" className="font-bold">
                  {params.symbolCurrency0 && params.symbolCurrency1
                    ? `${params.upperPriceBond / 10000} ${params.symbolCurrency1}/${params.symbolCurrency0}`
                    : params.upperPriceBond / 10000}
                </Text>
              </Group>
            ),
          },
        });

      if (!!params.lowerPriceBond)
        arr.push({
          type: "liquidity",
          value: {
            description: `Only positions with a lower tick price above ${params.lowerPriceBond / 10000} are eligible for rewards. Here, "price" refers to the ratio of token 1 to token 0 — for example, if token 1 is ETH and token 0 is BTC, the price represents the ETH/BTC rate. This rule sets a strict lower limit on the price range for qualifying positions: any position with a lower tick price below this threshold is not eligible for rewards. Example: If the threshold is 1,050 token 1 per token 0, then only positions where the lower tick corresponds to a price of 1,050 or above are eligible. A position ranging from 1,060 to 1,080 qualifies; a position from 990 to 1,080 does not.`,
            label: (
              <Group size="sm">
                <Icon remix="RiDiscountPercentFill" />
                <Text size={"xs"} look="bold">
                  Lower Price Bound
                </Text>
                <Text size="xs" className="font-bold">
                  {params.symbolCurrency0 && params.symbolCurrency1
                    ? `${params.lowerPriceBond / 10000} ${params.symbolCurrency1}/${params.symbolCurrency0}`
                    : params.lowerPriceBond / 10000}
                </Text>
              </Group>
            ),
          },
        });

      //token weight rules
      for (const tokenIndex of [0, 1]) {
        const token =
          opportunity.tokens.find(t => UserService({}).isSame(t.address, params[keys.tokenAddresses[tokenIndex]])) ??
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
    [opportunity, dollarFormat],
  );

  /**
   * Get whitelist/blacklist address rules
   */
  const getListRestrictionRules = useCallback(
    ({ params, chain }: CampaignFromApi["params"]) => {
      const excludeTypes = ["JSON_AIRDROP", "ERC20_SNAPSHOT", "INVALID"] satisfies CampaignFromApi["type"][];
      const arr: RuleType[] = [];

      if (!opportunity || (excludeTypes as CampaignFromApi["type"][]).includes(opportunity.type)) return [];

      const { blacklist, whitelist } = params as CampaignParams<(typeof excludeTypes)[number]>["params"];

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
  const getJumperHook = useCallback((campaign: CampaignFromApi) => {
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
    const typeSpecificRule: { [C in CampaignFromApi["type"]]?: (scopedCampaign: CampaignFromApi) => RuleType[] } = {
      CLAMM: c => getLiquidityProfileRules(c),
      UNISWAP_V4: c => getLiquidityProfileRules(c),
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
