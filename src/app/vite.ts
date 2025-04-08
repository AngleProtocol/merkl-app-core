export default () =>
  ({
    name: "merkl",
    config: config => ({
      ...config,
      optimizeDeps: { exclude: ["mixpanel-browser", "@lifi/widget", "react-router-dom/server"] },
      resolve: { alias: { "react-router-dom/server": "react-router-dom" } },
    }),
  }) satisfies import("vite").Plugin;
