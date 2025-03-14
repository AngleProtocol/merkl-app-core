import type { Opportunity } from "@merkl/api";
import { Button, Divider, type GetSet, Image, Modal, Text, Title } from "dappkit";
import type { PropsWithChildren } from "react";
import React from "react";

import { useMerklConfig } from "@core/modules/config/config.context";
import Participate from "@core/modules/interaction/components/Participate";

export type OpportunityParticipateModalProps = {
  opportunity: Opportunity;
  state?: GetSet<boolean>;
} & PropsWithChildren;

export default function OpportunityParticipateModal({
  opportunity,
  children,
  state,
}: OpportunityParticipateModalProps) {
  const isDepositEnabled = useMerklConfig(store => store.config.deposit);
  const supplyCredits = useMerklConfig(store => store.config.supplyCredits);

  return (
    <Modal
      title={<Title h={3}>{opportunity.name}</Title>}
      look="soft"
      modal={
        <div>
          <Divider horizontal look="bold" className="mb-xl" />
          <Participate
            opportunity={opportunity}
            displayLinks
            displayOpportunity
            displayMode="deposit"
            hideInteractor={!isDepositEnabled}
          />
          {isDepositEnabled && !!supplyCredits && supplyCredits.length > 0 && (
            <Text look="bold" className="flex mt-md gap-md items-center mx-auto">
              Powered by{" "}
              {supplyCredits.map(credit => (
                <React.Fragment key={credit.id}>
                  <Button look="soft" key={credit.name} to={credit.url}>
                    <Image src={credit.image} alt={credit.name} />
                  </Button>
                  <span className="last:hidden">and</span>
                </React.Fragment>
              ))}
            </Text>
          )}
        </div>
      }
      state={state}>
      {children}
    </Modal>
  );
}
