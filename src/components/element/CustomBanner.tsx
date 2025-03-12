import { useMerklConfig } from "@core/modules/config/config.context";

export default function CustomBanner() {
  const customBanner = useMerklConfig(store => store.config.customBanner);
  return customBanner;
}
