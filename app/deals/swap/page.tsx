"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ExternalProvider } from "@ethersproject/providers";
import { useAccount } from "wagmi";
import { depositAssetDetailsUser2 } from "@/lib/Utils/NftInteract";
import { user2tokenDeposit } from "@/lib/Utils/Erc20Interact";
import NftDetail from "../NftDetail";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import { FaRegSnowflake } from "react-icons/fa6";
import walletGif from "@/assets/images/wallet.gif";
import snow from "@/assets/images/snow-cap.png";
import { IoMdClose } from "react-icons/io";
import randomLightBgColor from "@/lib/Utils/randomLightBgColor";
import alchemy from "@/lib/alchemy";
import { BsFillImageFill } from "react-icons/bs";
import { FaCoins } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import { IoSwapHorizontal } from "react-icons/io5";

interface NftType {
  address: string;
  tokenId: string;
  title: string;
  image: string;
}

interface TokenType {
  name: string;
  symbol: string;
  balance: string;
  address: string;
  logo?: string;
}

interface CustomWindow extends Window {
  ethereum: ExternalProvider;
}

interface INftContract {
  address: string;
  tokenId: ethers.BigNumberish;
}

const SwapPage = () => {
  const { address, isConnected } = useAccount();
  const [amount, setAmount] = useState<string>("");
  const [freezeClicked, setFreezeClicked] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NftType[]>([]);
  const [selectedNft, setSelectedNft] = useState<NftType | null>(null);
  const [tokens, setTokens] = useState<TokenType[]>([]);
  const [selectedToken, setSelectedToken] = useState<TokenType | null>(null);
  const [showNftSelector, setShowNftSelector] = useState<boolean>(false);
  const [showTokenSelector, setShowTokenSelector] = useState<boolean>(false);
  const [sessionURL, setSessionURL] = useState<string>("");
  // const router = useRouter();
  const searchParams = useSearchParams();
  const session_id = searchParams.get("session_id");
  const userAddress = searchParams.get("userAddress");
  const title = searchParams.get("token");
  console.log("title", title);
  // const { session_id, userAddress, title } = router.query;
  const fetchNFTs = useCallback(async (walletAddress: string) => {
    try {
      const nftData = await alchemy.nft.getNftsForOwner(walletAddress);
      const fetchedNfts = nftData.ownedNfts.map(
        (nft): NftType => ({
          address: nft.contract.address,
          tokenId: nft.tokenId,
          title: nft.name || `NFT ${nft.tokenId} from ${nft.contract.name}`,
          image: nft.image?.originalUrl || "default_image_url_here",
        }),
      );
      setNfts(fetchedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, []);

  const fetchTokens = useCallback(async (walletAddress: string) => {
    try {
      const balances = await alchemy.core.getTokenBalances(walletAddress);
      const tokenDetails: TokenType[] = await Promise.all(
        balances.tokenBalances
          .filter((token) => token.tokenBalance !== "0")
          .map(async (token) => {
            const metadata = await alchemy.core.getTokenMetadata(
              token.contractAddress,
            );

            return {
              name: metadata.name ?? "Unknown Name",
              symbol: metadata.symbol ?? "Unknown Symbol",
              balance:
                metadata.decimals !== null
                  ? (
                      Number(token.tokenBalance) /
                      Math.pow(10, metadata.decimals)
                    ).toFixed(2)
                  : "0.00",
              address: token.contractAddress,
            };
          }),
      );

      setTokens(tokenDetails);
    } catch (error) {
      console.error("Error fetching Tokens Balances:", error);
    }
  }, []);

  useEffect(() => {
    const fullURL = window.location.href;
    setSessionURL(fullURL);

    console.log("Full URL:", fullURL);
  }, [sessionURL]);

  const initializeEthers = async () => {
    try {
      const customWindow = window as unknown as CustomWindow;
      // Cast window to CustomWindow

      const provider = new ethers.providers.Web3Provider(customWindow.ethereum);

      const [account] = await provider.listAccounts();

      const balance = await provider.getBalance(account);

      console.log(`Balance: ${ethers.utils.formatEther(balance)} ETH`);

      return provider;
    } catch (error) {
      // Check if error is an instance of Error and has a message property

      if (error instanceof Error) {
        console.error("Error initializing ethers:", error.message);
      } else {
        console.error("An unknown error occurred");
      }

      return;

      null;
    }
  };

  useEffect(() => {
    const getEthers = async () => {
      const provider = await initializeEthers();
      if (provider) {
        console.log("Ethereum provider initialized");
      }
    };
    getEthers();
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      fetchNFTs(address);
      fetchTokens(address);
    }
  }, [address, isConnected, fetchNFTs, fetchTokens]);

  const handleNftSelect = (nft: NftType) => {
    setSelectedNft(nft);
    setShowNftSelector(false);
  };

  const handleTokenSelect = (token: TokenType) => {
    setSelectedToken(token);
    setShowTokenSelector(false);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleFreezeClick = async () => {
    setFreezeClicked(true);
    const provider = await initializeEthers();

    if (!provider) {
      toast.error("Ethereum provider initialization failed.");
      setFreezeClicked(false);
      return;
    }

    if (selectedNft) {
      // Handle NFT deposit
      try {
        // Create an object that matches the INftContract structure
        const nftContract: INftContract = {
          address: selectedNft.address,
          tokenId: selectedNft.tokenId,
        };

        await depositAssetDetailsUser2(provider, sessionURL, nftContract);
        toast.success("NFT deposit successful.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Failed to deposit NFT.");
        console.error("Error depositing NFT:", error.message);
      }
    } else if (selectedToken && amount) {
      try {
        const bigNumberAmount = ethers.utils.parseUnits(amount, "ether"); // Convert the amount to BigNumber
        await user2tokenDeposit(
          provider,
          sessionURL,
          selectedToken.address,
          bigNumberAmount.toString(),
        );
        toast.success("Token deposit successful.");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error("Failed to deposit tokens.");
        console.error("Error depositing tokens:", error.message);
      }
    } else {
      toast.error("No asset selected or invalid amount.");
    }

    setFreezeClicked(false);
  };

  return (
    <div className="flex flex-col relative max-md:gap-[40px] md:flex-row max-md:pt-[100px] max-md:items-center text-white z-[9]">
      <Toaster position="bottom-center" reverseOrder={false} />
      {/* Left Side */}
      <div className="flex flex-col items-center justify-center flex-1 md:p-6">
        {!isConnected && (
          <Image alt="walletGif" src={walletGif} width={180} height={180} />
        )}
        <div className={"rounded-lg mb-2"}>
          {!isConnected && (
            <ConnectButton
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus="icon"
            />
          )}
        </div>
        {!isConnected && (
          <p className="text-[17px] text-[#bebdbd] mt-3">
            Please connect your wallet
          </p>
        )}
        {isConnected && (
          <div>
            <div className="flex flex-col gap-3">
              <div
                className="p-4 bg-[#18181B] hover:bg-[#242426f9] group hover:outline hover:outline-1 hover:outline-[#06B6D4] w-[400px] rounded-lg cursor-pointer"
                onClick={() => setShowNftSelector(!freezeClicked && true)}
              >
                <div className="flex items-start gap-3">
                  <BsFillImageFill className="w-8 h-full mt-2" />
                  <div className="flex flex-col gap-1">
                    <h1 className="font-[700] raleWayFont text-[24px] group-hover:text-[#67E8F9] ">
                      NFT
                    </h1>
                    <p className="text-[#A1A1AA] text-[14px] font-[400]">
                      All Non-fungible tokens within your connected wallet will
                      be revealed.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="p-4 bg-[#18181B] hover:bg-[#242426f9] group hover:outline hover:outline-1 hover:outline-[#06B6D4] w-[400px] rounded-lg cursor-pointer"
                onClick={() => setShowTokenSelector(!showTokenSelector)} // Enable button if Freeze not clicked
              >
                <div className="flex items-start gap-2">
                  <FaCoins className="w-8 h-full mt-2" />

                  <div className="flex flex-col gap-1">
                    <h1 className="font-[700] group-hover:text-[#67E8F9] raleWayFont text-[24px]">
                      Tokens
                    </h1>
                    <p className="text-[#A1A1AA] text-[14px] font-[400]">
                      All ERC-20 tokens within your connected wallet will be
                      revealed.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#27272A] flex flex-col gap-5 px-3 pt-4 pb-8 w-[400px] rounded-lg">
                <h1 className="font-[500] raleWayFont text-[16px] ">
                  Selected token(s)
                </h1>
                {selectedNft ? (
                  <div className="flex gap-2 items-center border border-[#52525B] rounded-md p-2">
                    {selectedNft.image !== "default_image_url_here" ? (
                      <Image
                        src={selectedNft.image}
                        alt="placeholder"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: randomLightBgColor() }}
                        className="w-[45px] flex items-center justify-center h-[45px] rounded-full"
                      >
                        <h1 className="text-black uppercase">
                          {selectedNft.title?.slice(0, 1)}
                        </h1>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <p className="text-[white] raleWayFont font-[500] text-[13px]">
                        {selectedNft.title}
                      </p>
                      <p className="text-[gray] translate-y-[-2px] text-[14px]">
                        {selectedNft.tokenId}
                      </p>
                    </div>
                  </div>
                ) : selectedToken ? (
                  <>
                    <div className="flex gap-2 items-center border border-[#52525B] rounded-md p-2">
                      {selectedToken?.logo !== null ? (
                        <div
                          style={{ backgroundColor: randomLightBgColor() }}
                          className={` w-[45px] flex items-center justify-center h-[45px] rounded-full `}
                        >
                          <h1 className="text-black uppercase">
                            {selectedToken?.name?.slice(0, 1)}
                          </h1>
                        </div>
                      ) : (
                        <Image
                          alt="tokenLogo"
                          src={selectedToken?.logo}
                          width={45}
                          height={45}
                        />
                      )}
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <p className="text-[white] raleWayFont font-[500] text-[13px]">
                            {selectedToken.name}
                          </p>
                          <p className="text-[gray] translate-y-[-2px] text-[14px] lowercase">
                            {selectedToken.symbol}
                          </p>
                        </div>
                        <p className="text-[#FAFAFA] text-[13px]">
                          {selectedToken.balance}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[gray] text-[13px] leading-[10px]">
                        Enter Amount
                      </p>
                      <input
                        placeholder="Enter amount"
                        value={amount}
                        onChange={handleAmountChange}
                        className="bg-transparent w-[220px] border placeholder:text-[14px] placeholder:text-white placeholder:raleWayFont text-white rounded px-2 py-1 outline-none my-2 mt-3"
                        max={selectedToken.balance}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <FiInfo />
                    <p className="text-[14px] text-[#A1A1AA]">
                      Choose a token(s) to trade, the token(s) will be visible
                      here.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {(showNftSelector || showTokenSelector) && (
          <div
            className="absolute left-0 top-0 w-full h-full z-[2] backdrop-blur-sm"
            onClick={() => {
              setShowNftSelector(false);
              setShowTokenSelector(false);
            }}
          />
        )}
        {showNftSelector && (
          <div className="absolute z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-h-[600px] overflow-y-auto bg-[#18181B] p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-end w-full">
              <button
                onClick={() => setShowNftSelector(false)}
                type="button"
                className="text-white p-2 text-[22px]"
              >
                <IoMdClose />
              </button>
            </div>
            <div className="relative">
              <h2 className="text-lg raleWayFont text-center font-semibold mb-2 text-[#E4E4E7]">
                Select an NFT for swap
              </h2>
              <div className="max-h-[200px] overflow-y-scroll mt-6 noScroll">
                {nfts.map((nft) => (
                  <div
                    key={`${nft.address}-${nft.tokenId}`}
                    onClick={() => handleNftSelect(nft)}
                    className="py-4 px-3 bg-[#27272A] cursor-pointer hover:bg-[#212020] rounded-lg text-[#FAFAFA] flex items-center"
                  >
                    {nft?.image && nft.image !== "default_image_url_here" ? (
                      <Image
                        src={
                          selectedNft?.image &&
                          selectedNft.image !== "default_image_url_here"
                            ? selectedNft.image
                            : "/default-image-path.jpg" // Provide a default image path
                        }
                        alt={selectedNft?.title ?? "NFT Image"} // Provide a default alt text if title is not available
                        width={50}
                        height={50}
                        layout="fixed"
                      />
                    ) : (
                      <div
                        style={{ backgroundColor: randomLightBgColor() }}
                        className="w-[45px] flex items-center justify-center h-[45px] rounded-full mr-2"
                      >
                        <h1 className="text-black uppercase">
                          {nft?.address?.slice(0, 1)}
                        </h1>
                      </div>
                    )}
                    <h1 className="">{nft.title}</h1>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {showTokenSelector && (
          <div className="absolute z-[3] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-h-[600px] overflow-y-auto bg-[#18181B] p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-end w-full">
              <button
                onClick={() => setShowTokenSelector(false)}
                type="button"
                className="text-white p-2 text-[22px]"
              >
                <IoMdClose />
              </button>
            </div>
            <h2 className="text-lg raleWayFont text-center font-semibold mb-2 text-[#E4E4E7]">
              Select a Token for swap
            </h2>
            <div className="max-h-[800px] flex flex-col gap-5 overflow-y-scroll mt-6 noScroll">
              {tokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => handleTokenSelect(token)}
                  className="py-4 px-3 bg-[#27272A] cursor-pointer hover:bg-[#212020] rounded-lg text-[#FAFAFA] flex flex-col"
                >
                  <div className="flex items-center gap-2 ">
                    {token?.logo !== null ? (
                      <div
                        style={{ backgroundColor: randomLightBgColor() }}
                        className={` w-[45px] flex items-center justify-center h-[45px] rounded-full `}
                      >
                        <h1 className="text-black uppercase">
                          {token?.name?.slice(0, 1)}
                        </h1>
                      </div>
                    ) : (
                      <Image
                        alt="tokenLogo"
                        src={token?.logo}
                        width={45}
                        height={45}
                      />
                    )}
                    <div>
                      <div className="flex gap-2">
                        <p className="font-semibold text-[14px]">
                          {token.name}
                        </p>
                        <span className="text-[10px] w-[60%] text-[#A1A1AA]">
                          {token.symbol}
                        </span>
                      </div>
                      <p>{token.balance}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center w-12 md:p-6">
        <IoSwapHorizontal />
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-6">
        <div className="flex flex-col items-center space-y-4 bg-[#18181B] p-8 rounded-md w-[380px]">
          <h2 className="text-[28px] raleWayFont text-left w-full font-semibold mb-4 text-[#E4E4E7]">
            You will receive
          </h2>
          <NftDetail
            sessionId={session_id ?? ""}
            userAddress={userAddress ?? ""}
            title={title ?? ""}
          />
        </div>
        <div className="flex items-center justify-end w-[380px] gap-2 md:space-y-4 mt-8 relative">
          <div className="relative">
            <button
              onClick={handleFreezeClick}
              className={`${
                freezeClicked ? "cursor-not-allowed" : ""
              } text-white h-[45px] relative w-[180px] py-1 flex gap-3 items-center justify-center rounded-full px-8 transition-all duration-300 shadow-md shadow-[#0ed8d8] text-[18px] font-[500]`}
              disabled={freezeClicked}
              style={{
                background: freezeClicked
                  ? "gray"
                  : "linear-gradient(90deg, #06B6D4 0%, #4563FF 100%), linear-gradient(0deg, #06B6D4, #06B6D4)",
              }}
            >
              <FaRegSnowflake /> Freeze
            </button>
            <div className="absolute top-[-13px] right-[5px]">
              <Image src={snow} alt="snow" width={80} height={80} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
