import { reactRouter } from "@react-router/dev/vite";
import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/server-runtime" {
  // or cloudflare, deno, etc.
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [svgr(), reactRouter(), tsconfigPaths()],
});
