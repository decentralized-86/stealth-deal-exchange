import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import Head from "next/head";
import Navbar from "./navbar";
import { Toaster } from "@/components/ui/toaster";
import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stealth Deals",
  description: "Secure End-to-End Trading Privacy",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => (
  <html lang="en">
    <Head>
      <link href="https://fonts.cdnfonts.com/css/satoshi" rel="stylesheet" />
    </Head>
    <body className={inter.className}>
      <Providers>
        <Navbar />
        <main className="p-24 before:fixed before:left-0 before:right-0 before:top-0 before:bottom-0 before:bg-[url('../assets/images/bg-dotted.svg')] before:-z-10">
          {children}
        </main>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
