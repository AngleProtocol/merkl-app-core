import Tag from "@core/components/element/Tag";
import { useMerklConfig } from "@core/modules/config/config.context";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import type { Reward } from "@merkl/api";
import { Button, type Component, Icon, type ListProps, Space, Value, mergeClass } from "dappkit";
import { TransactionButton, type TransactionButtonProps } from "dappkit";
import { Collapsible } from "dappkit";
import { EventBlocker } from "dappkit";
import { useWalletContext } from "dappkit";
import { Fmt } from "dappkit";
import { useCallback, useMemo, useState } from "react";
import useReward from "../../../hooks/resources/useReward";
import { UserService } from "../../../modules/user/user.service";
import { ClaimRewardsChainRow } from "./ClaimRewardsChainTable";
import { ClaimRewardsTokenTable } from "./ClaimRewardsTokenTable";
import ClaimRewardsTokenTableRow from "./ClaimRewardsTokenTableRow";

export type ClaimRewardsChainTableRowProps = Component<{
  from: string;
  reward: Reward;
  onClaimSuccess: TransactionButtonProps["onSuccess"];
}> &
  ListProps;

export default function ClaimRewardsChainTableRow({
  from,
  reward,
  className,
  onClaimSuccess,
  ...props
}: ClaimRewardsChainTableRowProps) {
  const [open, setOpen] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState<Set<string>>(
    new Set<string>(reward.rewards.map(({ token }) => token.address)),
  );
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const { address: user, chainId, switchChain } = useWalletContext();
  const isUserRewards = useMemo(() => UserService({}).isSame(user, from), [user, from]);
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
            selectedTokens.has(_reward.token.address),
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
  }, [reward, selectedTokens, isOnCorrectChain, isAbleToClaim]);

  const onSwitchChain = useCallback(() => {
    if (!reward.chain.id) return;
    switchChain(reward.chain.id);
  }, [switchChain, reward.chain.id]);

  const { track } = useMixpanelTracking();

  return (
    <ClaimRewardsChainRow
      {...props}
      className={mergeClass("bg-main-2", className)}
      chainColumn={
        <>
          <Tag
            onClick={() => setOpen(o => !o)}
            type="chain"
            value={reward.chain}
            suffix={
              <Icon
                data-state={!open ? "closed" : "opened"}
                className=" data-[state=opened]:rotate-180"
                remix={"RiArrowDropDownLine"}
              />
            }
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
                  onClick={() => track("Click on button", { button: "claim", type: "chain" })}
                  tx={claimTransaction}
                  onSuccess={onClaimSuccess}>
                  Claim
                </TransactionButton>
              ) : (
                <Button className="ml-xl" onClick={onSwitchChain}>
                  Switch Network <Icon remix="RiArrowLeftRightLine" />
                </Button>
              ))}
          </EventBlocker>
        </>
      }
      unclaimedColumn={
        unclaimed === 0 ? undefined : (
          <Value size="lg" format={dollarFormat} look="bold" className="font-title">
            {unclaimed}
          </Value>
        )
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />
        <ClaimRewardsTokenTable
          responsive={true}
          dividerClassName={() => "!bg-main-8"}
          className="[&>*]:bg-main-4"
          look="soft">
          {renderTokenRewards}
        </ClaimRewardsTokenTable>
      </Collapsible>
    </ClaimRewardsChainRow>
  );
}
