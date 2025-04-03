import type { Opportunity } from "@merkl/api";
import { Divider, type GetSet, Modal, Title } from "dappkit";
import type { PropsWithChildren } from "react";

import { useMerklConfig } from "@core/modules/config/config.context";
import Participate from "@core/modules/interaction/components/Participate";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";

export type OpportunityParticipateModalProps = {
  opportunity: Opportunity;
  state?: GetSet<boolean>;
  targets?: InteractionTarget[];
} & PropsWithChildren;

export default function OpportunityParticipateModal({
  opportunity,
  children,
  state,
  targets,
}: OpportunityParticipateModalProps) {
  const isDepositEnabled = useMerklConfig(store => store.config.deposit);
  const title = opportunity.protocol ? (
    <>Earn rewards by providing liquidity on {opportunity.protocol?.name}</>
  ) : (
    <>Earn rewards by providing liquidity</>
  );

  return (
    <Modal
      title={<Title h={3}>{title}</Title>}
      look="soft"
      modal={
        <div>
          <Divider horizontal look="bold" className="mb-xl" />
          <Participate
            {...{ opportunity, targets }}
            displayLinks
            displayOpportunity
            displayMode="deposit"
            hideInteractor={!isDepositEnabled}
          />
        </div>
      }
      state={state}>
      {children}
    </Modal>
  );
}
