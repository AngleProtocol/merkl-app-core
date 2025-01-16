import type { Token, Opportunity } from "@merkl/api";
import { Icon, Value } from "dappkit";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import type { TagType } from "../../components/element/Tag";
import merklConfig from "../../config";

export default function useOpportunity(opportunity: Opportunity) {
  const tags = useMemo(() => {
    const tokens: TagType<"token">[] = opportunity.tokens.map(t => ({
      type: "token",
      value: t,
    }));
    const action: TagType<"action"> = {
      type: "action",
      value: opportunity.action,
    };
    const protocol: TagType<"protocol"> | undefined = opportunity?.protocol && {
      type: "protocol",
      value: opportunity.protocol,
    };
    const chain: TagType<"chain"> = {
      type: "chain",
      value: opportunity?.chain,
    };
    const status: TagType<"status"> = {
      type: "status",
      value: opportunity?.status,
    };

    return [protocol, chain, action, ...tokens, status].filter(a => a);
  }, [opportunity]);

  const link = useMemo(
    () =>
      `/opportunities/${opportunity.chain?.name?.toLowerCase?.().replace(" ", "-")}/${opportunity.type}/${opportunity.identifier}`,
    [opportunity],
  );

  const iconTokens = useMemo(() => {
    // If there is more than 1 icons, remove undefined ones
    let tokens = opportunity.tokens;
    if (tokens.length > 1) tokens = tokens.filter(token => !!token.icon);
    if (tokens.length < 1) tokens = opportunity.tokens;
    return tokens;
  }, [opportunity]);

  const icons = useMemo(
    () => iconTokens.map(({ icon, address }) => <Icon key={address} rounded src={icon} />),
    [iconTokens],
  );

  const rewardIcons = useMemo(
    () =>
      opportunity.rewardsRecord?.breakdowns?.map(({ token: { icon, address } }) => (
        <Icon key={address} rounded src={icon} />
      )) ?? [],
    [opportunity],
  );

  const description = useMemo(() => {
    const tokenSymbols = opportunity?.tokens?.reduce((str, token, index, tokens) => {
      const noSeparator = index === tokens.length || index === 0;
      const separator = index === tokens.length - 1 ? "-" : "-";

      return str + (noSeparator ? "" : separator) + token.symbol;
    }, "");

    switch (opportunity.action) {
      case "POOL":
        return `Earn rewards by providing liquidity to the ${opportunity.protocol?.name} ${tokenSymbols} pool on ${opportunity.chain.name}, or through a liquidity manager supported by Merkl`;
      case "HOLD":
        return `Earn rewards by holding ${tokenSymbols} or by staking it in a supported contract`;
      case "LEND":
        return `Earn rewards by supplying liquidity to the ${opportunity.protocol?.name} ${tokenSymbols} on ${opportunity.chain.name}`;
      case "BORROW":
        return `Earn rewards by borrowing liquidity to the ${opportunity.protocol?.name} ${tokenSymbols} on ${opportunity.chain.name}`;
      case "DROP":
        return `Visit your dashboard to check if you've earned rewards from this airdrop`;
      default:
        break;
    }
  }, [opportunity]);

  const herosData = useMemo(() => {
    let data = [];
    switch (opportunity.action) {
      default:
        data = [
          !!opportunity.dailyRewards && {
            label: "Daily rewards",
            data: (
              <Value format={merklConfig.decimalFormat.dollar} size={4} className="!text-main-12">
                {opportunity.dailyRewards}
              </Value>
            ),
            key: uuidv4(),
          },
          !!opportunity.apr && {
            label: "APR",
            data: (
              <Value format="0.00%" size={4} className="!text-main-12">
                {opportunity.apr / 100}
              </Value>
            ),
            key: uuidv4(),
          },
          !!opportunity.tvl && {
            label: "Total value locked",
            data: (
              <Value format={merklConfig.decimalFormat.dollar} size={4} className="!text-main-12">
                {opportunity.tvl}
              </Value>
            ),
            key: uuidv4(),
          },
        ];
    }
    return data.filter(data => !!data);
  }, [opportunity]);

  const rewardsBreakdown = useMemo(() => {
    if (!opportunity?.rewardsRecord?.breakdowns) return [];

    const tokenAddresses = opportunity.rewardsRecord.breakdowns.reduce((addresses, breakdown) => {
      return addresses.add(breakdown.token.address);
    }, new Set<string>());

    return Array.from(tokenAddresses).map(address => {
      const breakdowns = opportunity.rewardsRecord.breakdowns.filter(({ token: t }) => t.address === address);
      const amount = breakdowns?.reduce((sum, breakdown) => sum + BigInt(breakdown.amount), 0n);

      return { token: breakdowns?.[0]?.token, amount } satisfies {
        token: Token;
        amount: bigint;
      };
    });
  }, [opportunity]);

  return {
    link,
    icons,
    iconTokens,
    rewardIcons,
    description,
    rewardsBreakdown,
    opportunity: {
      ...opportunity,
      name: merklConfig.opportunityPercentage
        ? opportunity.name
        : opportunity.name.replace(/\s*\d+(\.\d+)?%$/, "").trim(),
    },
    tags,
    herosData,
  };
}
