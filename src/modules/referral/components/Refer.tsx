import { useMerklConfig } from "@core/modules/config/config.context";
import {
  Box,
  Button,
  Connected,
  Divider,
  Group,
  Icon,
  OverrideTheme,
  Space,
  Text,
  Title,
  TransactionButton,
  useClipboard,
  useTheme,
} from "dappkit";
import { useMemo } from "react";
import { useLocation } from "react-router";
import useReferrer from "../hooks/useReferrer";
import ReferralCalculationTooltip from "./ReferralCalculationTooltip";

export interface ReferProps {
  url?: string;
}

export default function Refer({ url }: ReferProps) {
  const { isReferrer, referral, reload } = useReferrer();
  const { copy: copyCode, isCopied: isCodeCopied } = useClipboard();
  const { copy: copyLink, isCopied: isLinkCopied } = useClipboard();
  const location = useLocation();
  const { vars } = useTheme();
  const appName = useMerklConfig(store => store.config.appName);
  const referralConfig = useMerklConfig(store => store.config.referral);

  const shareMessage = useMemo(() => {
    if (referral) return `Join me on ${appName} and earn a +5% boost using my referral code: ${referral.code}`;
  }, [referral, appName]);

  if (isReferrer && referral && shareMessage)
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
              <Title h={3}>Code generated</Title>
            </OverrideTheme>
            <Text look="base">
              Send this link to friends so you can earn up to +5% when they deposit. <ReferralCalculationTooltip />
            </Text>
            <Box
              size="lg"
              className="gap-xs hover:border-accent-8 cursor-pointer"
              onClick={() => copyCode(referral.code)}
              look="bold">
              <Text size="sm" className="flex flex-nowrap gap-xs">
                Copy code <Icon remix={!isCodeCopied ? "RiFileCopyLine" : "RiCheckboxCircleFill"} />
              </Text>
              <Text size="lg">{referral.code}</Text>
            </Box>
            <Button
              size="lg"
              look="hype"
              className="justify-center"
              onClick={() => copyLink(`${url}${location.pathname}?code=${referral.code}`)}>
              Copy Referral Link <Icon remix={!isLinkCopied ? "RiFileCopyLine" : "RiCheckboxCircleFill"} />
            </Button>
            <Group size="xl" className="w-full justify-center">
              <Button
                onClick={() =>
                  window.open(
                    `https://wa.me/?text=${shareMessage} ${`${url}${location.pathname}?code=${referral.code}`}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                size="xl"
                look="hype">
                <Icon remix="RiWhatsappLine" />
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://t.me/share/url?url=${`${url}${location.pathname}?code=${referral.code}`}&text=${shareMessage}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                size="xl"
                look="hype">
                <Icon remix="RiTelegram2Fill" />
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://x.com/intent/post?text=${encodeURIComponent(shareMessage)} ${encodeURIComponent(`${url}${location.pathname}?code=${referral.code}`)}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                size="xl"
                look="hype">
                <Icon remix="RiTwitterXFill" />
              </Button>
            </Group>
            <Divider horizontal className="border-main-6" />
            <Group className="w-full font-bold">
              <Text>Total Referrals: {referral?.referredUsers?.length} </Text>
            </Group>
            <Space size="xl" />
          </Box>
        </div>
      </OverrideTheme>
    );
  return (
    <Box size="xl" className="p-xl*2 hover:border-accent-10 border-main-0 border-2">
      <Space size="xl" />
      <Group>
        <Icon className="text-[70px] text-accent-10" remix="RiGiftFill" />
      </Group>
      <Title h={3}>Invite Friends & get +5% more!</Title>
      <Text look="base">
        Generate a referral code via a quick on-chain transaction. Share it. When your friend deposits, Earn an
        additional 5% yield on your referee deposit. <ReferralCalculationTooltip />
      </Text>
      <Connected chain={referralConfig?.chainId} size="lg" look="hype" className="justify-center">
        <TransactionButton
          name="Become a referrer"
          onSuccess={reload}
          tx={{
            ...referral?.transaction,
            value: BigInt(referral?.transaction?.value ?? 0n),
          }}
          size="lg"
          look="hype"
          className="justify-center">
          Generate Code
        </TransactionButton>
      </Connected>
      <Space size="xl" />
    </Box>
  );
}
