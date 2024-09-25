import type { Config } from "tailwindcss";
import sharedConfig from "@askgovmy/tailwind-config/tailwind.config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*{.js,.ts,.jsx,.tsx, mdx}",
  ],
  presets: [sharedConfig],
};
export default config;
