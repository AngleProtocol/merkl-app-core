import type { MerklBackendConfig } from "@core/modules/config/types/merklBackendConfig";
import type { MerklRoutesConfig } from "@core/modules/config/types/merklRoutesConfig";
import { createRequestHandler } from "@react-router/express";
import express from "express";
import morgan from "morgan";

const version = process.env.VERSION;

export type ServerContext = {
  backend: MerklBackendConfig;
  routes: MerklRoutesConfig;
  serverIndexBuildPath: string;
  version: string;
};

export const defineServer = async ({ backend, routes, serverIndexBuildPath }: ServerContext) => {
  const mode: "production" | "development" = (process.env.NODE_ENV! as "production" | "development") ?? "development";
  const viteServer =
    mode !== "development"
      ? undefined
      : await import("vite").then(vite => vite.createServer({ server: { allowedHosts: true, middlewareMode: true } }));

  const handler = createRequestHandler({
    mode,
    build: !!viteServer
      ? await viteServer.ssrLoadModule("virtual:react-router/server-build")
      : await import(serverIndexBuildPath),
    getLoadContext() {
      return { backend, routes, version };
    },
  });

  const server = express().disable("x-powered-by");

  if (viteServer) server.use(viteServer.middlewares);
  else server.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));

  server
    .use(express.static("build/client", { maxAge: "1h" }))
    .use(morgan("tiny"))
    .all("*", handler);

  return server;
};
