import { useMerklConfig } from "@core/modules/config/config.context";
import type { NavigationMenuRoute } from "@core/modules/config/config.model";
import { useLocation } from "@remix-run/react";
import { Button, Container, Group, Icon, Select, Text, WalletButton, mergeClass, useWalletContext } from "dappkit";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import useChains from "../../modules/chain/hooks/useChains";
import SwitchMode from "../element/SwitchMode";
import BrandNavigationMenu from "./BrandNavigationMenu";

const container = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Header() {
  const { chainId, address: user, chains, switchChain } = useWalletContext();
  const headerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hideSpyMode = useMerklConfig(store => store.config.hideSpyMode);
  const navigationConfig = useMerklConfig(store => store.config.navigation);

  const chain = useMemo(() => {
    return chains?.find(c => c.id === chainId);
  }, [chains, chainId]);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        // Use requestAnimationFrame to ensure we get the final layout
        requestAnimationFrame(() => {
          const height = headerRef.current?.offsetHeight;
          if (height) {
            setHeight(height);
          }
        });
      }
    };

    // Initial measurement with a small delay to ensure everything is loaded
    const timeoutId = setTimeout(updateHeaderHeight, 100);

    // Update on resize
    window.addEventListener("resize", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      clearTimeout(timeoutId);
    };
  }, []);

  const {
    singleChain,
    isSingleChain,
    isOnSingleChain,
    chains: enabledChains,
    options: chainOptions,
    searchOptions: chainSearchOptions,
    indexOptions: chainIndexOptions,
  } = useChains(chains);

  const chainSwitcher = useMemo(() => {
    if (isSingleChain && !isOnSingleChain)
      return <Button onClick={() => switchChain(singleChain?.id!)}>Switch to {enabledChains?.[0]?.name}</Button>;
    if (isSingleChain) return <></>;

    return (
      <Select
        search
        placeholder="Select Chain"
        state={[chainId, c => switchChain(+c)]}
        searchOptions={chainSearchOptions}
        indexOptions={chainIndexOptions}
        options={chainOptions}
      />
    );
  }, [
    chainId,
    switchChain,
    chainOptions,
    chainSearchOptions,
    enabledChains,
    isSingleChain,
    isOnSingleChain,
    singleChain,
    chainIndexOptions,
  ]);

  return (
    <div ref={headerRef} style={{ minHeight: height }}>
      <motion.header
        variants={container}
        whileInView="visible"
        className={mergeClass("w-full left-0 top-0 z-20 backdrop-blur", !height ? "" : "fixed")}>
        <Container className="py-xl">
          <Group className="justify-between items-center">
            <BrandNavigationMenu
              routes={navigationConfig.menu}
              footer={
                <Group className="w-full justify-between">
                  <SwitchMode />
                  <Text size="xs" className="self-end">
                    {typeof document !== "undefined" && ((window as any)?.ENV! as any)?.MERKL_VERSION}
                  </Text>
                </Group>
              }
            />
            <Group>
              <Group className="items-center" size="xl">
                <Group className="hidden lg:flex h-full [&>*]:items-center" size="xl">
                  {Object.entries(navigationConfig.header).map(([key, route]) => {
                    const hasLink = (route: NavigationMenuRoute): route is NavigationMenuRoute<"link"> =>
                      "link" in route;
                    return (
                      <Group
                        key={`${key}-link`}
                        className={mergeClass(
                          "h-full",
                          hasLink(route) &&
                            location.pathname ===
                              (route.flags?.replaceWithWallet
                                ? route.link.replaceAll(route.flags?.replaceWithWallet, user ?? "")
                                : route.link) &&
                            "border-accent-11 border-b-2",
                        )}>
                        <Button
                          className={`${["faq"].includes(key) ? "uppercase" : "capitalize"}`}
                          look="soft"
                          size="lg"
                          key={`${key}-link`}
                          {...(hasLink(route)
                            ? {
                                to: route.flags?.replaceWithWallet
                                  ? route.link.replaceAll(route.flags?.replaceWithWallet, user ?? "")
                                  : route.link,
                                external: route.external,
                              }
                            : {})}>
                          {route.name}
                        </Button>
                      </Group>
                    );
                  })}
                </Group>

                <Group className="flex">
                  <WalletButton select={chainSwitcher} hideSpyMode={hideSpyMode}>
                    <Button to={`/users/${user}`} size="sm" look="soft">
                      <Icon remix="RiArrowRightLine" /> Check claims
                    </Button>
                    {chain?.explorers?.map(explorer => (
                      <Button external key={explorer.url} to={`${explorer.url}/address/${user}`} size="sm" look="soft">
                        <Icon remix="RiArrowRightLine" /> Visit explorer
                      </Button>
                    ))}
                  </WalletButton>
                </Group>
              </Group>
            </Group>
          </Group>
        </Container>
      </motion.header>
    </div>
  );
}
