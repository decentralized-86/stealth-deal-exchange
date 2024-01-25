import { useCallback } from "react";
import {
  Address,
  erc20ABI,
  useAccount,
  useContractEvent,
  useNetwork,
  usePublicClient,
  useWalletClient,
  PublicClient,
} from "wagmi";
import { abi } from "@/contracts/artifacts/contracts/StealthMarketExchange.sol/StealthMarketExchange.json";
import CONFIG from "@/next.config";
import { NewSwap, Swap } from "./page";
import { useToast } from "@/components/ui/use-toast";
import * as constants from "@/lib/constants";

const getSwapInfo = async (
  client: PublicClient,
  swapId: number,
  creator: string,
  sellToken: string,
  sellAmount: string,
  buyToken: string,
  buyAmount: string,
) => {
  await fetch("/api/exchange", {
    method: "POST",
    body: JSON.stringify({ swapId }),
  });
  const data = await client.multicall({
    contracts: [
      {
        address: sellToken as Address,
        abi: erc20ABI,
        functionName: "decimals",
      },
      {
        address: sellToken as Address,
        abi: erc20ABI,
        functionName: "symbol",
      },
      {
        address: buyToken as Address,
        abi: erc20ABI,
        functionName: "decimals",
      },
      {
        address: buyToken as Address,
        abi: erc20ABI,
        functionName: "symbol",
      },
    ],
  });
  const swap: Swap = {
    swapId: BigInt(swapId),
    creator: String(creator),
    sellToken: String(sellToken),
    sellAmount: BigInt(sellAmount),
    sellDecimals: data[0].status === "success" ? data[0].result : 8,
    sellSymbol: data[1].status === "success" ? data[1].result : "unknown",
    buyToken: String(buyToken),
    buyAmount: BigInt(buyAmount),
    buyDecimals: data[2].status === "success" ? data[2].result : 8,
    buySymbol: data[3].status === "success" ? data[3].result : "unknown",
  };

  return swap;
};

const useCreateSwap = (onSwapCreated: (swap: Swap) => void) => {
  const { address, isConnected } = useAccount();

  const { chain } = useNetwork();

  const publicClient = usePublicClient(
    isConnected ? undefined : { chainId: chain?.id },
  );

  const { toast } = useToast();

  const { data: walletClient } = useWalletClient();

  useContractEvent({
    address: CONFIG.exchangeContract,
    abi,
    eventName: "SwapCreated",
    chainId: chain?.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listener: async (logs: any[]) => {
      if (!address) {
        return;
      }

      for (const log of logs) {
        if (
          log.eventName === "SwapCreated" &&
          log.args.creator.toLowerCase() === address?.toLowerCase()
        ) {
          /* todo:
          const swap = await getSwapInfo(
            publicClient,
            log.args.swapId,
            address,
            log.args.sellToken,
            log.args.sellAmount,
            log.args.buyToken,
            log.args.buyAmount,
          );
          onSwapCreated(swap);
          return;
          */
        }
      }
    },
  });

  const createSwap = useCallback(
    async (data: NewSwap) => {
      if (!walletClient || !address) {
        return;
      }

      const params = {
        address: CONFIG.exchangeContract,
        abi,
        functionName: "createSwap",
        args: [
          data.sellToken === "" ? constants.zeroAddress : data.sellToken,
          data.buyToken === "" ? constants.zeroAddress : data.buyToken,
          data.sellAmount,
          data.buyAmount,
        ],
      };

      if (data.sellToken === "") {
        Object.assign(params, { value: data.sellAmount });
      } else {
        const allowance = await publicClient.readContract({
          address: data.sellToken as Address,
          abi: erc20ABI,
          functionName: "allowance",
          args: [address!, CONFIG.exchangeContract],
        });

        if (allowance < data.sellAmount) {
          const hash = await walletClient?.writeContract({
            address: data.sellToken as Address,
            abi: erc20ABI,
            functionName: "approve",
            args: [CONFIG.exchangeContract, data.sellAmount],
          });

          const tx = await publicClient.waitForTransactionReceipt({
            hash,
          });

          if (tx.status === "reverted") {
            toast({
              title: "Failed to create the swap",
            });

            return;
          }
        }
      }

      const hash = await walletClient?.writeContract(params);

      const tx = await publicClient.waitForTransactionReceipt({
        hash,
      });

      if (tx.status === "reverted") {
        toast({
          title: "Failed to create the swap",
        });
        return;
      }

      const swapId = await publicClient.getStorageAt({
        address: CONFIG.exchangeContract,
        slot: "0x0",
      });

      const swap = await getSwapInfo(
        publicClient,
        Number(swapId) - 1,
        address,
        String(params.args[0]),
        String(params.args[2]),
        String(params.args[1]),
        String(params.args[3]),
      );
      onSwapCreated(swap);
    },
    [walletClient, publicClient, address, onSwapCreated, toast],
  );

  return createSwap;
};

export default useCreateSwap;
