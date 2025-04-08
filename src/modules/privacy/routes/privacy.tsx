import Hero from "@core/components/composite/Hero";
import { useMerklConfig } from "@core/modules/config/config.context";
import useMetadata from "@core/modules/metadata/hooks/useMetadata";
import { MetadataService } from "@core/modules/metadata/metadata.service";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { Button, Group, Icon, Text } from "packages/dappkit/src";
import type { MerklServerContext } from "@core/app/server/context";

export async function loader({ context: { backend, routes }, request }: LoaderFunctionArgs<MerklServerContext>) {
  return MetadataService({ request, backend, routes }).fill();
}

export const meta = MetadataService({}).forwardMetadata<typeof loader>();

export default function Index() {
  const { url } = useLoaderData<typeof loader>();
  const metadata = useMetadata(url);
  const links = useMerklConfig(store => store.config.links);

  return (
    <Hero
      icons={[{ remix: "RiShieldKeyholeLine" }]}
      title={metadata.find(metadata.wrapInPage(), "title")}
      description={metadata.find(metadata.wrapInPage(), "description")}>
      <Group className="p-xl flex-col">
        <Text>Privacy policy and data protection of the interface</Text>
        <Group>
          <a download={"merkl-privacy.pdf"} href={links.merklPrivacy}>
            <Button look="hype">
              Download PDF
              <Icon remix={"RiDownloadFill"} />
            </Button>
          </a>
        </Group>
      </Group>
    </Hero>
  );
}
