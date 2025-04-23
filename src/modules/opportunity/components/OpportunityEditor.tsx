import type { Opportunity } from "@merkl/api";
import { Button, type ButtonProps, Icon, Modal } from "dappkit";
import OpportunityEditorModal from "./OpportunityEditorModal";

export interface OpportunityEditorProps extends ButtonProps {
  opportunity: Opportunity;
}

export default function OpportunityEditor({ opportunity }: OpportunityEditorProps) {
  return (
    <Button className="inline-flex" look="hype" size="md">
      <Modal modal={<OpportunityEditorModal opportunity={opportunity} />}>
        <Icon remix="RiEdit2Fill" size="sm" />
      </Modal>
    </Button>
  );
}
