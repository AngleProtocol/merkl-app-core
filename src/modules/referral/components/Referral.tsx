import { useMerklConfig } from "@core/modules/config/config.context";
import { useNavigate } from "@remix-run/react";
import {
  Box,
  Button,
  Connected,
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
import { useMemo, useState } from "react";
import { zeroAddress } from "viem";
import useReferral from "../hooks/useReferral";
import ReferralCalculationTooltip from "./ReferralCalculationTooltip";

export interface ReferalProps {
  url?: string;
  code?: string;
}

export default function Referral({ code: defaultCode }: ReferalProps) {
  const referralConfig = useMerklConfig(store => store.config.referral);
  const navigate = useNavigate();
  const [code, setCode] = useState<string | undefined>(defaultCode);
  const { isCodeAvailable, referral } = useReferral(code);
  const [redeemed, setRedeemed] = useState(false);
  const [exampleCode] = useState([1, 2, 3, 4, 5, 6].map(() => Math.floor(Math.random() * 10)).join(""));
  const { vars } = useTheme();

  const validity = useMemo(() => {
    if (!referral || !code || code === "") return;
    if (referral?.referrer === zeroAddress) return "harm";
    if (referral?.referrer) return "good";
  }, [referral, code]);

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
        <ReferralCalculationTooltip />
      </Text>
      <OverrideTheme coloring={validity}>
        <Input
          header={
            <Text size="sm" className="flex flex-nowrap gap-xs">
              Enter a friend's code
            </Text>
          }
          state={[code, setCode]}
          look="base"
          size="lg"
          placeholder={`${referralConfig?.referralKey}-${exampleCode}`}
        />
        {validity === "harm" && (
          <Text className="flex gap-md">
            <Icon remix="RiErrorWarningFill" /> Use a valid code
          </Text>
        )}
      </OverrideTheme>
      <Connected chain={referralConfig?.chainId} size="lg" look="hype" className="justify-center">
        <TransactionButton
          name={"Redeem a referral code"}
          disabled={!isCodeAvailable || validity === "harm"}
          tx={referral?.transaction}
          onSuccess={() => setRedeemed(true)}
          size="lg"
          look="hype"
          className="gap-xs hover:border-accent-8 cursor-pointer justify-center">
          Confirm Referral Onchain
          <Icon remix="RiArrowRightUpLine" />
        </TransactionButton>
      </Connected>
      <Space size="xl" />
    </Box>
  );
}
