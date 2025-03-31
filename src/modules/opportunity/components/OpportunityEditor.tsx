import { useMerklConfig } from "@core/modules/config/config.context";
import type { Opportunity } from "@merkl/api";
import { Button, type ButtonProps, Icon, Modal } from "packages/dappkit/src";
import OpportunityEditorModal from "./OpportunityEditorModal";

export interface OpportunityEditorProps extends ButtonProps {
  opportunity: Opportunity;
}

export default function OpportunityEditor({ opportunity, ...props }: OpportunityEditorProps) {
  const editable = useMerklConfig(store => store.config.editable);

  if (!editable) return;
  return (
    <Modal modal={<OpportunityEditorModal opportunity={opportunity} />}>
      <Button look="hype" size="xs" {...props}>
        Edit
        <Icon remix="RiEdit2Fill" />
      </Button>
    </Modal>
  );
}
