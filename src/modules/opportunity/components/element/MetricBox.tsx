import { Dropdown, Group, Icon, type Look, Text, Title } from "packages/dappkit/src";
import type { ReactNode } from "react";

interface MetricBoxProps {
  label: ReactNode;
  value: ReactNode;
  dropdown?: ReactNode;
  look?: Look;
}

export default function MetricBox({ label, value, dropdown, look }: MetricBoxProps) {
  return (
    <Group className="border-1 rounded-lg border-main-9 p-lg flex-col flex-1" size={"sm"}>
      {dropdown ? (
        <Dropdown onHover content={dropdown}>
          <Text bold className="flex items-center gap-sm " look={"soft"}>
            {label}
            <Icon remix="RiQuestionFill" size="sm" className="fill-accent-10" />
          </Text>
        </Dropdown>
      ) : (
        <Text bold className="flex items-center gap-sm " look={"soft"}>
          {label}
        </Text>
      )}
      <Title h={3} look={look ?? "bold"}>
        {value}
      </Title>
    </Group>
  );
}
