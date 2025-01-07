import type { Opportunity } from "@merkl/api";
import config from "merkl.config";
import { Button, Divider, Group, Image, Modal, Text, Title } from "packages/dappkit/src";
import type { PropsWithChildren } from "react";
import React from "react";

import merklConfig from "merkl.config";
import Participate from "../participate/Participate";
export type OpportunityParticipateModalProps = {
  opportunity: Opportunity;
} & PropsWithChildren;

export default function OpportunityParticipateModal({ opportunity, children }: OpportunityParticipateModalProps) {
  return (
    <Modal
      title={<Title h={3}>SUPPLY</Title>}
      modal={
        <Group className="flex-col">
          <Divider horizontal look="bold" className="mb-xl" />
          <Participate
            opportunity={opportunity}
            displayLinks
            displayOpportunity
            displayMode="deposit"
            hideInteractor={!config?.deposit}
          />
          {merklConfig.deposit && !!config.supplyCredits && config.supplyCredits.length > 0 && (
            <Text look="bold" className="flex gap-md items-center mx-auto">
              Powered by{" "}
              {config.supplyCredits.map(credit => (
                <React.Fragment key={credit.id}>
                  <Button look="soft" key={credit.name} to={credit.url}>
                    <Image src={credit.image} alt={credit.name} />
                  </Button>
                  <span className="last:hidden">and</span>
                </React.Fragment>
              ))}
            </Text>
          )}
        </Group>
      }>
      {children}
    </Modal>
  );
}
