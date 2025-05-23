import useBalances from "@core/hooks/useBalances";
import useInteractionTransaction from "@core/hooks/useInteractionTransaction";
import { useMerklConfig } from "@core/modules/config/config.context";
import TransactionOverview from "@core/modules/interaction/components/TransactionOverview";
import useOpportunityMetadata from "@core/modules/opportunity/hooks/useOpportunityMetadata";
import type { Opportunity, Token as TokenType } from "@merkl/api";
import type { InteractionTarget } from "@merkl/api/dist/src/modules/v4/interaction/interaction.model";
import {
  Button,
  type ButtonProps,
  Dropdown,
  Fmt,
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
import RouterStatus from "./RouterStatus";

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
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  const priceImpactValue = useMemo(
    () =>
      transaction?.depositValue &&
      inputToken &&
      transaction.depositValue - Fmt.toPrice(BigInt(amount ?? 0), inputToken),
    [transaction, amount, inputToken],
  );
  const priceImpact = useMemo(
    () => (amount && inputToken ? (priceImpactValue ?? 0) / Fmt.toPrice(BigInt(amount ?? 0), inputToken) : undefined),
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
          tx={{
            ...transaction?.approval,
            value: BigInt(transaction?.approval.value ?? 0n),
          }}>
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
          tx={{
            ...transaction?.transaction,
            value: BigInt(transaction?.transaction?.value ?? 0n),
          }}>
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
    return <RouterStatus name={target.provider} loading={txLoading} error={error} />;
  }, [target, txLoading, error]);

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
            {/* <PrimitiveTag size="sm">
              <Icon src={inputToken.icon} />
              <Value size="sm" format={dollarFormat}>
                {Fmt.toPrice(amount, inputToken)}
              </Value>
            </PrimitiveTag> */}
            {/* <Icon remix="RiArrowRightLine" /> */}
            {providerIcon}
            {transaction && (
              <>
                <Icon remix="RiArrowRightLine" />
                <OverrideTheme coloring={priceImpactLevel}>
                  <Dropdown
                    className="group"
                    content={"Estimated value ($) and price impact (%) of the tokens deposited into the protocol"}>
                    <List size="sm" flex="row">
                      <PrimitiveTag size="sm">
                        <Icon src={opportunity?.protocol?.icon} />
                        <Icons />
                        <Value size="sm" format={dollarFormat}>
                          {transaction?.depositValue}
                        </Value>
                      </PrimitiveTag>
                      <PrimitiveTag size="sm">
                        {priceImpactLevel !== undefined && <Icon className="text-main-11" remix="RiAlertFill" />}
                        <Value size="sm" format="0.###%">
                          {priceImpact ?? 0}
                        </Value>
                      </PrimitiveTag>
                    </List>
                  </Dropdown>
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
