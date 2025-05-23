import { useMerklConfig } from "@core/modules/config/config.context";
import {
  Button,
  Container,
  Group,
  Icon,
  type IconProps,
  Icons,
  OverrideTheme,
  Tabs,
  Text,
  Title,
  Value,
  useTheme,
} from "dappkit";
import type { PropsWithChildren, ReactNode } from "react";
import React from "react";
import { type VariantProps, tv } from "tailwind-variants";
import { v4 as uuidv4 } from "uuid";

export type HeroProps = PropsWithChildren<{
  icons?: IconProps[];
  compact?: boolean;
  full?: boolean;
  title: ReactNode;
  breadcrumbs?: { name?: string; link: string; component?: ReactNode }[];
  navigation?: { label: ReactNode; link: string };
  description?: ReactNode;
  tags?: ReactNode[] | ReactNode;
  sideDatas?: HeroInformations[];
  tabs?: { label: ReactNode; link: string; key: string }[];
  banner?: ReactNode;
}>;

export type HeroInformations = {
  data: React.ReactNode;
  label: string;
  key: string;
};

export const heroStyles = tv(
  {
    base: "bg-cover flex-row justify-between relative xl:aspect-auto bg-right-top",
    variants: {
      size: {
        base: "min-h-[150px] md:min-h-[200px] lg:min-h-[250px] xl:min-h-[300px]",
        compact: "bg-cover xl:min-h-[150px]",
        full: "flex pt-xl*2",
      },
    },
    defaultVariants: {
      size: "base",
    },
  },
  { twMerge: false },
);

export default function Hero({
  compact = false,
  full = false,
  breadcrumbs,
  icons,
  title,
  description,
  tags,
  sideDatas,
  banner,
  tabs,
  children,
}: HeroProps & VariantProps<typeof heroStyles>) {
  const { mode } = useTheme();
  const heroConfig = useMerklConfig(store => store.config.hero);
  const images = useMerklConfig(store => store.config.images);

  const style = heroStyles({ size: compact ? "compact" : full ? "full" : "base" });

  return (
    <>
      <OverrideTheme mode={!!heroConfig.invertColors ? (mode === "dark" ? "light" : "dark") : mode}>
        <Group
          className={style}
          style={{
            backgroundImage: `url('${mode === "dark" ? images.heroDark : images.heroLight}')`,
          }}>
          <Container className="z-10">
            <Group className={`flex-col h-full py-xl gap-md md:gap-xl lg:gap-xs ${compact ? "flex-nowrap" : ""}`}>
              {!!breadcrumbs && breadcrumbs?.length > 0 && (
                <Group className="items-center" size="sm">
                  {breadcrumbs?.map((breadcrumb, index) => {
                    if (breadcrumb.component)
                      return <React.Fragment key={breadcrumb.link}>{breadcrumb.component}</React.Fragment>;
                    return (
                      <Button key={breadcrumb.link} to={breadcrumb.link} look="soft" size="xs">
                        {index > 0 && <Icon remix="RiArrowRightSLine" />}
                        {breadcrumb.name}
                      </Button>
                    );
                  })}
                </Group>
              )}
              <Group className="grow items-center justify-between gap-xl lg:gap-xl*4">
                <Group className={`${compact ? "py-xl md:py-lg*2" : ""} flex-col flex-1`} size="lg">
                  <Group
                    className="gap-0 md:gap-lg flex-nowrap w-full items-center"
                    style={{
                      wordBreak: "break-word",
                    }}>
                    {!!icons && (
                      <Icons size="lg" containerClassName="hidden md:flex">
                        {icons?.length > 1
                          ? icons?.map(icon => (
                              <Icon className="text-main-12 !w-lg*4 !h-lg*4" key={`${Object.values(icon)}`} {...icon} />
                            ))
                          : icons?.map(icon => (
                              <Icon className="text-main-12 !w-xl*4 !h-xl*4" key={`${Object.values(icon)}`} {...icon} />
                            ))}
                      </Icons>
                    )}
                    <Title h={1} size={2} className="flex-1">
                      {title}
                    </Title>
                  </Group>

                  {!!description && (
                    <Text size="lg" look="soft">
                      {typeof description === "string"
                        ? description?.split("\n").map((line, index) => (
                            <React.Fragment key={line}>
                              {index > 0 && <br />}
                              {line}
                            </React.Fragment>
                          ))
                        : description}
                    </Text>
                  )}
                  {!!tags && <Group className="mb-lg">{tags}</Group>}
                </Group>
                {!!sideDatas && (
                  <Group className="w-full lg:w-auto lg:flex-col mr-xl*2" size="lg">
                    {sideDatas.map(data => (
                      <Group key={data.key} className="flex-col" size="xs">
                        <Text size={4} className="!text-main-12">
                          {data.data}
                        </Text>

                        <Text size="md" bold>
                          {data.label}
                        </Text>
                      </Group>
                    ))}
                  </Group>
                )}
              </Group>
            </Group>
          </Container>
          {banner}
        </Group>
      </OverrideTheme>

      {!!tabs?.length && <Tabs tabs={tabs} look="base" size="lg" />}

      {children}
    </>
  );
}

export function defaultHeroSideDatas(count: number, maxApr?: number, dailyRewards?: number) {
  const dollarFormat = useMerklConfig(store => store.config.decimalFormat.dollar);

  return [
    !!count && {
      data: (
        <Value format="0" size={4} className="!text-main-12">
          {count}
        </Value>
      ),
      label: "Live opportunities",
      key: uuidv4(),
    },
    !!dailyRewards && {
      data: (
        <Value format={dollarFormat} size={4} className="!text-main-12">
          {dailyRewards}
        </Value>
      ),
      label: "Daily rewards",
      key: uuidv4(),
    },
    !!maxApr && {
      data: (
        <Value format="0a%" size={4} className="!text-main-12">
          {maxApr / 100}
        </Value>
      ),
      label: "Max APR",
      key: uuidv4(),
    },
  ].filter(data => !!data);
}
