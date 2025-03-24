import { useMerklConfig } from "@core/modules/config/config.context";
import { Button, Group, Icon } from "dappkit";

export default function Socials() {
  const socials = useMerklConfig(store => store.config.socials);

  return (
    <Group className="items-center gap-xl">
      {!!socials.x && (
        <Button look="base" size="lg" external to={socials.x}>
          <Icon remix="RiTwitterXFill" />
        </Button>
      )}
      {!!socials.telegram && (
        <Button look="base" size="lg" external to={socials.telegram}>
          <Icon remix="RiTelegram2Fill" />
        </Button>
      )}
      {!!socials.github && (
        <Button look="base" size="lg" external to={socials.github}>
          <Icon remix="RiGithubFill" />
        </Button>
      )}
      {!!socials.discord && (
        <Button look="base" size="lg" external to={socials.discord}>
          <Icon remix="RiDiscordFill" />
        </Button>
      )}
      {!!socials.medium && (
        <Button look="base" size="lg" external to={socials.medium}>
          <Icon remix="RiMediumFill" />
        </Button>
      )}
      {!!socials.blog && (
        <Button look="base" size="lg" external to={socials.blog}>
          <Icon remix="RiArticleFill" />
        </Button>
      )}
    </Group>
  );
}
