import { useNavigate } from "@remix-run/react";
import { Button, Container, Dropdown, Group, Icon, SCREEN_BREAKDOWNS, Select, WalletButton, useTheme } from "dappkit";
import { Image } from "dappkit";
import { useWalletContext } from "dappkit";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { v4 as uuidv4 } from "uuid";
import merklConfig from "../../config";
import customerDarkLogo from "../../customer/assets/images/customer-dark-logo.svg";
import customerLogo from "../../customer/assets/images/customer-logo.svg";
import useChains from "../../hooks/resources/useChains";
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

  const chain = useMemo(() => {
    return chains?.find(c => c.id === chainId);
  }, [chains, chainId]);

  // Dynamically filter routes based on the config
  const routes = useMemo(() => {
    const { home, opportunities, protocols, bridge, ...rest } = merklConfig.routes;

    return Object.assign(
      { home },
      {
        [!!merklConfig.dashboardPageName ? merklConfig.dashboardPageName : "dashboard"]: {
          icon: "RiDashboardFill",
          route: user ? `/users/${user}` : "/users",
          key: uuidv4(),
        },
      },
      merklConfig.header.opportunities.enabled ? { opportunities } : {},
      { protocols },
      // Include bridge route only if enabled in config
      merklConfig.header.bridge.enabled ? { bridge } : {},
      rest,
    );
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

  return (
    <motion.header
      variants={container}
      initial="hidden"
      whileInView="visible"
      className="w-full sticky left-0 top-0 z-20 backdrop-blur">
      <Container className="py-xl">
        <Group className="justify-between items-center">
          <motion.div variants={item} className="cursor-pointer">
            {media || merklConfig.hideLayerMenuHomePage ? (
              <Image
                imgClassName="w-[200px] max-h-[2.5rem]"
                alt={`${merklConfig.appName} logo`}
                src={mode !== "dark" ? customerDarkLogo : customerLogo}
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
                  imgClassName="!w-[140px] md:!w-[200px] max-h-[2.5rem]"
                  alt={`${merklConfig.appName} logo`}
                  src={mode !== "dark" ? customerDarkLogo : customerLogo}
                />
                <Icon className="text-main-12" remix="RiArrowDownSLine" />
              </Dropdown>
            )}
          </motion.div>

          <motion.div variants={item}>
            <Group className="items-center" size="xl">
              <Group className="hidden lg:flex items-center" size="xl">
                {Object.entries(routes)
                  .filter(([key]) => !["home", "faq", "docs"].includes(key))
                  .map(([key, route]) => {
                    return (
                      <Button
                        className={`${["faq"].includes(key) ? "uppercase" : "capitalize"}`}
                        look="soft"
                        size="lg"
                        key={`${key}-link`}
                        to={route?.route}>
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
