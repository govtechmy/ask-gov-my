import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/markdown/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [sharedConfig],
};
export default config;
