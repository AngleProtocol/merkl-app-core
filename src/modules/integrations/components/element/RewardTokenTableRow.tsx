import { ChainTag, Tag, Token, TokenTag, useChain, type Api } from "@core/index.generated";
import { RewardTokenRow } from "../library/RewardTokenTable";
import { Button, Group, Hash, Icon, Value } from "packages/dappkit/src";

export type RewardTokenTableRowProps = {
  rewardToken: NonNullable<Awaited<ReturnType<Api["v4"]["tokens"]["reward"]["get"]>>["data"]>[number][number];
};

export default function RewardTokenTableRow({ rewardToken }: RewardTokenTableRowProps) {
  const { chain } = useChain({ id: rewardToken.chainId });

  return (
    <RewardTokenRow
      chainColumn={<ChainTag chain={{ id: rewardToken.chainId }} disabled />}
      tokenColumn={<TokenTag token={rewardToken} />}
      typeColumn={
        rewardToken.isPoint && rewardToken.isTest
          ? "Test Point"
          : rewardToken.isPoint
            ? "Point"
            : rewardToken.isTest
              ? "Test"
              : "Token"
      }
      priceColumn={
        !rewardToken.price ? (
          "unknown"
        ) : (
          <Group className="flex items-center" size="lg">
            <Value value format="$0,0.####a" className="text-main-11">
              {rewardToken.price}
            </Value>
            <Tag type="preTGE" value={rewardToken.isPreTGE} size="sm" />
          </Group>
        )
      }
      minAmountColumn={<Token token={rewardToken} format="amount" amount={rewardToken.minimumAmountPerHour} />}
      addressColumn={
        <Group size="sm">
          <Hash format="short" bold copy>
            {rewardToken.address}
          </Hash>
          {!!chain && (
            <Button
              key={`${chain.explorers?.[0]?.url}`}
              to={`${chain.explorers?.[0]?.url}/address/${rewardToken.address}`}
              external
              look="soft">
              <Icon remix="RiArrowRightUpLine" />
            </Button>
          )}
        </Group>
      }
    />
  );
}
