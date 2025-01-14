import { useNavigate } from "@remix-run/react";
import { Button, Connected, Container, Group, Icon, Input, Space, Text } from "dappkit";
import { useWalletContext } from "dappkit";
import { Fmt } from "dappkit";
import { useState } from "react";
import merklConfig from "../../../config";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { address } = useWalletContext();
  const [inputAddress, setInputAddress] = useState<string>();
  const navigate = useNavigate();

  return (
    <Container>
      {Array(3).fill(<Space size="xl" />)}
      <Group className="w-full items-center flex-col">
        <Group className="w-min justify-center">
          <Space size="xl" />
          <Connected hideSpyMode={merklConfig.hideSpyMode}>
            <Button onClick={() => navigate(`/users/${address}`)} look="hype">
              Open {Fmt.address(address, "short")}
            </Button>
          </Connected>
        </Group>
        <Group className="w-min justify-center">
          <Text>Or</Text>
          <Group className="flex-nowrap">
            <Input placeholder="Enter an address" state={[inputAddress, setInputAddress]} look="tint" />
            <Button onClick={() => inputAddress && navigate(`/users/${inputAddress}`)} size="xl" look="soft">
              <Icon remix="RiSendPlane2Fill" />
            </Button>
          </Group>
        </Group>
      </Group>
    </Container>
  );
}
