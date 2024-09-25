import { defineConfig, Options } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/**/*.{ts,tsx}"],
  format: ["esm", "cjs"],
  banner: {
    js: "'use client'",
  },
  clean: true,
  dts: true,
  injectStyle: true,
  external: ["react"],
  ...options,
}));
