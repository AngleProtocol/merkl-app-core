import { useNavigate } from "@remix-run/react";
import {
  Box,
  Button,
  Group,
  Icon,
  Input,
  OverrideTheme,
  Space,
  Text,
  Title,
  TransactionButton,
  useTheme,
} from "dappkit";
import { useState } from "react";
import useReferral from "../hooks/useReferral";

export interface ReferProps {
  url?: string;
  code?: string;
}

export default function Referral({ code: defaultCode }: ReferProps) {
  const navigate = useNavigate();
  const [code, setCode] = useState<string | undefined>(defaultCode);
  const { isCodeAvailable, referral } = useReferral(code);
  const [redeemed, setRedeemed] = useState(false);
  const { vars } = useTheme();

  if (redeemed && referral)
    return (
      <OverrideTheme coloring={"good"}>
        <div className="border-accent-10 border-2 rounded-xl+md">
          <Box style={vars} size="xl" className="p-xl*2">
            <Space size="xl" />
            <OverrideTheme coloring={"good"}>
              <Group>
                <Icon className="text-[70px] text-accent-10" remix="RiVerifiedBadgeFill" />
              </Group>
              <Space size="xl" />
              <Title h={3}>Referral confirmed!</Title>
            </OverrideTheme>
            <Text look="base">You're linked to {referral.referrer}</Text>
            <Text look="base">Next step: Deposit in a campaign and earn rewards</Text>
            <Button size="lg" look="hype" className="justify-center" onClick={() => navigate("/")}>
              View Campaigns
            </Button>
            <Space size="xl" />
          </Box>
        </div>
      </OverrideTheme>
    );
  return (
    <Box size="xl" className="p-xl*2">
      <Space size="xl" />
      <Group>
        <Icon className="text-[70px]" remix="RiFundsFill" />
      </Group>
      <Title h={3}>Have a Friend’s Code? Unlock up to 5% boost!</Title>
      <Text look="base">
        Enter your friend's code, confirm on-chain, and you referrer will get up to 5% extra yield once you deposit.
        Learn more
      </Text>
      <Text size="lg" look="bold">
        Enter a friend's code
      </Text>
      <Input state={[code, setCode]} look="base" size="lg" placeholder="JACKMAH" />
      <TransactionButton
        disabled={!isCodeAvailable}
        tx={referral?.transaction}
        onSuccess={() => setRedeemed(true)}
        size="lg"
        look="hype"
        className="justify-center">
        Confirm referral onchain
      </TransactionButton>
      <Space size="xl" />
    </Box>
  );
}
