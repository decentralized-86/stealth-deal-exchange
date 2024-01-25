import { ethers, providers } from "ethers";
import { ABI } from "@/abis/Erc20contract.json";

const contractAddress = process.env.NEXT_PUBLIC_ERC20SWAP_ADDRESS || "";

const getTokenDecimals = async (
  provider: providers.Provider,
  tokenAddress: string,
): Promise<number> => {
  const tokenABI = [
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, provider);
  return tokenContract.decimals();
};

const approveERC20 = async (
  provider: providers.Web3Provider,
  tokenAddress: string,
  spenderAddress: string,
  amount: ethers.BigNumberish,
): Promise<void> => {
  const signer = provider.getSigner();
  const approveABI = [
    {
      constant: false,
      inputs: [
        { name: "spender", type: "address" },
        { name: "amount", type: "uint256" },
      ],
      name: "approve",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
  ];

  const tokenContract = new ethers.Contract(tokenAddress, approveABI, signer);
  await tokenContract.approve(spenderAddress, amount);
};

export const user2tokenDeposit = async (
  provider: providers.Web3Provider,
  sessionURL: string,
  tokenAddress: string,
  amount: string,
): Promise<void> => {
  const decimals = await getTokenDecimals(provider, tokenAddress);
  const adjustedAmount = ethers.utils.parseUnits(amount, decimals);

  await approveERC20(provider, tokenAddress, contractAddress, adjustedAmount);

  const signer = provider.getSigner();
  const bytes32SessionId = ethers.utils.solidityKeccak256(
    ["string"],
    [sessionURL],
  );
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const transaction = await contract.depositAssetDetailsUser2(
    bytes32SessionId,
    tokenAddress,
    adjustedAmount,
  );
  await transaction.wait();
};

export const user1tokenDeposit = async (
  provider: providers.Web3Provider,
  sessionId: string,
  tokenAddress: string,
  amount: string,
): Promise<void> => {
  const decimals = await getTokenDecimals(provider, tokenAddress);
  const adjustedAmount = ethers.utils.parseUnits(amount, decimals);

  await approveERC20(provider, tokenAddress, contractAddress, adjustedAmount);

  const signer = provider.getSigner();
  const bytes32SessionId = ethers.utils.solidityKeccak256(
    ["string"],
    [sessionId],
  );
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const transaction = await contract.depositAssetDetailsUser1(
    bytes32SessionId,
    tokenAddress,
    adjustedAmount,
  );
  await transaction.wait();
};

export const executeTokenSwap = async (
  provider: providers.Web3Provider,
  sessionURL: string,
): Promise<void> => {
  const signer = provider.getSigner();
  // @ts-expect-error: TODO: fix
  const contract = ERC20TokenSwap__factory.connect(contractAddress, signer);

  const transaction = await contract.executeSwap(sessionURL, {
    gasLimit: 2000000,
  });
  await transaction.wait();
};
