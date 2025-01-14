import { useNavigate } from "@remix-run/react";
import { Button, Group, Icon, Input } from "dappkit";
import { useCallback, useState } from "react";

export default function AddressEdit() {
  const navigate = useNavigate();
  const [inputAddress, setInputAddress] = useState<string>();
  const [_isEditingAddress, setIsEditingAddress] = useState(false);

  const onClick = useCallback(() => {
    setIsEditingAddress(false);
    if (!inputAddress) return;
    navigate(`/users/${inputAddress}`);
  }, [inputAddress, navigate]);

  return (
    <Group size="sm">
      <Input state={[inputAddress, setInputAddress]} look="bold" aria-label="Enter address" size="xs" />
      <Button onClick={onClick} size="sm" look="soft" aria-label="Submit address">
        <Icon remix="RiCornerDownRightLine" />
      </Button>
    </Group>
  );
}
