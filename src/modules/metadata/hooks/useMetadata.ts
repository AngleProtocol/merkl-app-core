import { useMerklConfig } from "@core/modules/config/config.context";
import { useMemo } from "react";
import { useLocation } from "react-router";
import { MetadataService } from "../metadata.service";

export default function useMetadata(url: string) {
  const location = useLocation();
  const backend = useMerklConfig(store => store.config.backend);
  const routes = useMerklConfig(store => store.config.routes);

  return useMemo(() => MetadataService({ url, location, routes, backend }), [routes, location, backend, url]);
}
