import type { Preset } from "@react-router/dev/config";

export const merklReactRouter = {
  name: "merkl-app",
  reactRouterConfig(args) {
    return {
      ssr: true,
      appDirectory: "src",
      ...args,
    };
  },
} satisfies Preset;
