import { api } from "@core/api";
import type { TagTypes } from "@core/components/element/Tag";
import type { Opportunity } from "@merkl/api";
import {
  Button,
  type Component,
  EventBlocker,
  Group,
  Icon,
  Title,
  type TitleProps,
  mergeClass,
  type sizeScale,
  useClipboard,
  useOverflowingRef,
} from "dappkit";
import useOpportunityMetadata from "../../hooks/useOpportunityMetadata";
import { useMerklConfig } from "@core/modules/config/config.context";
import { OpportunityService } from "../../opportunity.service";

export type OpportunityTableNameProps = {
  opportunity: Opportunity;
  titleProps?: TitleProps;
  tags?: (keyof TagTypes)[];
  tagsSize?: (typeof sizeScale)[number];
};

export default function OpportunityTableName({
  opportunity,
  titleProps,
  tags,
  tagsSize,
  children,
  size: _,
  ...props
}: Component<OpportunityTableNameProps>) {
  const { ref, overflowing } = useOverflowingRef<HTMLHeadingElement>();
  const { name, Tags, Icons } = useOpportunityMetadata(opportunity);
  const opportunityService = OpportunityService({ api });
  const showDevelopmentHelpers = useMerklConfig(store => store.config.backend.showDevelopmentHelpers);
  const { copy: copyCall, isCopied } = useClipboard();

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
        {!!showDevelopmentHelpers && (
          <EventBlocker>
            <Group>
              <Button className="inline-flex" look="hype" size="md" onClick={async () => copyCall(opportunity.id)}>
                <Icon remix={isCopied ? "RiCheckboxCircleFill" : "RiFileCopyFill"} size="sm" />
              </Button>
              <Button
                className="inline-flex"
                look="hype"
                size="md"
                onClick={async () => (await opportunityService).reparse(opportunity.id)}>
                <Icon remix="RiRestartLine" size="sm" />
              </Button>
            </Group>
          </EventBlocker>
        )}
      </Group>
    </Group>
  );
}
