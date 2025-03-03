import { useNavigate } from "@remix-run/react";
import { Box, Button, Connected, Container, Group, Icon, Input, Space, Text, Title } from "dappkit";
import { useWalletContext } from "dappkit";
import { Fmt } from "dappkit";
import { useEffect, useState } from "react";
import merklConfig from "../../../config";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { connected, address } = useWalletContext();
  const [inputAddress, setInputAddress] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    if (connected) navigate(`/users/${address}`);
  }, [address, connected, navigate]);

  return (
    <Container>
      {Array(3).fill(<Space size="xl" />)}
      <Group className="w-full items-center flex-col">
        <Box size="xl" className="p-xl*4 min-w-[500px]">
          {/* <Space size="xl" /> */}
          <Title h={5} className="uppercase text-main-11">
            Enter an address
          </Title>
          <Input
            placeholder="Address"
            state={[inputAddress, setInputAddress]}
            look="tint"
            size="lg"
            className="w-full"
            suffix={
              <Button
                disabled={!inputAddress || inputAddress === ""}
                onClick={() => inputAddress && navigate(`/users/${inputAddress}`)}
                size="xl"
                look="soft">
                <Icon remix="RiArrowRightLine" />
              </Button>
            }
          />
          <Group className="w-full items-center flex-col">
            <Text>or</Text>
          </Group>
          <Group className="justify-center">
            <Connected size="lg" className="w-full justify-center" hideSpyMode={merklConfig.hideSpyMode}>
              <Button
                size="lg"
                className="w-full justify-center"
                onClick={() => navigate(`/users/${address}`)}
                look="hype">
                Redirecting to {Fmt.address(address, "short")} <Icon remix="RiLoader2Fill" className="animate-spin" />
              </Button>
            </Connected>
          </Group>
        </Box>
      </Group>
    </Container>
  );
}
