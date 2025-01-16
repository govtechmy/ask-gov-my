const createNextIntlPlugin = require("next-intl/plugin");
const path = require("path");
const createMDX = require("@next/mdx");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "ask-gov.s3.ap-southeast-2.amazonaws.com" },
      { hostname: "askgov-dev.s3.ap-southeast-1.amazonaws.com" },
    ],
  },
  reactStrictMode: true,
  output: "standalone",
  transpilePackages: ["@askgovmy/ui", "@askgovmy/utils"],
  compiler: {
    removeConsole: process.env.APP_ENV === "production",
  },
  experimental: {
    outputFileTracingRoot: path.join(__dirname, "../../"),
    instrumentationHook: true,
  },
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({});

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

module.exports = withNextIntl(withMDX(nextConfig));
