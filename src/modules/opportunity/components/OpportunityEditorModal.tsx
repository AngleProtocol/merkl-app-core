import type { Opportunity } from "@merkl/api";
import {
  Box,
  Button,
  type ButtonProps,
  Divider,
  Group,
  Icon,
  Input,
  Scroll,
  Space,
  Text,
  Title,
} from "packages/dappkit/src";
import useOpportunityMetadata from "../hooks/useOpportunityMetadata";
import { useCallback, useState } from "react";
import { OpportunityService } from "../opportunity.service";
import { api } from "@core/api";
import Editor from "@core/components/element/Editor";

export interface OpportunityEditorModalProps extends ButtonProps {
  opportunity: Opportunity;
}

export default function OpportunityEditorModal({ opportunity, ...props }: OpportunityEditorModalProps) {
  const { Tags } = useOpportunityMetadata(opportunity);

  return (
    <>
      <Title h={2}>Edit opportunity</Title>
      <Text>{opportunity.name}</Text>
      <Group>
        <Tags tags={["chain", "protocol", "status", "action", "explorer", "token"]} size="xs" />
      </Group>
      <Divider className="mt-xl border-main-6" />
      <Scroll className="max-h-[300px] w-full max-w-[90vw] lg:max-w-full" vertical>
        <Space size="xl" />
        <Editor
          name="Name"
          value={opportunity.name}
          onApply={async name => {
            console.log(name);
            //OpportunityService.update(opportunity.id, { name });
            return await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />
        <Divider className="mt-xl mb-md border-main-6" />
        <Editor
          name="Protocol Id"
          value={opportunity.protocol?.id ?? ""}
          onApply={async name => {
            console.log(name);
            //OpportunityService.update(opportunity.id, { name });
            return await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />
        <Divider className="mt-xl mb-md border-main-6" />

        <Editor
          name="Deposit Url"
          value={opportunity.depositUrl ?? ""}
          onApply={async name => {
            console.log(name);
            //OpportunityService.update(opportunity.id, { name });
            return await new Promise(resolve => setTimeout(resolve, 2000));
          }}
        />
        <Divider className="my-xl border-main-6" />
      </Scroll>
    </>
  );
}
