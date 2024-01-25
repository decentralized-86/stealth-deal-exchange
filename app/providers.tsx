"use client";

import React, { useState, useEffect } from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Chain, configureChains, createConfig, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { mainnet, sepolia, goerli } from "wagmi/chains";
import config from "@/next.config";

const c: Chain[] = [process.env.NODE_ENV === "production" ? mainnet : sepolia];

if (process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true") {
  c.push(goerli);
}

const { chains, publicClient, webSocketPublicClient } = configureChains(c, [
  alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY! }),
]);

const projectId = config.walletConnectProjectId;

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const demoAppInfo = {
  appName: "Rainbowkit Demo",
};

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [
      argentWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      ledgerWallet({ projectId, chains }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

const theme = darkTheme();

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo} theme={theme}>
        {mounted && children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
