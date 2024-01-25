"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Dropdown from "@/components/dropdown";
import Search from "@/components/search";
import ExchangeCard from "@/components/exchangeCard";
import CONFIG from "@/next.config";
import {
  Address,
  erc20ABI,
  useAccount,
  useBalance,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { abi } from "@/contracts/artifacts/contracts/StealthMarketExchange.sol/StealthMarketExchange.json";
import Spinner from "@/components/spinner";
import { useToast } from "@/components/ui/use-toast";
import useCreateSwap from "./useCreateSwap";
import * as constants from "@/lib/constants";
import NewPairModal from "./newPairModal";
import { matchByAddress, matchBySearch } from "./search";

export type Swap = {
  swapId: bigint;
  creator: string;

  sellToken: string;
  sellSymbol?: string;
  sellAmount: bigint;
  sellDecimals: number;

  buyToken: string;
  buySymbol?: string;
  buyAmount: bigint;
  buyDecimals: number;
};

export type NewSwap = Pick<
  Swap,
  "sellToken" | "buyToken" | "sellAmount" | "buyAmount"
>;

const Page: React.FC = () => {
  const { address, isConnected } = useAccount();

  const { data: balance } = useBalance({ address });

  const { chain } = useNetwork();

  const [open, setOpen] = useState(false);

  const [pairs, setPairs] = useState<Swap[]>();

  const [txPending, setTxPending] = useState<number>();

  const { toast } = useToast();

  const publicClient = usePublicClient(
    isConnected ? undefined : { chainId: chain?.id },
  );

  const { data: walletClient } = useWalletClient();

  const [search, setSearch] = useState("");

  const [asset, setAsset] = useState<string>("all");

  const assetList: { label: string; value: string }[] = useMemo(() => {
    if (pairs === undefined) {
      return [];
    }

    return Object.entries(
      pairs.reduce<Record<string, string>>(
        (acc, value) => ({
          ...acc,
          [value.sellToken]:
            value.sellToken === constants.zeroAddress
              ? "ETH"
              : value.sellSymbol ?? value.sellToken,
          [value.buyToken]:
            value.buyToken === constants.zeroAddress
              ? "ETH"
              : value.buySymbol ?? value.buyToken,
        }),
        {},
      ),
    )
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0));
  }, [pairs]);

  const filtered = useMemo(() => {
    if (pairs === undefined) {
      return [];
    }

    return pairs.filter(
      (pair) => matchByAddress(pair, asset) && matchBySearch(pair, search),
    );
  }, [asset, search, pairs]);

  const createSwap = useCreateSwap((swap) => {
    toast({
      title: "Swap has been created",
    });

    setPairs((prev) => (prev === undefined ? [swap] : prev.concat(swap)));
  });

  const handleSwapCreate = useCallback(
    (data: NewSwap) => {
      setTxPending(-1);
      createSwap(data)
        .then(() => setOpen(false))
        .catch((e) => {
          toast({
            title: "Failed",
            description: e instanceof Error ? e.message : JSON.stringify(e),
          });
        })
        .finally(() => setTxPending(undefined));
    },
    [createSwap, toast],
  );

  const handleSwapRemove = useCallback(
    async (swap: Swap, functionName: "cancelSwap" | "completeSwap") => {
      if (!walletClient) {
        return;
      }

      const swapId = swap.swapId;

      setTxPending(Number(swapId));

      const params = {
        address: CONFIG.exchangeContract,
        abi,
        functionName,
        args: [swapId],
      };

      try {
        if (functionName === "completeSwap") {
          if (swap.buyToken === constants.zeroAddress) {
            if (balance && balance.value < swap.buyAmount) {
              toast({
                title: "Not enough balance to buy the swap",
              });
              return;
            }
            Object.assign(params, { value: swap.buyAmount });
          } else {
            const [balance, allowance] = await Promise.all([
              publicClient.readContract({
                address: swap.buyToken as Address,
                abi: erc20ABI,
                functionName: "balanceOf",
                args: [address!],
              }),
              publicClient.readContract({
                address: swap.buyToken as Address,
                abi: erc20ABI,
                functionName: "allowance",
                args: [address!, CONFIG.exchangeContract],
              }),
            ]);

            if (balance < swap.buyAmount) {
              toast({
                title: "Not enough balance to buy the swap",
              });
              return;
            }

            if (allowance < swap.buyAmount) {
              const hash = await walletClient?.writeContract({
                address: swap.buyToken as Address,
                abi: erc20ABI,
                functionName: "approve",
                args: [CONFIG.exchangeContract, swap.buyAmount],
              });

              const tx = await publicClient.waitForTransactionReceipt({
                hash,
              });

              if (tx.status === "reverted") {
                toast({
                  title: "Failed to buy the swap",
                });

                setTxPending(undefined);

                return;
              }
            }
          }
        }

        const hash = await walletClient.writeContract(params);

        const tx = await publicClient.waitForTransactionReceipt({
          hash,
        });

        if (tx.status === "success") {
          await fetch("/api/exchange", {
            method: "DELETE",
            body: JSON.stringify({ swapId: Number(swapId) }),
          });

          setPairs((prev) => prev?.filter((item) => item.swapId !== swapId));

          if (functionName === "completeSwap") {
            toast({
              title: "Swap completed",
            });
          }
        } else {
          toast({
            title: "Transaction failed",
          });
        }
      } catch (e) {
        toast({
          title: "Failed",
          description: e instanceof Error ? e.message : JSON.stringify(e),
        });
      } finally {
        setTxPending(undefined);
      }
    },
    [address, balance, publicClient, toast, walletClient],
  );

  useEffect(() => {
    const getData = async () => {
      const response = await fetch("/api/exchange");
      const data: number[] = await response.json();
      const swaps = await publicClient.multicall({
        // @ts-expect-error: abi type mismatch
        contracts: data.map((swapId) => ({
          address: CONFIG.exchangeContract,
          abi,
          functionName: "swaps",
          args: [swapId],
        })),
      });

      const pairs: Swap[] = [];

      swaps.forEach((item, index) => {
        const result = item.result as (string | number | bigint)[];
        if (item.status === "success" && result[5] === 1) {
          pairs.push({
            creator: String(result[0]),
            sellToken: String(result[1]),
            buyToken: String(result[2]),
            sellAmount: BigInt(result[3]),
            buyAmount: BigInt(result[4]),
            swapId: BigInt(data[index]),
          } as Swap);
        }
      });

      const data1 = await publicClient.multicall({
        // @ts-expect-error: abi type mismatch
        contracts: pairs
          .map((pair) => [
            {
              address: pair.sellToken,
              abi: erc20ABI,
              functionName: "decimals",
            },
            {
              address: pair.sellToken,
              abi: erc20ABI,
              functionName: "symbol",
            },
            {
              address: pair.buyToken,
              abi: erc20ABI,
              functionName: "decimals",
            },
            {
              address: pair.buyToken,
              abi: erc20ABI,
              functionName: "symbol",
            },
          ])
          .flat(),
      });

      pairs.forEach((pair, index) => {
        if (data1[index * 4].status === "success") {
          pair.sellDecimals = Number(data1[index * 4].result);
        }

        if (data1[index * 4 + 1].status === "success") {
          pair.sellSymbol = String(data1[index * 4 + 1].result);
        }

        if (data1[index * 4 + 2].status === "success") {
          pair.buyDecimals = Number(data1[index * 4 + 2].result);
        }

        if (data1[index * 4 + 3].status === "success") {
          pair.buySymbol = String(data1[index * 4 + 3].result);
        }
      });

      return pairs;
    };

    getData().then(setPairs);
  }, [publicClient]);

  return (
    <div className="w-full flex flex-col gap-8 max-w-4xl mx-auto">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Dropdown
            label="Select asset"
            onChange={setAsset}
            value={asset}
            options={[{ value: "all", label: "Select asset" }].concat(
              assetList,
            )}
          />
        </div>
        <Search
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {isConnected ? (
        <>
          <div className="flex justify-between">
            <p className="text-gray-500">Pairs you created</p>
            <NewPairModal
              open={open}
              onSubmit={handleSwapCreate}
              pending={txPending === -1}
              onOpenChange={setOpen}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {pairs ? (
              filtered
                .filter((pair) => pair.creator === address)
                .map((pair, key) => (
                  <ExchangeCard
                    key={key}
                    token0={{
                      name: pair.sellSymbol,
                      amount: pair.sellAmount,
                      address: pair.sellToken,
                      decimals: pair.sellDecimals,
                    }}
                    token1={{
                      name: pair.buySymbol,
                      amount: pair.buyAmount,
                      address: pair.buyToken,
                      decimals: pair.buyDecimals,
                    }}
                    pending={txPending === Number(pair.swapId)}
                    onCancel={() => handleSwapRemove(pair, "cancelSwap")}
                  />
                ))
            ) : (
              <Spinner className="mx-auto col-span-3" />
            )}
          </div>
          <div className="text-gray-500">Or choose pair you want to buy</div>
          <div className="grid grid-cols-3 gap-4">
            {pairs ? (
              filtered
                .filter((pair) => pair.creator !== address)
                .map((pair, key) => (
                  <ExchangeCard
                    key={key}
                    direction={false}
                    token0={{
                      name: pair.sellSymbol,
                      amount: pair.sellAmount,
                      address: pair.sellToken,
                      decimals: pair.sellDecimals,
                    }}
                    token1={{
                      name: pair.buySymbol,
                      amount: pair.buyAmount,
                      address: pair.buyToken,
                      decimals: pair.buyDecimals,
                    }}
                    pending={txPending === Number(pair.swapId)}
                    onSwap={() => handleSwapRemove(pair, "completeSwap")}
                  />
                ))
            ) : (
              <Spinner className="mx-auto col-span-3" />
            )}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pairs ? (
            filtered.map((pair, key) => (
              <ExchangeCard
                key={key}
                token0={{
                  name: pair.sellSymbol,
                  amount: pair.sellAmount,
                  address: pair.sellToken,
                  decimals: pair.sellDecimals,
                }}
                token1={{
                  name: pair.buySymbol,
                  amount: pair.buyAmount,
                  address: pair.buyToken,
                  decimals: pair.buyDecimals,
                }}
              />
            ))
          ) : (
            <Spinner className="mx-auto col-span-3" />
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
