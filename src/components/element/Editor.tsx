import { Button, Group, Icon, Input, Title } from "packages/dappkit/src";
import { useCallback, useMemo, useState } from "react";

export type EditorProps = {
  name: string;
  value: string;
  onApply: (value: string) => Promise<void>;
};

export default function Editor({ name, value: v, onApply }: EditorProps) {
  const [state, setState] = useState<"loading" | "error" | "success" | "none">("none");
  const [value, setValue] = useState<string | undefined>(v);

  const stateIcon = useMemo(() => {
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

  return (
    <Group className="flex-col">
      <Group className="items-center w-full justify-between">
        <Title h={4}>{name}</Title>
        <Button onClick={onApplyValue} look="hype" size="sm">
          Apply {stateIcon}
        </Button>
      </Group>
      <Input look="tint" className="w-full" state={[value, setValue]} />
    </Group>
  );
}
