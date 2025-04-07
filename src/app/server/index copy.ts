import { createRequestHandler } from "@react-router/express";
import express from "express";
import morgan from "morgan";
import backend from "./merkl.backend.ts";
import routes from "./merkl.routes.ts";

const version = process.env.VERSION;

const viteDevServer =
  process.env.NODE_ENV === "production"
    ? undefined
    : await import("vite").then(vite =>
        vite.createServer({
          server: {
            allowedHosts: true,
            middlewareMode: true,
          },
        }),
      );

const remixHandler = createRequestHandler({
  build: viteDevServer
    ? () => viteDevServer.ssrLoadModule("virtual:react-router/server-build")
    : await import("./build/server/index.js"!),
  getLoadContext() {
    return { backend, routes: routes.routes, version };
  },
});

const app = express();

// app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable("x-powered-by");

// handle asset requests
if (viteDevServer) {
  app.use(viteDevServer.middlewares);
} else {
  // Vite fingerprints its assets so we can cache forever.
  app.use("/assets", express.static("build/client/assets", { immutable: true, maxAge: "1y" }));
}

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static("build/client", { maxAge: "1h" }));

app.use(morgan("tiny"));

// handle SSR requests
app.all("*", remixHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.info(`Express server listening at http://localhost:${port}`));
