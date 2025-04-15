import { ChainTag, Tag, Token, type Api } from "@core/index.generated";
import { RewardTokenRow } from "../library/RewardTokenTable";
import { Group, Icon, Tooltip } from "packages/dappkit/src";

export type RewardTokenTableRowProps = {
  rewardToken: NonNullable<Awaited<ReturnType<Api["v4"]["tokens"]["reward"]["get"]>>["data"]>[number][number];
};

export default function RewardTokenTableRow({ rewardToken }: RewardTokenTableRowProps) {
  return (
    <RewardTokenRow
      chainColumn={<ChainTag chain={{ id: rewardToken.chainId }} disabled />}
      tokenColumn={
        <Group className="flex items-center" size="lg">
          <Token token={rewardToken} />
          <Tag type="preTGE" value={rewardToken.isPreTGE} size="sm" />
        </Group>
      }
      testColumn={
        rewardToken.isTest && (
          <Tooltip icon={false} helper={"This token is flagged has a test token"}>
            <Icon remix="RiTestTubeFill" />
          </Tooltip>
        )
      }
      priceColumn={
        !rewardToken.price && (
          <Tooltip icon={false} helper={"This token's price is unknown"}>
            <Icon remix="RiPriceTag2Fill" color="red" />
          </Tooltip>
        )
      }
      pointColumn={
        rewardToken.isPoint && (
          <Tooltip icon={false} helper={"This token is a point token"}>
            <Icon remix="RiSparkling2Fill" />
          </Tooltip>
        )
      }
      minAmountColumn={<Token token={rewardToken} format="amount" amount={rewardToken.minimumAmountPerHour} />}
    />
  );
}
