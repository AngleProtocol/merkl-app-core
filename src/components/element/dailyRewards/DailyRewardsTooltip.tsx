import OpportunityAPRIcon from "@core/modules/opportunity/components/element/OpportunityAPRIcon";
import useOpportunityDistributionTypes from "@core/modules/opportunity/hooks/useOpportunityDistributionTypes";
import Token from "@core/modules/token/components/element/Token";
import type { Opportunity, Token as TokenType } from "@merkl/api";
import { DistributionType } from "@merkl/api/dist/database/api/.generated";
import { Box, type Component, Divider, Group, Icon, Text, Title, Value } from "packages/dappkit/src";
import React, { useMemo } from "react";
import { formatUnits } from "viem";

export type DailyRewardsTooltipProps = {
  opportunity: Opportunity;
};

export default function DailyRewardsTooltip({ opportunity }: Component<DailyRewardsTooltipProps>) {
  if (!opportunity.rewardsRecord?.breakdowns) return null;

  const { distributionTypes } = useOpportunityDistributionTypes(opportunity);

  const mergedBreakdowns = opportunity.rewardsRecord.breakdowns.reduce<
    Record<string, { token: TokenType; amount: bigint }>
  >((acc, tokenBreakdown) => {
    const { token, amount } = tokenBreakdown;
    const key = token.address;

    if (acc[key]) {
      acc[key].amount = acc[key].amount + BigInt(amount);
    } else {
      acc[key] = { token, amount: BigInt(amount) };
    }

    return acc;
  }, {});

  const description = useMemo(() => {
    if (
      distributionTypes.has(DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_VALUE) ||
      distributionTypes.has(DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_VALUE) ||
      distributionTypes.has(DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_AMOUNT) ||
      distributionTypes.has(DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_AMOUNT)
    )
      return "Estimations based on current TVL and Campaign budget.";

    return null;
  }, [distributionTypes]);

  return (
    <Group className="flex-col lg:max-w-[30vw]" size="xl">
      <Group className="items-center">
        <Title look="bold" h={5} className="gap-md flex">
          <OpportunityAPRIcon opportunity={opportunity} floatingAPRIcon size="lg" />
          Daily rewards
        </Title>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="md">
        {description && (
          <Group className="p-md">
            <Text size="xs" look="soft">
              {description}
            </Text>
          </Group>
        )}

        {Object.values(mergedBreakdowns)
          .filter(x => x.token.isPreTGE)
          .map(({ token, amount }, index) => (
            <Box key={token.id} look="base" size="md">
              <Group className="flex-col">
                <Token token={token} amount={amount} look="bold" />
                <Divider look="soft" horizontal />
                {!!token.price && (
                  <Group className="justify-between">
                    <Text>Pre TGE Unit Price:</Text>
                    <Value format={"$0.######"}>{token.price}</Value>
                  </Group>
                )}
                <Group className="justify-between flex">
                  <Icon remix="RiTimer2Fill" size="md" />
                  <Text size="sm" className="flex-1">
                    This token hasn’t launched yet.
                    <br />
                    Its unit price is estimated and subject to change.
                  </Text>
                </Group>
                {index < Object.values(mergedBreakdowns).filter(x => x.token.isPreTGE).length - 1 && (
                  <Divider look="soft" horizontal />
                )}
              </Group>
            </Box>
          ))}

        {Object.values(mergedBreakdowns).filter(x => !x.token.isPreTGE).length && (
          <Box look="base" size="md">
            {Object.values(mergedBreakdowns)
              .filter(x => !x.token.isPreTGE)
              .map(({ token, amount }) => (
                <Group key={token.id} className="flex-col">
                  <Token token={token} amount={amount} look="bold" />
                </Group>
              ))}
          </Box>
        )}
        <Group className="px-md">
          <Text size="xs" look="soft">
            Daily reward for $100 deposited are currently estimated to{" "}
            {Object.values(mergedBreakdowns).map((x, index) => (
              <React.Fragment key={x.token.id}>
                {
                  <Value format="0,0.###a" value>
                    {(Number(formatUnits(x.amount, x.token.decimals)) * 100) / opportunity.tvl}
                  </Value>
                }{" "}
                {x.token.symbol}
                {index !== Object.values(mergedBreakdowns).length - 1 && " + "}
              </React.Fragment>
            ))}
            .
          </Text>
        </Group>
      </Group>
    </Group>
  );
}
