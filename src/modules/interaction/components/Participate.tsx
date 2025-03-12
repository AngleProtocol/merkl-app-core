import useParticipate from "@core/hooks/useParticipate";
import { useMerklConfig } from "@core/modules/config/config.context";
import OpportunityShortCard from "@core/modules/opportunity/components/items/OpportunityShortCard";
import TokenSelect from "@core/modules/token/components/element/TokenSelect";
import { TokenService } from "@core/modules/token/token.service";
import type { Opportunity } from "@merkl/api";
import { Button, EventBlocker, Group, Icon, Input, PrimitiveTag, Space, Text, Value } from "dappkit";
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

  const isDepositEnabled = useMerklConfig(store => store.config.deposit);
  const decimalFormatDollar = useMerklConfig(store => store.config.decimalFormat.dollar);
  const backend = useMerklConfig(store => store.config.backend);

  const {
    targets,
    balance,
    token: inputToken,
    loading,
  } = useParticipate(opportunity.chainId, opportunity.protocol?.id, opportunity.identifier, tokenAddress);

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
        <Space size="md" />
        <Input.BigInt
          className="w-full gap-xs"
          inputClassName="font-title font-bold italic text-[clamp(38px,0.667vw+1.125rem,46px)] !leading-none"
          look="base"
          size="lg"
          state={[amount, a => setAmount(a)]}
          base={inputToken?.decimals ?? 18}
          footer={
            <Group className="justify-between w-full">
              {inputToken && (
                <Value className="animate-drop" format={decimalFormatDollar}>
                  {Fmt.toPrice(amount ?? 0n, inputToken)}
                </Value>
              )}
            </Group>
          }
          header={
            <Group className="justify-between w-full">
              <Text size={"md"}>{mode === "deposit" ? "Deposit" : "Withdraw"}</Text>
              {inputToken && (
                <Group>
                  <Group className="items-center">
                    {!!inputToken && (
                      <>
                        Balance:{" "}
                        <Value
                          value
                          fallback={v => (v as string).includes("0.000") && "< 0.001"}
                          className="text-right items-center flex font-bold"
                          size="sm"
                          look="bold"
                          format="0,0.###a">
                          {Fmt.toNumber(inputToken?.balance, inputToken.decimals).toString()}
                        </Value>{" "}
                        {inputToken?.symbol}
                      </>
                    )}
                    <Button
                      look="tint"
                      size="xs"
                      onClick={() => {
                        setAmount(BigInt(inputToken?.balance ?? "0"));
                      }}>
                      Max
                    </Button>
                  </Group>
                </Group>
              )}
            </Group>
          }
          suffix={
            connected && (
              <TokenSelect look="tint" balances state={[tokenAddress, setTokenAddress]} tokens={balance ?? []} />
            )
          }
          placeholder="0.0"
        />
        <Space size="lg" />
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
                <EventBlocker>
                  <Input.BigInt
                    base={2}
                    state={[
                      slippage,
                      v => {
                        if (!!v) setSlippage(v);
                      },
                    ]}
                    size="sm"
                    look="tint"
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
                </EventBlocker>
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
    decimalFormatDollar,
  ]);

  useEffect(() => {
    if (!tokenAddress || tokenAddress === "")
      setTokenAddress((balance && TokenService({ backend }).sortForUser(balance)?.[0]?.address) ?? "");
  }, [balance, tokenAddress, backend]);

  return (
    <>
      {displayOpportunity && (
        <>
          <Space />
          <OpportunityShortCard opportunity={opportunity} displayLinks={displayLinks} />
        </>
      )}

      {loading && !!isDepositEnabled && (
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
      {!loading && !!interactor && (
        <>
          <Space />
          <Text size="xs" look="bold" bold>
            Deposit a single token— It will be automatically swapped and split 50/50 in this pool to provide liquidity
            in a wide-range position. Check price impact before confirming. For custom settings, visit the protocol’s
            app below.
          </Text>
        </>
      )}
    </>
  );
}
