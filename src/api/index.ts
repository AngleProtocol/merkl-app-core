import type { MerklBackend } from "@core/config/backend";
import type { MerklRoutes } from "@core/config/routes";
import "@remix-run/server-runtime";
import { MerklApi } from "@merkl/api";

const api = MerklApi(
  (typeof window === "undefined" ? process.env.API_URL : (window as { ENV?: { API_URL?: string } })?.ENV?.API_URL) ??
    "https://api.merkl.xyz",
);

export { api };

//TODO: move this in a more appropriate global
declare module "@remix-run/server-runtime" {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }

  export interface AppLoadContext {
    backend: MerklBackend;
    routes: MerklRoutes;
  }
}
