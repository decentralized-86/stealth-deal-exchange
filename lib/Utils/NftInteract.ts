/* eslint-disable prettier/prettier */
import { ethers ,providers} from "ethers";
import { ABI } from "@/abis/Nftcontract.json";

interface INftContract {
  address: string;
  tokenId: ethers.BigNumberish;
}

const contractAddress = process.env.NEXT_PUBLIC_NFTSWAP_ADDRESS || "";

async function approveNFT(
  provider: providers.Web3Provider,
  nft: INftContract,
  approverAddress: string
): Promise<void> {
  const signer = provider.getSigner()
  const approveABI = [
    {
      "constant": false,
      "inputs": [
        {
          "name": "to",
          "type": "address"
        },
        {
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];  

  try {
    const nftContract = new ethers.Contract(nft.address, approveABI, signer);
    await nftContract.approve(approverAddress, nft.tokenId);
  } catch (error) {
    console.error("Error in approving NFT:", error);
    throw new Error("Failed to approve NFT.");
  }
}

export async function depositAssetDetailsUser2(
  provider: providers.Web3Provider,
  sessionURL: string,
  nft: INftContract
): Promise<void> {
  try {
    await approveNFT(provider, nft, contractAddress);

    const signer = provider.getSigner();
    const bytes32SessionId = ethers.utils.solidityKeccak256(["string"], [sessionURL]);
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    const transaction = await contract.depositAssetDetailsUser2(bytes32SessionId, nft.address, nft.tokenId, { gasLimit: 200000 });
    await transaction.wait();
  } catch (error) {
    console.error("Error in depositAssetDetailsUser2:", error);
    throw new Error("Failed to deposit asset details for User 2.");
  }
}

// Similar changes for depositFromAcc1 and completeSwap...
export async function depositAssetDetailsUser1(
  provider: providers.Web3Provider,
  sessionId: string,
  nft: INftContract
): Promise<void> {
  try {
    await approveNFT(provider, nft, contractAddress);

    const signer = provider.getSigner();
    const bytes32SessionId = ethers.utils.solidityKeccak256(["string"], [sessionId]);
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    const transaction = await contract.depositAssetDetailsUser1(bytes32SessionId, nft.address, nft.tokenId, { gasLimit: 200000 });
    await transaction.wait();
  } catch (error) {
    console.error("Error in depositAssetDetailsUser1:", error);
    throw new Error("Failed to deposit asset details for User 1.");
  }
}


export async function executeSwap(
  provider: providers.Web3Provider,
  sessionURL: string
): Promise<void> {
  try {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    const transaction = await contract.executeSwap(sessionURL);
    await transaction.wait();
  } catch (error) {
    console.error("Error executing swap:", error);
    throw new Error("Failed to execute swap.");
  }
}

// module.exports = {
//   depositAssetDetailsUser1,
//   depositAssetDetailsUser2,
//   executeSwap,
// };
