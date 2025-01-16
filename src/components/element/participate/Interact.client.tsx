import type { Opportunity } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import {
  Button,
  type ButtonProps,
  Divider,
  Dropdown,
  Group,
  Icon,
  PrimitiveTag,
  Space,
  Text,
  WalletButton,
} from "dappkit";
import { TransactionButton } from "dappkit";
import { useWalletContext } from "dappkit";
import { useMemo, useState } from "react";
import useBalances from "../../../hooks/useBalances";
import useInteractionTransaction from "../../../hooks/useInteractionTransaction";
import Token from "../token/Token";
import TransactionOverview from "../transaction/TransactionOverview";

export type InteractProps = {
  opportunity: Opportunity;
  target?: InteractionTarget;
  inputToken?: Token;
  tokenAddress?: string;
  amount?: bigint;
  slippage?: bigint;
  disabled?: boolean;
  settings?: ReactNode;
  onSuccess?: (hash: string) => void;
};

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

  const currentInteraction = useMemo(() => {
    let buttonProps: ButtonProps | undefined = undefined;
    const commonProps = { size: "lg", look: "hype", className: "justify-center w-full" } as const;
    const createProps: (bp: ButtonProps) => void = bp => {
      buttonProps = Object.assign(commonProps, bp ?? {});
    };

    if (disabled) createProps({ disabled: true, children: "Cannot interact" });
    else if (!user) return <WalletButton {...commonProps} />;
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
    if (buttonProps) return <Button {...(buttonProps as any)} />;

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
                <Divider look="soft" horizontal />
                <Group className="flex-col">
                  <Button to={"https://www.enso.build/"} size="xs" look="soft">
                    <Icon remix="RiArrowRightLine" /> Visit Enso
                  </Button>
                </Group>
              </Group>
            }>
            <PrimitiveTag size="sm">
              <Icon src="https://framerusercontent.com/images/19ye5oms8sG6XHF1K8p03vLNkg.png" /> Enso
            </PrimitiveTag>
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
            </PrimitiveTag>
          </Dropdown>
        </>
      );
  }, [target]);

  const canTransactionBeSponsored = opportunity.chainId === 324;

  return (
    <>
      <Space size="sm" />
      <TransactionOverview settings={settings} allowTxSponsoring={canTransactionBeSponsored}>
        {amount && inputToken && (
          <Text className="flex animate-drop grow flex-nowrap items-center gap-md" size={6}>
            Supply
            <Token key={amount} className="animate-drop" token={inputToken} amount={amount} format="price" /> with{" "}
            {providerIcon}
          </Text>
        )}
      </TransactionOverview>
      <Space size="xl" />
      {currentInteraction}
    </>
  );
}
