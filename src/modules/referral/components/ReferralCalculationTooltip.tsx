import { Divider, Dropdown, Group, Icon, Text } from "packages/dappkit/src";

export default function ReferralCalculationTooltip() {
  return (
    <Dropdown
      onHover
      content={
        <Group className="w-fit">
          <Text look="bold" className="font-bold flex gap-md">
            <Icon remix="RiWaterFlashFill" /> Referral Boost Calculation
          </Text>
          <Divider horizontal className="border-main-8" />
          <Text>
            When a referral deposits, the boost is calculated as:
            <li />
            <span className="font-bold">Referrer Reward</span> = 5% of the referee’s score (uncapped).
            <li>
              <span className="font-bold">Referee Reward</span> = Min (5% of referee’s score, 5% of referrer’s score).
            </li>
          </Text>
        </Group>
      }>
      <Text>Learn more</Text>
    </Dropdown>
  );
}
