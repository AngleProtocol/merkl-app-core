import merklConfig from "@core/config";
import type { NavigationMenuRoute, NavigationMenuRoutes } from "@core/config/type";
import { useNavigation } from "@remix-run/react";
import { Button, Group, Icon, Image, Text, useTheme, useWalletContext } from "dappkit";
import type { MenuOptions, MenuProps } from "packages/dappkit/src/components/extenders/Menu";
import Menu from "packages/dappkit/src/components/extenders/Menu";
import { type ReactNode, useMemo } from "react";

export interface BrandNavigationMenuProps {
  routes: NavigationMenuRoutes;
  footer?: ReactNode;
}

/**
 * Shows the brand logo in header + navigation menu
 * @param routes {@link NavigationMenuRoutes}
 * @param footer last row of navigation menu
 */
export default function BrandNavigationMenu({ routes, footer }: BrandNavigationMenuProps) {
  const { mode } = useTheme();
  const { address } = useWalletContext();
  const navigation = useNavigation();

  /**
   * Links in navigation menu
   */
  const navigationOptions: MenuProps["options"] = useMemo(() => {
    const hasLink = (route: NavigationMenuRoute): route is NavigationMenuRoute<"link"> => "link" in route;

    const convert = (nav: NavigationMenuRoutes[string], key: string): MenuOptions => {
      const isDashboard = key === "dashboard";
      const userDashboardLink = isDashboard && address && `${hasLink(nav) && nav.link!}${address}`;

      const label = (
        <Button
          {...(hasLink(nav)
            ? {
                to: userDashboardLink || nav.link,
                external: nav.external,
                disabled: (isDashboard && !userDashboardLink) || nav.disabled,
              }
            : {})}
          look="soft"
          size="lg"
          className={"dim flex items-center gap-md"}>
          <Icon {...nav.icon} className="text-xl text-main-11" />
          <Text size="lg" bold className="text-main-12">
            {nav.name}
          </Text>
        </Button>
      );

      if (hasLink(nav))
        return {
          label,
        };
      return {
        label,
        options: Object.entries(nav.routes).reduce(
          (opt, [key, route]) => Object.assign(opt, { [key]: convert(route, key) }),
          {},
        ),
      } satisfies MenuOptions;
    };

    return Object.entries(routes).reduce((opt, [key, route]) => Object.assign(opt, { [key]: convert(route, key) }), {});
  }, [routes, address]);

  /**
   * Navigation + Footer elements
   */
  const options = useMemo(() => {
    const baseOptions = navigationOptions;

    if (baseOptions.dashboard) baseOptions.dashboard.disabled = !!address;

    return {
      ...navigationOptions,
      ...(!footer ? {} : { footer: { label: <Group>{footer}</Group> } }),
    } satisfies MenuProps["options"];
  }, [navigationOptions, footer, address]);

  /**
   * Brand logo
   */
  const brand = useMemo(() => {
    const logo = mode === "dark" ? merklConfig.images.logoDark : merklConfig.images.logoLight;

    return <Image imgClassName="max-w-[200px] max-h-[2rem]" alt={`${merklConfig.appName} logo`} src={logo} />;
  }, [mode]);

  if (merklConfig.hideLayerMenuHomePage) return brand;
  return (
    <Menu options={options}>
      <Group>
        {merklConfig.navigation.brand?.() || brand}
        {typeof document === "undefined" || navigation.state === "loading" ? (
          <Icon remix="RiLoader2Fill" className="text-main-12 animate-spin" />
        ) : (
          <Icon remix="RiArrowDownSLine" className="text-main-12" />
        )}
      </Group>
    </Menu>
  );
}
