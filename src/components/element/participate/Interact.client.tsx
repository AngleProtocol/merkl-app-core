import type { Opportunity } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import {
  Box,
  Button,
  type ButtonProps,
  Checkbox,
  Collapsible,
  Group,
  Icon,
  PrimitiveTag,
  Space,
  Text,
  WalletButton,
} from "dappkit";
import TransactionButton from "packages/dappkit/src/components/dapp/TransactionButton";
import { useWalletContext } from "packages/dappkit/src/context/Wallet.context";
import { useMemo, useState } from "react";
import useBalances from "src/hooks/useBalances";
import useInteractionTransaction from "src/hooks/useInteractionTransaction";
import Token from "../token/Token";

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
  const { chainId, switchChain, address: user, sponsorTransactions, setSponsorTransactions } = useWalletContext();
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
    if (target.provider === "enso")
      return (
        <>
          <Icon src="https://framerusercontent.com/images/19ye5oms8sG6XHF1K8p03vLNkg.png" /> Enso
        </>
      );
    if (target.provider === "zap")
      return (
        <>
          <Icon src="https://docs.kyberswap.com/~gitbook/image?url=https%3A%2F%2F1368568567-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fw1XgQJc40kVeGUIxgI7c%252Ficon%252FYl1TDE5MQwDPbEsfCerK%252Fimage%2520%281%29.png%3Falt%3Dmedia%26token%3D3f984a53-8b11-4d1b-b550-193d82610e7b&width=32&dpr=1&quality=100&sign=a7af3e95&sv=2" />{" "}
          Zap
        </>
      );
  }, [target]);

  const canTransactionBeSponsored = opportunity.chainId === 324;
  const [settingsCollapsed, setSettingsCollapsed] = useState<boolean>(false);

  return (
    <>
      <Space size="sm" />
      <Box content="sm" className="w-full !gap-0 !bg-main-2" look="base">
        <Group className="w-full flex-nowrap">
          <Group className="grow items-center">
            {amount && inputToken && (
              <Text className="flex animate-drop grow flex-nowrap items-center gap-md" size={6}>
                Supply
                <Token key={amount} className="animate-drop" token={inputToken} amount={amount} format="price" /> with{" "}
                {providerIcon}
              </Text>
            )}
          </Group>
          <PrimitiveTag
            onClick={() => setSettingsCollapsed(o => !o)}
            size="sm"
            look="base"
            className="flex flex-nowrap gap-md">
            <Icon remix="RiSettings3Line" />
            <Icon
              data-state={!settingsCollapsed ? "closed" : "opened"}
              className={"transition duration-150 ease-out data-[state=opened]:rotate-180"}
              remix="RiArrowDownSLine"
            />
          </PrimitiveTag>
        </Group>
        <Collapsible state={[settingsCollapsed]}>
          <Space size="md" />
          {canTransactionBeSponsored && (
            <Group className="justify-between w-full items-center">
              <Text>Gasless</Text>
              <Checkbox size="sm" state={[sponsorTransactions, setSponsorTransactions]} />
            </Group>
          )}
          {settings}
        </Collapsible>
      </Box>
      <Space size="xl" />
      {currentInteraction}
    </>
  );
}
