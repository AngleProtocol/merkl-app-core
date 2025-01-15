import { Container, useTheme } from "dappkit";
import { Button, Group, Text } from "dappkit";
import Image from "../../../packages/dappkit/src/components/primitives/Image";
import merklDarkLogo from "../../assets/images/by-merkl-dark.svg";
import merklLogo from "../../assets/images/by-merkl.svg";
import merklConfig from "../../config";
import Socials from "../element/Socials";

export default function Footer() {
  const { mode } = useTheme();

  return (
    <footer className="relative backdrop-blur py-lg lg:py-xl flex flex-nowrap justify-between items-center w-full">
      <Container className="relative z-10">
        <Group className="justify-between gap-xl*2">
          <Group className="gap-xl*2 lg:ml-xl*2 items-center">
            <Button to="/" look="soft" className="hidden md:flex">
              <Image
                className="w-[125px] lg:w-[165px]"
                alt={`${merklConfig.appName} logo`}
                src={mode !== "dark" ? merklConfig.images.logoDark : merklConfig.images.logoLight}
              />
            </Button>
            <Socials />
          </Group>
          <Group className="items-center gap-xl*2">
            <Group className="items-center" size="xl">
              <Text size="sm" className="text-main-11">
                ©{new Date().getFullYear()} Merkl. All rights reserved.
              </Text>

              <Button look="soft" className="capitalize" size="sm" to={merklConfig.links.merklTermsConditions} external>
                Terms
              </Button>
              <Button look="soft" className="capitalize" size="sm" to={merklConfig.links.merklPrivacy} external>
                Privacy
              </Button>
            </Group>

            {merklConfig.footerLinks.length > 0 &&
              merklConfig.footerLinks.map(link => (
                <Button key={link.key} look="soft" size="sm" to={link.link} external>
                  <Image className="w-[8rem] max-h-[2.5rem]" alt="Footer link" src={link.image} />
                </Button>
              ))}

            <Button to={merklConfig.links.merkl} external look="soft">
              <Image className="w-[80px]" alt="Merkl Footer logo" src={mode !== "dark" ? merklDarkLogo : merklLogo} />
            </Button>
          </Group>
        </Group>
      </Container>
    </footer>
  );
}
