import { Button, Group, Icon } from "dappkit";
import config from "merkl.config";

export default function Socials() {
  return (
    <Group className="items-center gap-xl">
      {!!config.socials.x && (
        <Button look="base" size="lg" external to={config.socials.x}>
          <Icon remix="RiTwitterXFill" />
        </Button>
      )}
      {!!config.socials.telegram && (
        <Button look="base" size="lg" external to={config.socials.telegram}>
          <Icon remix="RiTelegram2Fill" />
        </Button>
      )}
      {!!config.socials.github && (
        <Button look="base" size="lg" external to={config.socials.github}>
          <Icon remix="RiGithubFill" />
        </Button>
      )}
      {!!config.socials.discord && (
        <Button look="base" size="lg" external to={config.socials.discord}>
          <Icon remix="RiDiscordFill" />
        </Button>
      )}
      {!!config.socials.medium && (
        <Button look="base" size="lg" external to={config.socials.medium}>
          <Icon remix="RiMediumFill" />
        </Button>
      )}
    </Group>
  );
}
