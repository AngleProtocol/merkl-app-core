import Tag from "@core/components/element/Tag";
import OpportunityButton from "@core/modules/opportunity/components/OpportunityButton";
import Token from "@core/modules/token/components/element/Token";
import type { Reward } from "@merkl/api";
import { Checkbox, type Component, Divider, type GetSet, Group, Icon, type ListProps, Space, Text } from "dappkit";
import { Collapsible } from "dappkit";
import { Fmt } from "dappkit";
import React, { useMemo, useState } from "react";
import { ClaimRewardsTokenRow } from "./ClaimRewardsTokenTable";

export type ClaimRewardsTokenTableRowProps = Component<{
  reward: Reward["rewards"][number];
  checkedState?: GetSet<boolean>;
  showCheckbox?: boolean;
}> &
  ListProps;

export default function ClaimRewardsTokenTableRow({
  reward,
  checkedState,
  showCheckbox,
  ...props
}: ClaimRewardsTokenTableRowProps) {
  const [open, setOpen] = useState(false);

  const unclaimed = useMemo(() => BigInt(reward.amount) - BigInt(reward.claimed), [reward]);

  return (
    <ClaimRewardsTokenRow
      {...props}
      onClick={() => setOpen(o => !o)}
      tokenColumn={
        <Group className="flex-nowrap">
          {showCheckbox && <Checkbox look="hype" state={checkedState} className="!m-md" size="sm" />}
          <Tag type="token" value={reward.token} />
          <Icon
            data-state={!open ? "closed" : "opened"}
            className="text-main-10 transition duration-150 ease-out data-[state=opened]:rotate-180"
            remix={"RiArrowDropDownLine"}
          />
        </Group>
      }
      amountColumn={
        !!unclaimed ? <Token size="md" token={reward.token} format="amount_price" amount={BigInt(unclaimed)} /> : "-"
      }
      claimedColumn={
        !!BigInt(reward.claimed) ? (
          <Token size="md" token={reward.token} format="amount_price" amount={BigInt(reward.claimed)} />
        ) : (
          "-"
        )
      }
      pendingColumn={
        !!BigInt(reward.pending) ? (
          <Token size="md" token={reward.token} format="amount_price" amount={BigInt(reward.pending)} />
        ) : (
          "-"
        )
      }>
      <Collapsible state={[open, setOpen]}>
        <Space size="md" />
        {reward.breakdowns
          .sort(
            (a, b) => Fmt.toPrice(b.amount - b.claimed, reward.token) - Fmt.toPrice(a.amount - a.claimed, reward.token),
          )
          .filter(b => b.opportunity !== null)
          .map(b => {
            return (
              <React.Fragment key={b.opportunity.identifier.concat("-divider")}>
                <Divider look="soft" horizontal key={b.opportunity.identifier.concat("-divider")} />
                <ClaimRewardsTokenRow
                  {...props}
                  key={b.opportunity.identifier}
                  data-look={props?.look ?? "none"}
                  className="!px-0 py-xl  !m-0 border-none bg-main-0"
                  onClick={() => setOpen(o => !o)}
                  tokenColumn={
                    <Group className="pl-md justify-center items-center flex-nowrap">
                      <Text size="xl">
                        <Icon className="size" remix="RiCornerDownRightLine" />
                      </Text>
                      <OpportunityButton opportunity={b.opportunity} />
                    </Group>
                  }
                  amountColumn={
                    <Token size="md" token={reward.token} format="amount_price" amount={BigInt(b.amount - b.claimed)} />
                  }
                  claimedColumn={<Token size="md" token={reward.token} format="amount_price" amount={b.claimed} />}
                  pendingColumn={<Token size="md" token={reward.token} format="amount_price" amount={b.pending} />}
                />
              </React.Fragment>
            );
          })}
      </Collapsible>
    </ClaimRewardsTokenRow>
  );
}
