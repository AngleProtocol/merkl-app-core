import type { routesType } from "@core/config/type";
import { useNavigate } from "@remix-run/react";
import {
  Button,
  Container,
  Dropdown,
  Group,
  Icon,
  Image,
  SCREEN_BREAKDOWNS,
  Select,
  WalletButton,
  useTheme,
  useWalletContext,
} from "dappkit";
import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import merklConfig from "../../config";
import useChains from "../../modules/chain/hooks/useChains";
import SwitchMode from "../element/SwitchMode";
import SearchBar from "../element/functions/SearchBar";
import { LayerMenu } from "./LayerMenu";

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

const item = {
  hidden: { y: "-100%" },
  visible: {
    y: 0,
  },
};

export default function Header() {
  const { mode } = useTheme();
  const { chainId, address: user, chains, switchChain } = useWalletContext();
  const [open, setOpen] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement>(null);

  const chain = useMemo(() => {
    return chains?.find(c => c.id === chainId);
  }, [chains, chainId]);

  // Dynamically filter routes based on the config
  const routes = useMemo(() => {
    const routes: routesType = JSON.parse(JSON.stringify(merklConfig.routes));
    const filteredRoutes = Object.fromEntries(
      Object.entries(routes).filter(([_, route]) => route.enabled && route.inHeader === true),
    );

    if (!!filteredRoutes.dashboard && !!user) {
      filteredRoutes.dashboard.route = filteredRoutes.dashboard.route.concat(`/${user}`);
    }
    return filteredRoutes;
  }, [user]);

  const navigate = useNavigate();
  const navigateToHomepage = useCallback(() => navigate("/"), [navigate]);

  const media = useMediaQuery({
    query: `(min-width: ${SCREEN_BREAKDOWNS.LG}px)`,
  });

  const {
    singleChain,
    isSingleChain,
    isOnSingleChain,
    chains: enabledChains,
    options: chainOptions,
  } = useChains(chains);

  const chainSwitcher = useMemo(() => {
    if (isSingleChain && !isOnSingleChain)
      return <Button onClick={() => switchChain(singleChain?.id!)}>Switch to {enabledChains?.[0]?.name}</Button>;
    if (isSingleChain) return <></>;

    return <Select placeholder="Select Chain" state={[chainId, c => switchChain(+c)]} options={chainOptions} />;
  }, [chainId, switchChain, chainOptions, enabledChains, isSingleChain, isOnSingleChain, singleChain]);

  const isClient = typeof window !== "undefined";

  useEffect(() => {
    if (!isClient) return;

    const updateHeaderHeight = () => {
      if (headerRef.current) {
        // Use requestAnimationFrame to ensure we get the final layout
        requestAnimationFrame(() => {
          const height = headerRef.current?.offsetHeight;
          if (height) {
            document.documentElement.style.setProperty("--header-height", `${height}px`);
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
  }, [isClient]);

  return (
    <motion.header
      ref={headerRef}
      variants={container}
      initial="hidden"
      whileInView="visible"
      className="w-full fixed left-0 top-0 z-20 backdrop-blur">
      <Container className="py-xl">
        <Group className="justify-between items-center">
          <motion.div variants={item} className="cursor-pointer">
            {media || merklConfig.hideLayerMenuHomePage ? (
              <Image
                imgClassName="max-w-[200px] max-h-[2rem]"
                alt={`${merklConfig.appName} logo`}
                src={mode === "dark" ? merklConfig.images.logoDark : merklConfig.images.logoLight}
                onClick={navigateToHomepage}
              />
            ) : (
              <Dropdown
                size="md"
                padding="xs"
                state={[open, setOpen]}
                content={<LayerMenu nav={routes} setOpen={setOpen} />}
                className="flex gap-sm md:gap-lg items-center">
                <Image
                  imgClassName="!max-w-[140px] md:!max-w-[200px] max-h-[2rem]"
                  alt={`${merklConfig.appName} logo`}
                  src={mode === "dark" ? merklConfig.images.logoDark : merklConfig.images.logoLight}
                />
                <Icon className="text-accent-12" remix="RiArrowDownSLine" />
              </Dropdown>
            )}
          </motion.div>

          <motion.div variants={item}>
            <Group className="items-center" size="xl">
              <Group className="hidden lg:flex items-center" size="xl">
                {Object.entries(routes)
                  .filter(([key]) => !["home", "docs"].includes(key))
                  .map(([key, route]) => {
                    return (
                      <Button
                        className={`${["faq"].includes(key) ? "uppercase" : "capitalize"}`}
                        look="soft"
                        size="lg"
                        key={`${key}-link`}
                        to={route?.route}
                        external={route?.external}>
                        {key}
                      </Button>
                    );
                  })}
                <Group className="items-center">
                  <SwitchMode />
                  {merklConfig.header.searchbar.enabled && <SearchBar icon={true} />}
                </Group>
              </Group>

              <Group className="flex">
                <WalletButton select={chainSwitcher} hideSpyMode={merklConfig.hideSpyMode}>
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
          </motion.div>
        </Group>
      </Container>
    </motion.header>
  );
}
