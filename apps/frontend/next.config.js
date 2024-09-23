const path = require("path");
const createNextIntlPlugin = require("next-intl/plugin");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "ask-gov.s3.ap-southeast-2.amazonaws.com",
      },
    ],
  },
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  output: "standalone",
  experimental: {
    instrumentationHook: true,
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

module.exports = withNextIntl(nextConfig);
