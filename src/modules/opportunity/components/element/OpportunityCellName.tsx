import type { TagTypes } from "@core/components/element/Tag";
import type { Opportunity } from "@merkl/api";
import {
  type Component,
  Group,
  Title,
  type TitleProps,
  mergeClass,
  type sizeScale,
  useOverflowingRef,
} from "packages/dappkit/src";
import useOpportunityMetadata from "../../hooks/useOpportunityMetadata";

export type OpportunityCellNameProps = {
  opportunity: Opportunity;
  titleProps?: TitleProps;
  tags?: (keyof TagTypes)[];
  tagsSize?: (typeof sizeScale)[number];
};

export default function OpportunityCellName({
  opportunity,
  titleProps,
  tags,
  tagsSize,
  children,
  size: _,
  ...props
}: Component<OpportunityCellNameProps>) {
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();
  const { name, Tags, Icons } = useOpportunityMetadata(opportunity);

  return (
    <Group className="flex-col w-full" size="lg" {...props}>
      <Group className="min-w-0 flex-nowrap overflow-hidden max-w-full">
        <Group className="text-xl items-center">
          <Icons groupProps={{ className: "flex-nowrap" }} />
        </Group>
        <Group>
          <Title
            h={3}
            size={4}
            ref={ref}
            {...titleProps}
            className={mergeClass(
              overflowing && "hover:overflow-visible hover:animate-textScroll hover:text-clip",
              titleProps?.className,
            )}>
            {children ?? name}
          </Title>
        </Group>
      </Group>

      <Group className="items-center">
        <Tags tags={tags ?? ["chain", "protocol", "status", "action"]} size={tagsSize ?? "xs"} />
      </Group>
    </Group>
  );
}
