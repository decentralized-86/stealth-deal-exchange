"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Row from "./row";
import { filterLatestPairs, filterTopTokens } from "./filter";
import Search from "@/components/search";
import OptionButton from "@/components/optionButton";
import Spinner from "@/components/spinner";

export type LatestPair = {
  address: string;
  priceUsd: string;
  liquidity: number;
  priceChange: number;
  initialPriceUsd: string;
  token0: {
    address: string;
    name: string;
    symbol: string;
  };
  token1: {
    address: string;
    name: string;
    symbol: string;
  };
};

export type TopToken = {
  address: string;
  marketCap: string;
  name: string;
  symbol: string;
  price: number;
  volume: string;
  liquidity: string;
  priceChange: number;
  priceChange1: number;
  priceChange4: number;
  priceChange12: number;
  priceChange24: number;
  imageLargeUrl: string;
  imageSmallUrl: string;
  imageThumbUrl: string;
};

type ApiData = {
  latestPairs: LatestPair[];
  topTokens: TopToken[];
};

const Feed = () => {
  const [pairs, setPairs] = useState<ApiData>();
  const [option, setOption] = useState<"new-pairs" | "trending">("new-pairs");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchFeed = () =>
      fetch("/api/feed")
        .then((response) => response.json())
        .then(setPairs);

    fetchFeed();

    const timer = setInterval(fetchFeed, 60000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <div className="flex justify-between sticky top-24 z-10">
        <div className="flex space-x-2">
          <OptionButton
            onClick={() => setOption("new-pairs")}
            selected={option === "new-pairs"}
          >
            New Pairs
          </OptionButton>
          <OptionButton
            onClick={() => setOption("trending")}
            selected={option === "trending"}
          >
            Trending
          </OptionButton>
        </div>
        <Search
          value={search}
          autoFocus
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="w-full border-spacing-y-1 border-separate mt-4">
        <thead className="text-neutral-200 bg-zinc-800 rounded sticky top-36 before:absolute border-t-4 border-solid before:w-full before:bottom-full before:h-48 before:bg-[url('../assets/images/bg-dotted.svg')] before:bg-zinc-950">
          <tr>
            <th className="py-2 pl-4 pr-1 uppercase rounded-l text-left">
              token
            </th>
            <th className="py-2 px-1 uppercase text-right">price $</th>
            <th className="py-2 px-1 uppercase text-right">volume</th>
            <th className="py-2 px-1 uppercase text-right">liquidity</th>
            <th className="py-2 pr-4 pl-1 uppercase rounded-r text-right">
              price change
            </th>
          </tr>
        </thead>
        <tbody>
          {pairs === undefined ? (
            <tr>
              <td colSpan={5}>
                <Spinner className="mx-auto mt-8" />
              </td>
            </tr>
          ) : option === "new-pairs" ? (
            pairs.latestPairs.map(
              (item) =>
                filterLatestPairs(item, search) && (
                  <Row
                    key={item.address}
                    token={`${item.token0.symbol} / ${item.token1.symbol}`}
                    price={Number(item.priceUsd)}
                    volume={0}
                    liquidity={item.liquidity}
                    priceChange={item.priceChange}
                  />
                ),
            )
          ) : (
            option === "trending" &&
            pairs.topTokens.map(
              (item) =>
                filterTopTokens(item, search) && (
                  <Row
                    key={item.address}
                    token={
                      <div className="flex">
                        {item.imageSmallUrl ? (
                          <Image
                            src={item.imageSmallUrl}
                            alt={item.symbol}
                            className="mr-2"
                            width={24}
                            height={24}
                          />
                        ) : (
                          <div className="w-6 mr-2" />
                        )}
                        {item.symbol}
                      </div>
                    }
                    price={item.price}
                    volume={Number(item.volume)}
                    liquidity={Number(item.liquidity)}
                    priceChange={item.priceChange}
                  />
                ),
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Feed;
