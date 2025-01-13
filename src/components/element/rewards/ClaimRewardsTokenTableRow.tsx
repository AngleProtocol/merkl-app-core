import type { Reward } from "@merkl/api";
import { Checkbox, type Component, Divider, type GetSet, Group, Icon, Space } from "dappkit";
import Collapsible from "packages/dappkit/src/components/primitives/Collapsible";
import { Fmt } from "packages/dappkit/src/utils/formatter.service";
import { useMemo, useState } from "react";
import Tag from "../Tag";
import OpportunityButton from "../opportunity/OpportunityButton";
import { ClaimRewardsTokenRow } from "./ClaimRewardsTokenTable";
import ClaimRewardsTokenTablePrice from "./ClaimRewardsTokenTablePrice";

export type ClaimRewardsTokenTableRowProps = Component<{
  reward: Reward["rewards"][number];
  checkedState?: GetSet<boolean>;
  showCheckbox?: boolean;
}>;

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
        <ClaimRewardsTokenTablePrice amount={unclaimed} price={reward.token.price} decimals={reward.token.decimals} />
      }
      claimedColumn={
        <ClaimRewardsTokenTablePrice
          amount={BigInt(reward.claimed)}
          price={reward.token.price}
          decimals={reward.token.decimals}
        />
      }
      pendingColumn={
        <ClaimRewardsTokenTablePrice
          amount={BigInt(reward.pending)}
          price={reward.token.price}
          decimals={reward.token.decimals}
        />
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
              <>
                <Divider look="soft" horizontal key={b.opportunity.identifier.concat("-divider")} />
                <ClaimRewardsTokenRow
                  {...props}
                  key={b.opportunity.identifier}
                  data-look={props?.look ?? "none"}
                  className="!px-0 py-xl  !m-0 border-none bg-main-0"
                  onClick={() => setOpen(o => !o)}
                  tokenColumn={
                    <Group className="flex-col justify-center">
                      <OpportunityButton opportunity={b.opportunity} />
                    </Group>
                  }
                  amountColumn={
                    <ClaimRewardsTokenTablePrice
                      amount={b.amount - b.claimed}
                      price={reward.token.price}
                      decimals={reward.token.decimals}
                    />
                  }
                  claimedColumn={
                    <ClaimRewardsTokenTablePrice
                      amount={b.claimed}
                      price={reward.token.price}
                      decimals={reward.token.decimals}
                    />
                  }
                  pendingColumn={
                    <ClaimRewardsTokenTablePrice
                      amount={b.pending}
                      price={reward.token.price}
                      decimals={reward.token.decimals}
                    />
                  }
                />
              </>
            );
          })}
      </Collapsible>
    </ClaimRewardsTokenRow>
  );
}
