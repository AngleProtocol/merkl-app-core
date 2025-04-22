import OpportunityAPRIcon from "@core/modules/opportunity/components/element/OpportunityAPRIcon";
import Token from "@core/modules/token/components/element/Token";
import type { Opportunity, Token as TokenType } from "@merkl/api";
import { DistributionType } from "@merkl/api/dist/database/api/.generated";
import { Box, Divider, Group, Icon, Text, Title, Value } from "packages/dappkit/src";
import React from "react";
import { formatUnits } from "viem";

const TVL_EXAMPLE_VALUE = 1000;

export type DailyRewardsTooltipProps = {
  opportunity: Opportunity;
};

export default function DailyRewardsTooltip({ opportunity }: DailyRewardsTooltipProps) {
  if (!opportunity.rewardsRecord?.breakdowns) return null;

  const mergedBreakdowns = opportunity.rewardsRecord.breakdowns.reduce<
    Record<string, { token: TokenType; amount: bigint; distributionType: DistributionType; value: number }>
  >((acc, tokenBreakdown) => {
    const { token, amount, distributionType, value } = tokenBreakdown;
    const key = `${token.address}_${distributionType}`;

    if (acc[key]) {
      acc[key].amount = acc[key].amount + BigInt(amount);
      acc[key].value = acc[key].value + value;
    } else {
      acc[key] = { token, amount: BigInt(amount), distributionType, value };
    }

    return acc;
  }, {});

  return (
    <Group className="flex-col lg:max-w-[20vw]" size="xl">
      <Group className="items-center">
        <Title look="bold" h={5} className="gap-md flex">
          <OpportunityAPRIcon opportunity={opportunity} floatingAPRIcon size="lg" />
          Daily rewards
        </Title>
      </Group>
      <Divider look="hype" className="-mx-xl w-[calc(100%+2*var(--spacing-xl))]" />
      <Group className="flex-col" size="md">
        {Object.values(mergedBreakdowns)
          .filter(x => x.token.isPreTGE)
          .map(({ token, amount, value, distributionType }, index) => (
            <Box key={token.id} look="base" size="md">
              <Group className="flex-col">
                <Group className="gap-md">
                  <Token token={token} amount={amount} look="bold" />
                  {distributionType === DistributionType.FIX_REWARD_AMOUNT_PER_LIQUIDITY_VALUE && (
                    <Text size="xs" look="soft">
                      {"(~"}
                      <Value format="0,0.###a" value>
                        {Number(formatUnits(amount, token.decimals)) / opportunity.tvl}
                      </Value>
                      {` ${token.symbol}/$/Day)`}
                    </Text>
                  )}
                  {distributionType === DistributionType.FIX_REWARD_VALUE_PER_LIQUIDITY_AMOUNT && (
                    <Text size="xs" look="soft">
                      {"(~"}
                      <Value format="0,0.###a" value>
                        {value / opportunity.tvl}
                      </Value>
                      {`$ of ${token.symbol}/$/Day)`}
                    </Text>
                  )}
                </Group>
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
        <Text size="sm" look="soft">
          {`Daily reward for $${TVL_EXAMPLE_VALUE} deposited are currently estimated to `}
          {Object.values(mergedBreakdowns).map((x, index) => (
            <React.Fragment key={x.token.id}>
              {
                <Value format="0,0.###a" value>
                  {(Number(formatUnits(x.amount, x.token.decimals)) * TVL_EXAMPLE_VALUE) / opportunity.tvl}
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
  );
}
