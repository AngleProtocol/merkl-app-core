import { useMerklConfig } from "@core/modules/config/config.context";
import { useNavigate } from "@remix-run/react";
import { Box, Button, Connected, Container, Group, Icon, Input, Space, Text, Title } from "dappkit";
import { useWalletContext } from "dappkit";
import { Fmt } from "dappkit";
import { useEffect, useState } from "react";

export default function Index() {
  const [_isEditingAddress] = useState(false);
  const { connected, address } = useWalletContext();
  const [inputAddress, setInputAddress] = useState<string>();
  const navigate = useNavigate();
  const hideSpyMode = useMerklConfig(store => store.config.hideSpyMode);

  useEffect(() => {
    if (connected) navigate(`/users/${address}`);
  }, [address, connected, navigate]);

  return (
    <Container>
      {Array(3).fill(<Space size="xl" />)}
      <Group className="w-full items-center flex-col">
        <Box size="xl" className="p-xl min-w-full  md:p-xl*4 md:min-w-[500px]">
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
            <Connected size="lg" className="w-full justify-center" hideSpyMode={hideSpyMode}>
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
