import { useMerklConfig } from "@core/modules/config/config.context";
import { Container, useTheme } from "dappkit";
import { Button, Group, Text } from "dappkit";
import { Image } from "dappkit";
import merklDarkLogo from "../../assets/images/by-merkl-dark.svg";
import merklLogo from "../../assets/images/by-merkl.svg";
import Socials from "../element/Socials";
import BrandNavigationMenu from "./BrandNavigationMenu";

export default function Footer() {
  const { mode } = useTheme();
  const links = useMerklConfig(store => store.config.links);
  const footerLinks = useMerklConfig(store => store.config.footerLinks);
  const navigationConfig = useMerklConfig(store => store.config.navigation);

  return (
    <footer className="relative backdrop-blur py-lg lg:py-lg*2 flex flex-nowrap justify-between items-center w-full">
      <Container className="relative z-10">
        <Group className="justify-between gap-xl md:gap-xl*2">
          <Group className="gap-xl md:gap-xl*2 items-center">
            <div className="hidden md:block">
              <Button to="/" look="soft" className="flex justify-start">
                <BrandNavigationMenu routes={navigationConfig.menu} disabled />
              </Button>
            </div>
            <Group size="lg">
              <Socials />
              {Object.keys(footerLinks ?? {}).length > 0 &&
                Object.entries(footerLinks ?? {}).map(([key, route]) => (
                  <Button
                    look="soft"
                    className="capitalize"
                    size="lg"
                    key={route.key}
                    external={route.external}
                    to={route.route}>
                    {key}
                  </Button>
                ))}
            </Group>
          </Group>
          <Group className="items-center gap-xl md:gap-xl*2">
            <Group className="items-center" size="xl">
              <Text size="sm" className="text-main-11">
                ©{new Date().getFullYear()} Angle Labs Inc. All rights reserved.
              </Text>

              <Button look="soft" className="capitalize" size="sm" to={"/terms"}>
                Terms
              </Button>
              <Button look="soft" className="capitalize" size="sm" to={"/privacy"}>
                Privacy
              </Button>
            </Group>

            {footerLinks.length > 0 &&
              footerLinks.map(link => (
                <Button key={link.key} look="soft" size="sm" to={link.link} external>
                  <Image className="w-[8rem] max-h-[2.5rem]" alt="Footer link" src={link.image} />
                </Button>
              ))}

            <Button to={links.merkl} external look="soft">
              <Image className="w-[80px]" alt="Merkl Footer logo" src={mode !== "dark" ? merklDarkLogo : merklLogo} />
            </Button>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
