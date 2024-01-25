// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require("dotenv");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

// get env in case of being called from worker, not next
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["crypto-js"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
    ],
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
  },
  redis: process.env.REDIS_URL,
  definedFi: {
    key: process.env.DEFINED_FI_KEY,
  },
  exchangeContract: process.env.NEXT_PUBLIC_EXCHANGE_CONTRACT,
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
};

module.exports = nextConfig;
