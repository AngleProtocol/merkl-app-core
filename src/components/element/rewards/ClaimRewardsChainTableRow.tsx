import type { Reward } from "@merkl/api";
import { Button, type Component, Icon, Space, Value, mergeClass } from "dappkit";
import config from "merkl.config";
import TransactionButton, { type TransactionButtonProps } from "packages/dappkit/src/components/dapp/TransactionButton";
import Collapsible from "packages/dappkit/src/components/primitives/Collapsible";
import EventBlocker from "packages/dappkit/src/components/primitives/EventBlocker";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useMemo, useState } from "react";
import useReward from "src/hooks/resources/useReward";
import Tag from "../Tag";
import { ClaimRewardsChainRow } from "./ClaimRewardsChainTable";
import { ClaimRewardsTokenTable } from "./ClaimRewardsTokenTable";
import ClaimRewardsTokenTableRow from "./ClaimRewardsTokenTableRow";

export type ClaimRewardsChainTableRowProps = Component<{
  from: string;
  reward: Reward;
  onClaimSuccess: TransactionButtonProps["onSuccess"];
}>;

export default function ClaimRewardsChainTableRow({
  from,
  reward,
  className,
  onClaimSuccess,
  ...props
}: ClaimRewardsChainTableRowProps) {
  const [open, setOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(new Set<string>());

  const { address: user, chainId, switchChain } = useWalletContext();
  const isUserRewards = useMemo(() => user === from, [user, from]);
  const isAbleToClaim = useMemo(
    () => isUserRewards && !reward.rewards.every(({ amount, claimed }) => amount === claimed),
    [isUserRewards, reward],
  );
  const isOnCorrectChain = useMemo(() => reward.chain.id === chainId, [reward, chainId]);

  const { claimTransaction } = useReward(
    reward,
    !isUserRewards ? undefined : user,
    selectedTokens?.size > 0 ? selectedTokens : undefined,
  );

  const unclaimed = useMemo(
    () => reward.rewards.reduce((sum, { amount, claimed, token }) => sum + Fmt.toPrice(amount - claimed, token), 0),
    [reward],
  );

  const renderTokenRewards = useMemo(() => {
    return reward.rewards
      .sort((a, b) => {
        const priceA = Fmt.toPrice(a.amount - a.claimed, a.token);
        const priceB = Fmt.toPrice(b.amount - b.claimed, b.token);

        if (b.amount === b.claimed && a.amount === a.claimed)
          return Fmt.toPrice(b.amount, b.token) - Fmt.toPrice(a.amount, a.token);
        return priceB - priceA;
      })
      .map(_reward => (
        <ClaimRewardsTokenTableRow
          key={_reward.token.address}
          className="cursor-pointer [&>*>*]:cursor-auto"
          showCheckbox={isOnCorrectChain && isAbleToClaim}
          checkedState={[
            selectedTokens.has(_reward.token.address) || !selectedTokens.size,
            () => {
              setSelectedTokens(t => {
                if (!t.has(_reward.token.address)) t.add(_reward.token.address);
                else t.delete(_reward.token.address);

                return new Set(t);
              });
            },
          ]}
          reward={_reward}
        />
      ));
  }, [reward, selectedTokens.size, selectedTokens, isOnCorrectChain, isAbleToClaim]);

  return (
    <ClaimRewardsChainRow
      {...props}
      className={mergeClass("cursor-pointer [&>*>*]:cursor-auto", className)}
      onClick={() => setOpen(o => !o)}
      chainColumn={
        <>
          <Tag type="chain" value={reward.chain} />
          <Icon
            data-state={!open ? "closed" : "opened"}
            className="transition duration-150 ease-out data-[state=opened]:rotate-180"
            remix={"RiArrowDropDownLine"}
          />
          <EventBlocker>
            {isAbleToClaim &&
              (isOnCorrectChain ? (
                <TransactionButton
                  enableSponsorCheckbox
                  name="Claim Rewards"
                  disabled={!claimTransaction}
                  className="ml-xl"
                  look="hype"
                  tx={claimTransaction}
                  onSuccess={onClaimSuccess}>
                  Claim
                </TransactionButton>
              ) : (
                <Button className="ml-xl" onClick={() => switchChain(reward.chain.id)}>
                  Switch Network <Icon remix="RiArrowLeftRightLine" />
                </Button>
              ))}
          </EventBlocker>
        </>
      }
      unclaimedColumn={
        unclaimed === 0 ? undefined : (
          <Value size="lg" format={config.decimalFormat.dollar} look="bold" className="font-title">
            {unclaimed}
          </Value>
        )
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />
        <ClaimRewardsTokenTable size="sm" dividerClassName={() => "!bg-main-8"} className="[&>*]:bg-main-4" look="soft">
          {renderTokenRewards}
        </ClaimRewardsTokenTable>
      </Collapsible>
    </ClaimRewardsChainRow>
  );
}
