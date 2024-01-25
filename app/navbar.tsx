"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";

const routes = [
  ["/feed", "Feed"],
  ["/exchange", "Exchange"],
  ["/stats", "Stats"],
  ["/deals", "Deals"],
];

const Navbar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="flex justify-between p-4 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
      <Link href="/" className="text-white text-2xl my-auto">
        Stealth Deals
      </Link>
      <ul className="flex text-zinc-500 items-center">
        {routes.map(([route, label]) => (
          <li key={route}>
            <Link
              href={route}
              className={clsx(
                "p-4",
                pathname === route || (pathname === "/" && route === "/feed")
                  ? "text-zinc-50"
                  : null,
              )}
            >
              {label}
            </Link>
          </li>
        ))}
        <li className="ml-4">
          <ConnectButton />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
