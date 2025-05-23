import { useMerklConfig } from "@core/modules/config/config.context";
import type { NavigationMenuRoute, NavigationMenuRoutes } from "@core/modules/config/config.model";
import useMixpanelTracking from "@core/modules/mixpanel/hooks/useMixpanelTracking";
import { Button, Group, Icon, Image, Text, useTheme, useWalletContext } from "dappkit";
import { Menu, type MenuOptions, type MenuProps } from "dappkit";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useNavigation } from "react-router";

export interface BrandNavigationMenuProps {
  routes: NavigationMenuRoutes;
  footer?: ReactNode;
  disabled?: boolean;
}

/**
 * Shows the brand logo in header + navigation menu
 * @param routes {@link NavigationMenuRoutes}
 * @param footer last row of navigation menu
 */
export default function BrandNavigationMenu({ routes, footer, disabled }: BrandNavigationMenuProps) {
  const { mode } = useTheme();
  const { address } = useWalletContext();
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const images = useMerklConfig(store => store.config.images);
  const navigationConfig = useMerklConfig(store => store.config.navigation);
  const appName = useMerklConfig(store => store.config.appName);
  const { track } = useMixpanelTracking();
  const hideLayerMenuHomePage = useMerklConfig(store => store.config.hideLayerMenuHomePage);

  useEffect(() => {
    if (navigation.state === "loading" && !!isMenuOpen) return setIsMenuOpen(false);
  }, [navigation.state, isMenuOpen]);

  /**
   * Links in navigation menu
   */
  const navigationOptions: MenuProps["options"] = useMemo(() => {
    const hasLink = (route: NavigationMenuRoute): route is NavigationMenuRoute<"link"> => "link" in route;

    const convert = (nav: NavigationMenuRoutes[string], key?: string): MenuOptions => {
      const label = (
        <Button
          {...(hasLink(nav)
            ? {
                to: nav.flags?.replaceWithWallet
                  ? nav.link
                      .replaceAll(nav.flags?.replaceWithWallet, address ?? "")
                      .split("/")
                      .join("/")
                  : nav.link,
                external: nav.external,
              }
            : {})}
          look="soft"
          size="lg"
          onLink={() => track("Click on button", { button: "merkl", type: nav.name?.toLowerCase() })}
          key={key}
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
  }, [routes, address, track]);

  /**
   * Navigation + Footer elements
   */
  const options = useMemo(() => {
    return {
      ...navigationOptions,
      ...(!footer ? {} : { footer: { label: <Group>{footer}</Group> } }),
    } satisfies MenuProps["options"];
  }, [navigationOptions, footer]);

  /**
   * Brand logo
   */
  const brand = useMemo(() => {
    const logo = mode === "dark" ? images.logoDark : images.logoLight;

    return <Image imgClassName="max-w-[200px] max-h-[2rem]" alt={`${appName} logo`} src={logo} />;
  }, [mode, images, appName]);

  if (hideLayerMenuHomePage || disabled) return brand;
  return (
    <Group size="xl">
      <Menu state={[isMenuOpen, setIsMenuOpen]} options={options}>
        <Link to="/">{navigationConfig.brand?.() || brand}</Link>
      </Menu>
      <Button onClick={() => setIsMenuOpen(o => !o)} look="base">
        {typeof document === "undefined" || navigation.state === "loading" ? (
          <Icon remix="RiLoader2Fill" className="text-main-12 animate-spin" />
        ) : (
          <Icon remix={!!isMenuOpen ? "RiCloseLine" : "RiMenu5Fill"} className="text-main-12" />
        )}
      </Button>
    </Group>
  );
}
