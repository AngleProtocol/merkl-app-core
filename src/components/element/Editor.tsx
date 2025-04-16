import { Button, Group, Icon, Input, Title, Tooltip } from "packages/dappkit/src";
import { useCallback, useMemo, useState } from "react";

export type EditorProps = {
  name: string;
  value: string;
  onApply: (value: string) => Promise<void>;
  onRemove: () => Promise<void>;
};

export default function Editor({ name, value: v, onApply, onRemove }: EditorProps) {
  const [state, setState] = useState<"loading" | "error" | "success" | "none">("none");
  const [value, setValue] = useState<string | undefined>(v);

  const stateIconApply = useMemo(() => {
    switch (state) {
      case "loading":
        return <Icon className="animate-spin" remix="RiLoader2Fill" />;
      case "error":
        return <Icon remix="RiErrorWarningFill" />;
      case "success":
        return <Icon remix="RiCheckboxCircleFill" />;
      default:
        return <Icon remix="RiUpload2Fill" />;
    }
  }, [state]);

  const stateIconRemove = useMemo(() => {
    switch (state) {
      case "loading":
        return <Icon className="animate-spin" remix="RiLoader2Fill" />;
      case "error":
        return <Icon remix="RiErrorWarningFill" />;
      case "success":
        return <Icon remix="RiCheckboxCircleFill" />;
      default:
        return <Icon remix="RiCloseFill" />;
    }
  }, [state]);

  const onApplyValue = useCallback(async () => {
    if (!value) return;
    setState("loading");
    try {
      await onApply(value);
      setState("success");
    } catch (e) {
      console.error(e);
      setState("error");
      return;
    }
  }, [value, onApply]);

  const onRemoveValue = useCallback(async () => {
    setState("loading");
    try {
      await onRemove();
      setState("success");
    } catch (e) {
      console.error(e);
      setState("error");
      return;
    }
  }, [onRemove]);

  return (
    <Group className="flex-col">
      <Group className="items-center w-full justify-between">
        <Title h={4}>{name}</Title>
        <Group className="items-center">
          <Tooltip icon={false} helper={<>Apply the manual override</>}>
            <Button onClick={onApplyValue} className="inline-flex" look="hype">
              {stateIconApply}
            </Button>
          </Tooltip>
          <Tooltip icon={false} helper={<>Delete the manual override and go back to automated metadata building</>}>
            <Button onClick={onRemoveValue} className="inline-flex" look="hype">
              {stateIconRemove}
            </Button>
          </Tooltip>
        </Group>
      </Group>
      <Input look="tint" className="w-full" state={[value, setValue]} />
    </Group>
  );
}
