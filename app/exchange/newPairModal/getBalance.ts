import { Address, PublicClient } from "viem";
import { erc20ABI } from "wagmi";

const getBalance =
  (publicClient: PublicClient, address: Address, etherBalance: bigint) =>
  async (token: string | undefined) => {
    try {
      if (!!token) {
        const [balance, decimals] = await Promise.all([
          publicClient.readContract({
            address: token as Address,
            abi: erc20ABI,
            functionName: "balanceOf",
            args: [address!],
          }),
          publicClient.readContract({
            address: token as Address,
            abi: erc20ABI,
            functionName: "decimals",
          }),
        ]);
        return {
          balance,
          decimals,
        };
      } else {
        return {
          balance: etherBalance,
          decimals: 18,
        };
      }
    } catch {
      return false;
    }
  };

export default getBalance;
