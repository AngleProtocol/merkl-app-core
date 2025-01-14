import type { Config } from "tailwindcss";
import { generateTailwindConfig } from "./packages/dappkit/src/utils/tailwind";

export default {
  content: [
    "./{src,packages}/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
    "!./packages/**/node_modules/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: generateTailwindConfig(),
  plugins: [],
} satisfies Config;
