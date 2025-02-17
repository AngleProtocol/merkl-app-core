import { I18n } from "@core/I18n";
import merklConfig from "@core/config";
import useParticipate from "@core/hooks/useParticipate";
import OpportunityShortCard from "@core/modules/opportunity/components/items/OpportunityShortCard";
import useOpportunityData from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import TokenSelect from "@core/modules/token/components/element/TokenSelect";
import { TokenService } from "@core/modules/token/token.service";
import type { Opportunity } from "@merkl/api";
import { useLocation } from "@remix-run/react";
import { Button, Group, Icon, Input, PrimitiveTag, Space, Text, Value } from "dappkit";
import { Box, Collapsible } from "dappkit";
import { useWalletContext } from "dappkit";
import { Fmt } from "dappkit";
import { Suspense, useEffect, useMemo, useState } from "react";
import Interact from "./Interact.client";

export type ParticipateProps = {
  opportunity: Opportunity;
  displayOpportunity?: boolean;
  displayMode?: boolean | "withdraw" | "deposit";
  displayLinks?: boolean;
  hideInteractor?: boolean;
};

const DEFAULT_SLIPPAGE = 200n;

export default function Participate({
  opportunity,
  displayOpportunity,
  displayMode,
  displayLinks,
  hideInteractor,
}: ParticipateProps) {
  const [tokenAddress, setTokenAddress] = useState("");
  const [amount, setAmount] = useState<bigint>();
  const [mode] = useState<"deposit" | "withdraw">(typeof displayMode === "string" ? displayMode : "deposit");

  const {
    targets,
    balance,
    token: inputToken,
    loading,
  } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier, tokenAddress);

  const { link } = useOpportunityData(opportunity);
  const location = useLocation();
  const isOnOpportunityPage = location.pathname.includes("/opportunities/");
  const [success, setSuccess] = useState(false);

  const { connected } = useWalletContext();

  //TODO: add withdraw
  // const switchModeButton = useMemo(() => {
  //   if (typeof displayMode === "boolean" && !displayMode) return;
  //   switch (mode) {
  //     case "deposit":
  //       return (
  //         <Button onClick={() => setMode("withdraw")} size="sm">
  //           Withdraw
  //         </Button>
  //       );
  //     case "withdraw":
  //       return (
  //         <Button onClick={() => setMode("deposit")} size="sm">
  //           Supply
  //         </Button>
  //       );
  //   }
  // }, [mode]);    if (hideInteractor) return;

  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE);

  const interactor = useMemo(() => {
    if (hideInteractor || loading || !targets?.length) return;
    return (
      <Group className="mt-md !gap-0">
        <Input.BigInt
          className="w-full gap-xs"
          inputClassName="font-title font-bold italic text-[clamp(38px,0.667vw+1.125rem,46px)] !leading-none"
          look="bold"
          size="lg"
          state={[amount, a => setAmount(a)]}
          base={inputToken?.decimals ?? 18}
          footer={<Group className="justify-between w-full">
            {inputToken && <Value className="animate-drop" format={merklConfig.decimalFormat.dollar}>{Fmt.toPrice(amount ?? 0n, inputToken)}</Value>}
          </Group>}
          header={
            <Group className="justify-between w-full">
              <Text size={5}>{mode === "deposit" ? "Supply" : "Withdraw"}</Text>
              {inputToken && (
                <Button
                  onClick={() => {
                    setAmount(BigInt(inputToken?.balance ?? "0"));
                  }}
                  look="soft"
                  size="xs">
                  <Group className="items-center">
                    {!!inputToken && (
                      <PrimitiveTag noClick size="sm">
                        <Value
                          fallback={v => (v as string).includes("0.000") && "< 0.001"}
                          className="text-right items-center flex font-bold"
                          size="sm"
                          look="bold"
                          format="0,0.###a">
                          {Fmt.toNumber(inputToken?.balance, inputToken.decimals).toString()}
                        </Value>{" "}
                        {inputToken?.symbol}
                      </PrimitiveTag>
                    )}
                    {!!BigInt(inputToken?.balance ?? "0") && (
                      <Value className="text-right" look={"soft"} size="sm" format={merklConfig.decimalFormat.dollar}>
                        {Fmt.toPrice(inputToken?.balance, inputToken)}
                      </Value>
                    )}
                    Max
                  </Group>
                </Button>
              )}
            </Group>
          }
          suffix={connected && <TokenSelect balances state={[tokenAddress, setTokenAddress]} tokens={balance ?? []} />}
          placeholder="0.0"
        />
        <Suspense>
          <Interact
            onSuccess={() => {
              setAmount(undefined);
              setSuccess(true);
            }}
            disabled={!loading && !targets?.length}
            target={targets?.[0]}
            slippage={slippage}
            inputToken={inputToken}
            amount={amount}
            opportunity={opportunity}
            settings={
              <Group className="justify-between w-full items-center">
                <Text>Slippage</Text>
                <Input.BigInt
                  base={2}
                  state={[
                    slippage,
                    v => {
                      if (!!v) setSlippage(v);
                    },
                  ]}
                  size="sm"
                  className="max-w-[20ch] !rounded-sm+sm"
                  prefix={
                    <Group size="xs">
                      {[50n, 100n, 200n].map(_slippage => (
                        <PrimitiveTag
                          key={_slippage}
                          onClick={() => setSlippage(_slippage)}
                          look={_slippage === slippage ? "hype" : "base"}
                          size="xs">
                          <Value value format="0.#%">
                            {Fmt.toNumber(_slippage, 4)}
                          </Value>
                        </PrimitiveTag>
                      ))}
                    </Group>
                  }
                />
              </Group>
            }
          />
        </Suspense>
      </Group>
    );
  }, [
    opportunity,
    hideInteractor,
    mode,
    inputToken,
    slippage,
    loading,
    amount,
    tokenAddress,
    balance,
    targets,
    connected,
  ]);

  useEffect(() => {
    if (!tokenAddress || tokenAddress === "")
      setTokenAddress((balance && TokenService.sortForUser(balance)?.[0]?.address) ?? "");
  }, [balance, tokenAddress]);

  return (
    <>
      {displayOpportunity && (
        <>
          <Space />
          <OpportunityShortCard opportunity={opportunity} displayLinks={displayLinks} />
        </>
      )}

      {displayLinks && !isOnOpportunityPage && (
        <>
          <Space />
          <Button to={link} className="mt-sm" look="soft" size="sm">
            Opportunity overview <Icon remix="RiArrowRightLine" />
          </Button>
        </>
      )}

      {!loading && !!interactor && (
        <>
          <Space />
          <Box look="soft" className="gap-xs bg-main-5">
            <Group className="flex flex-nowrap">
              <Icon coloring={"warn"} remix="RiErrorWarningFill" className="text-accent-11 flex-shrink-0" />
              <Text size="sm">{I18n.trad.get.pages.home.depositInformation}</Text>
            </Group>
          </Box>
        </>
      )}
      {loading && !!merklConfig.deposit && (
        <Group className="w-full justify-center mt-md">
          <Icon remix="RiLoader2Line" className="animate-spin" />
        </Group>
      )}
      <Collapsible state={[!!interactor, () => {}]}>{interactor}</Collapsible>

      <Collapsible state={[success, () => {}]}>
        <Box look="soft" className="gap-xs bg-main-5 mt-md">
          <Group>
            <Icon coloring={"good"} remix="RiCheckboxCircleFill" className="text-accent-12" />
            <Text look="bold" className="font-bold">
              Deposit successful !
            </Text>
          </Group>
          <Text size="sm">
            Your liquidity is now earning rewards (if any are currently being distributed to this opportunity). You'll
            soon be able to claim them directly from your dashboard. You can monitor your positions and withdraw your
            liquidity anytime directly through the protocol app.
          </Text>
        </Box>
      </Collapsible>
    </>
  );
}
