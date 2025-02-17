import merklConfig from "@core/config";
import useBalances from "@core/hooks/useBalances";
import useInteractionTransaction from "@core/hooks/useInteractionTransaction";
import TransactionOverview from "@core/modules/interaction/components/TransactionOverview";
import useOpportunityMetadata from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import Token from "@core/modules/token/components/element/Token";
import type { Opportunity, Token as TokenType } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import {
  Button,
  type ButtonProps,
  Divider,
  Dropdown,
  Fmt,
  Group,
  Icon,
  List,
  OverrideTheme,
  PrimitiveTag,
  Space,
  Text,
  Value,
  WalletButton,
} from "dappkit";
import { TransactionButton } from "dappkit";
import { useWalletContext } from "dappkit";
import { type ReactNode, useMemo, useState } from "react";

export type InteractProps = {
  opportunity: Opportunity;
  target?: InteractionTarget;
  inputToken?: TokenType & { balance: bigint };
  tokenAddress?: string;
  amount?: bigint;
  slippage?: bigint;
  disabled?: boolean;
  settings?: ReactNode;
  onSuccess?: (hash: string) => void;
};

const PRICE_IMPACT_WARN_LEVEL = -0.05; //5%
const PRICE_IMPACT_FORBID_LEVEL = -0.5; //50%

export default function Interact({
  opportunity,
  onSuccess,
  settings,
  inputToken,
  slippage,
  amount,
  target,
  disabled,
}: InteractProps) {
  const { chainId, switchChain, address: user } = useWalletContext();
  const {
    transaction,
    reload,
    loading: txLoading,
    error,
  } = useInteractionTransaction(
    opportunity.chainId,
    opportunity.protocol?.id,
    target,
    inputToken,
    amount,
    user,
    slippage,
  );
  const [_approvalHash, setApprovalHash] = useState<string>();
  const { reload: reloadBalances } = useBalances();
  const { Icons } = useOpportunityMetadata(opportunity);

  const priceImpactValue = useMemo(
    () => transaction && inputToken && transaction.depositValue - Fmt.toPrice(BigInt(amount ?? 0), inputToken),
    [transaction, amount, inputToken],
  );
  const priceImpact = useMemo(
    () => amount && inputToken && (priceImpactValue ?? 0) / Fmt.toPrice(BigInt(amount ?? 0), inputToken),
    [priceImpactValue, amount, inputToken],
  );

  const currentInteraction = useMemo(() => {
    let buttonProps: ButtonProps | undefined = undefined;
    const commonProps = { size: "lg", look: "hype", className: "justify-center w-full" } as const;
    const createProps: (bp: ButtonProps) => void = bp => {
      buttonProps = Object.assign(commonProps, bp ?? {});
    };

    if (disabled) createProps({ disabled: true, children: "Cannot interact" });
    else if (!user) return <WalletButton {...commonProps} />;
    else if (priceImpact && priceImpact <= PRICE_IMPACT_FORBID_LEVEL)
      createProps({ disabled: true, children: "Price impact too high" });
    else if (chainId !== opportunity.chainId)
      createProps({ children: `Switch to ${opportunity.chain.name}`, onClick: () => switchChain(opportunity.chainId) });
    else if (!inputToken) createProps({ disabled: true, children: "Select a token" });
    else if (!amount || amount === 0n) createProps({ disabled: true, children: "Enter an amount" });
    else if (amount > inputToken.balance) createProps({ disabled: true, children: "Exceeds balance" });
    else if (!transaction && !txLoading)
      createProps({
        disabled: true,
        children: (
          <>
            <Icon remix="RiProhibitedLine" /> No route found, try with another token
          </>
        ),
      });
    else if (!transaction || txLoading)
      createProps({
        disabled: true,
        children: (
          <>
            <Icon className="animate-spin" remix="RiLoader2Fill" /> Loading...
          </>
        ),
      });
    else if (transaction.approved && !transaction.transaction)
      createProps({
        disabled: true,
        children: (
          <>
            <Icon remix="RiProhibitedLine" /> An error occured
          </>
        ),
      });

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    if (buttonProps || !transaction) return <Button {...(buttonProps as any)} />;

    if (!transaction.approved)
      return (
        <TransactionButton
          iconProps={{ remix: "RiFingerprintLine" }}
          onExecute={h => {
            setApprovalHash(h);
            reload();
          }}
          onSuccess={() => reloadBalances()}
          name={`Approve ${inputToken?.symbol}`}
          {...commonProps}
          tx={transaction?.approval}>
          Approve
        </TransactionButton>
      );

    if (transaction.transaction)
      return (
        <TransactionButton
          iconProps={{ remix: "RiTokenSwapLine" }}
          onSuccess={hash => {
            reloadBalances();
            reload();
            onSuccess?.(hash);
          }}
          {...commonProps}
          name={`Supply ${inputToken?.symbol} on ${opportunity.protocol?.name}`}
          tx={transaction?.transaction}>
          Participate
        </TransactionButton>
      );
  }, [
    chainId,
    opportunity,
    inputToken,
    reloadBalances,
    amount,
    transaction,
    disabled,
    priceImpact,
    switchChain,
    user,
    txLoading,
    reload,
    onSuccess,
  ]);

  const providerIcon = useMemo(() => {
    if (!target) return;
    if (target.provider === "enso")
      return (
        <>
          <Dropdown
            content={
              <Group className="flex-col max-w-[42ch]">
                <Text size="sm">
                  Enso provides abstract on-chain actions, shortcuts and routes that allows dApps to find the best
                  routes to interact with other protocols.
                </Text>
                {/* TODO: parse actions and find a way to display them better than following: */}
                {/* <Divider look="soft" horizontal /> */}
                {/* {transaction?.actions?.map(({ action, tokens, from, to, ...t }) => {
                  switch (action) {
                    case "fee":
                      return (
                        <Group className="items-center">
                          Fee:{" "}
                          {tokens.map((token) => (
                            <Token className="items-center" key={token.symbol} format="amount_price" token={token} amount={token.amount} />
                          ))}
                        </Group>
                      );
                    case "swap":
                      return (
                        <Group className="items-center">
                          Swap: <Token token={from} amount={from.amount} />
                          <Icon remix="RiArrowRightLine" />
                          <Token token={to} format="amount_price" amount={to.amount} />
                        </Group>
                      );
                    case "deposit":
                      return (
                        <Group className="items-center">
                          Deposit:{" "}
                          {tokens.map(token => (
                            <Token format="amount_price" token={token} amount={token.amount} />
                          ))}
                          {t.tokensOut?.length && <Icon remix="RiArrowRightLine" />}
                          {t.tokensOut?.map(token => (
                            <Token format="amount_price" token={token} amount={token.amount || undefined} />
                          ))}
                        </Group>
                      );
                  }
                })} */}
                <Divider look="soft" horizontal />
                <Group className="flex-col">
                  <Button to={"https://www.enso.build/"} size="xs" look="soft">
                    <Icon remix="RiArrowRightLine" /> Visit Enso
                  </Button>
                </Group>
              </Group>
            }>
            <OverrideTheme coloring={!txLoading && error ? "harm" : undefined}>
              <PrimitiveTag size="sm" className="items-center">
                <Icon src="https://framerusercontent.com/images/19ye5oms8sG6XHF1K8p03vLNkg.png" /> Enso
                {txLoading && <Icon remix="RiLoader2Fill" className="animate-spin" />}
                {!txLoading && error && <Icon remix="RiCloseFill" className="animate-drop" />}
              </PrimitiveTag>
            </OverrideTheme>
          </Dropdown>
        </>
      );
    if (target.provider === "zap")
      return (
        <>
          <Dropdown
            content={
              <Group className="flex-col max-w-[42ch]">
                <Text size="sm">
                  Zap enables users to effortlessly add liquidity into any concentrated liquidity protocol using any
                  tokens, thanks to the KyberSwap aggregator.
                </Text>
                {/* TODO: parse actions and find a way to display them better than following: */}
                {/* <Divider look="soft" horizontal /> */}
                {/* {transaction?.actions?.map(({ action, tokens, from, to }) => {
                  switch (action) {
                    case "fee":
                      return (
                        <Group>
                          Fee:{" "}
                          {tokens.map(token => (
                            <Token token={token} amount={token.amount} />
                          ))}
                        </Group>
                      );
                    case "swap":
                      return (
                        <Group>
                          Swap: <Token token={from} amount={from.amount} />
                          <Icon remix="RiArrowRightLine" />
                          <Token token={to} amount={to.amount} />
                        </Group>
                      );
                    case "deposit":
                      return (
                        <Group>
                          Deposit:{" "}
                          {tokens.map(token => (
                            <Token token={token} amount={token.amount} />
                          ))}
                        </Group>
                      );
                  }
                })} */}
                <Divider look="soft" horizontal />
                <Group className="flex-col">
                  <Button
                    to={"https://docs.kyberswap.com/kyberswap-solutions/kyberswap-zap-as-a-service"}
                    size="xs"
                    look="soft">
                    <Icon remix="RiArrowRightLine" /> Visit Kyberswap Zap
                  </Button>
                </Group>
              </Group>
            }>
            <PrimitiveTag size="sm">
              <Icon src="https://docs.kyberswap.com/~gitbook/image?url=https%3A%2F%2F1368568567-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fw1XgQJc40kVeGUIxgI7c%252Ficon%252FYl1TDE5MQwDPbEsfCerK%252Fimage%2520%281%29.png%3Falt%3Dmedia%26token%3D3f984a53-8b11-4d1b-b550-193d82610e7b&width=32&dpr=1&quality=100&sign=a7af3e95&sv=2" />{" "}
              Kyberswap Zap
              {txLoading && <Icon remix="RiLoader2Fill" className="animate-spin" />}
            </PrimitiveTag>
          </Dropdown>
        </>
      );
  }, [target, txLoading, transaction, error]);

  const canTransactionBeSponsored = opportunity.chainId === 324;
  const priceImpactLevel = useMemo(() => {
    if (!priceImpact) return "warn";
    if (priceImpact <= PRICE_IMPACT_FORBID_LEVEL) return "harm";
    if (priceImpact <= PRICE_IMPACT_WARN_LEVEL) return "warn";
    return;
  }, [priceImpact]);

  return (
    <>
      <Space size="sm" />
      <TransactionOverview settings={settings} allowTxSponsoring={canTransactionBeSponsored}>
        {!!amount && !!inputToken && (
          <Text className="flex animate-drop grow flex-nowrap items-center gap-sm" size={6}>
            <PrimitiveTag size="sm">
              <Icon src={inputToken.icon} />
              <Value size="sm" format={merklConfig.decimalFormat.dollar}>
                {Fmt.toPrice(amount, inputToken)}
              </Value>
            </PrimitiveTag>
            <Icon remix="RiArrowRightLine" />
            {providerIcon}
            {transaction && (
              <>
                <Icon remix="RiArrowRightLine" />
                <OverrideTheme coloring={priceImpactLevel}>
                  <List size="sm" flex="row">
                    <PrimitiveTag size="sm">
                      <Icon src={opportunity?.protocol?.icon} />
                      <Icons />
                      <Value size="sm" format={merklConfig.decimalFormat.dollar}>
                        {transaction.depositValue}
                      </Value>
                    </PrimitiveTag>
                    <PrimitiveTag size="sm">
                      {priceImpactLevel !== undefined && <Icon className="text-main-11" remix="RiAlertFill" />}
                      <Value size="sm" format="0.###%">
                        {priceImpact ?? 0}
                      </Value>
                    </PrimitiveTag>
                  </List>
                </OverrideTheme>
              </>
            )}
          </Text>
        )}
      </TransactionOverview>
      <Space size="xl" />
      {currentInteraction}
    </>
  );
}
