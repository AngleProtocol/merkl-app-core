import { api } from "@core/api";
import Editor from "@core/components/element/Editor";
import type { Opportunity } from "@merkl/api";
import { type ButtonProps, Divider, Group, Scroll, Space, Text, Title } from "packages/dappkit/src";
import useOpportunityMetadata from "../hooks/useOpportunityMetadata";
import { OpportunityService } from "../opportunity.service";

export interface OpportunityEditorModalProps extends ButtonProps {
  opportunity: Opportunity;
}

export default function OpportunityEditorModal({ opportunity }: OpportunityEditorModalProps) {
  const { Tags } = useOpportunityMetadata(opportunity);
  const opportunityService = OpportunityService({ api });

  return (
    <>
      <Title h={2}>Edit opportunity</Title>
      <Text>{opportunity.name}</Text>
      <Group>
        <Tags tags={["chain", "protocol", "status", "action", "token"]} size="xs" />
      </Group>
      <Divider className="mt-xl border-main-6" />
      <Scroll className="max-h-[300px] w-full max-w-[90vw] lg:max-w-full" vertical>
        <Space size="xl" />

        <Editor
          name="Name"
          value={opportunity.name}
          onApply={async name => {
            return await opportunityService.override(opportunity.id, { name });
          }}
          onRemove={async () => opportunityService.deleteOverride(opportunity.id, ["name"])}
        />

        <Divider className="mt-xl mb-md border-main-6" />

        <Editor
          name="Description"
          value={opportunity.description ?? ""}
          onApply={async description => {
            return await opportunityService.override(opportunity.id, { description });
          }}
          onRemove={async () => opportunityService.deleteOverride(opportunity.id, ["description"])}
        />
        <Divider className="my-xl border-main-6" />

        <Editor
          name="How to participate"
          value={opportunity.howToSteps?.join("<br/>") ?? ""}
          onApply={async howToSteps => {
            return await opportunityService.override(opportunity.id, { howToSteps: howToSteps.split("<br/>") });
          }}
          onRemove={async () => opportunityService.deleteOverride(opportunity.id, ["howToSteps"])}
        />
        <Divider className="my-xl border-main-6" />

        <Editor
          name="Deposit Url"
          value={opportunity.depositUrl ?? ""}
          onApply={async depositUrl => {
            return await opportunityService.override(opportunity.id, { depositUrl });
          }}
          onRemove={async () => opportunityService.deleteOverride(opportunity.id, ["depositUrl"])}
        />
        <Divider className="my-xl border-main-6" />
      </Scroll>
    </>
  );
}
