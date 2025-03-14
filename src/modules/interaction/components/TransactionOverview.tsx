import {
  Box,
  Button,
  Checkbox,
  Collapsible,
  Divider,
  Dropdown,
  Group,
  Icon,
  PrimitiveTag,
  Space,
  Text,
  useWalletContext,
} from "dappkit";
import { type ReactNode, useState } from "react";

export interface TransactionOverviewProps {
  gas?: number;
  allowTxSponsoring?: boolean;
  settings?: ReactNode;
  children?: ReactNode;
}

export default function TransactionOverview({ allowTxSponsoring, settings, children }: TransactionOverviewProps) {
  const { sponsorTransactions, setSponsorTransactions } = useWalletContext();
  const [settingsCollapsed, setSettingsCollapsed] = useState<boolean>(false);

  return (
    <Box
      content="sm"
      size="lg"
      className="w-full !gap-0 !bg-main-0 border-main-10"
      onClick={() => setSettingsCollapsed(o => !o)}
      look="soft">
      <Group className="w-full flex-nowrap">
        <Group className="grow items-center flex-nowrap overflow-x-scroll">{children}</Group>
        <Icon
          data-state={!settingsCollapsed ? "closed" : "opened"}
          className={"text-main-11 transition duration-150 ease-out data-[state=opened]:rotate-180"}
          remix="RiArrowDownSLine"
        />
      </Group>
      <Collapsible state={[settingsCollapsed, setSettingsCollapsed]}>
        <Space size="md" />
        {allowTxSponsoring && (
          <Group className="justify-between w-full items-center">
            <Text className="flex flex-nowrap gap-md items-center">
              Sponsor with{" "}
              <Dropdown
                content={
                  <Group className="flex-col max-w-[42ch]">
                    <Text size="sm">
                      Zyfi leverages ZKSync's native account abstraction to allow dApps simplify gas management for
                      dApps users.
                    </Text>
                    <Divider look="soft" horizontal />
                    <Group className="flex-col">
                      <Button to={"https://www.zyfi.org/"} size="xs" look="soft">
                        <Icon remix="RiArrowRightLine" /> Visit Zyfi
                      </Button>
                    </Group>
                  </Group>
                }>
                <PrimitiveTag size="sm">
                  <Icon src="https://www.zyfi.org/favicon.ico" /> Zyfi
                </PrimitiveTag>
              </Dropdown>
            </Text>
            <Checkbox size="sm" state={[sponsorTransactions, setSponsorTransactions]} />
          </Group>
        )}
        {settings}
      </Collapsible>
    </Box>
  );
}
