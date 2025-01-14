import { Button, Group, Icon } from "dappkit";
import merklConfig from "../../config";

export default function Socials() {
  return (
    <Group className="items-center gap-xl">
      {!!merklConfig.socials.x && (
        <Button look="base" size="lg" external to={merklConfig.socials.x}>
          <Icon remix="RiTwitterXFill" />
        </Button>
      )}
      {!!merklConfig.socials.telegram && (
        <Button look="base" size="lg" external to={merklConfig.socials.telegram}>
          <Icon remix="RiTelegram2Fill" />
        </Button>
      )}
      {!!merklConfig.socials.github && (
        <Button look="base" size="lg" external to={merklConfig.socials.github}>
          <Icon remix="RiGithubFill" />
        </Button>
      )}
      {!!merklConfig.socials.discord && (
        <Button look="base" size="lg" external to={merklConfig.socials.discord}>
          <Icon remix="RiDiscordFill" />
        </Button>
      )}
      {!!merklConfig.socials.medium && (
        <Button look="base" size="lg" external to={merklConfig.socials.medium}>
          <Icon remix="RiMediumFill" />
        </Button>
      )}
    </Group>
  );
}
