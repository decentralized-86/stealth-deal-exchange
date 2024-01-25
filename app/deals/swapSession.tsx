import { useState, useEffect, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";
import qrcode from "@/assets/images/qr-code.png";
import Image from "next/image";

interface SwapSessionProps {
  generateSessionId: () => Promise<string>;
}

const SwapSession: React.FC<SwapSessionProps> = ({ generateSessionId }) => {
  const [sessionURL, setSessionURL] = useState<string>("ABC");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyClick = useCallback(async () => {
    if (sessionURL) {
      try {
        await navigator.clipboard.writeText(sessionURL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        setError("Failed to copy URL to clipboard.");
      }
    }
  }, [sessionURL]);

  const handleGenerateId = useCallback(async () => {
    try {
      setIsLoading(true);
      const id = await generateSessionId();
      setSessionURL(id);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [generateSessionId]);

  useEffect(() => {
    console.log("Updated URL", sessionURL);
  }, [sessionURL]);

  useEffect(() => {
    if (error) {
      alert(error);
      setError("");
    }
  }, [error]);

  return (
    <div className="flex flex-col overflow-hidden items-center w-[360px]">
      <button
        className="max-md:w-full md:w-[280px] text-white font-semibold hover:translate-x-[1px] hover:translate-y-[2px] px-10 py-2 rounded-full focus:outline-none focus:shadow-outline-blue transition duration-300"
        onClick={handleGenerateId}
        disabled={isLoading}
        style={{
          background: "linear-gradient(90deg, #06B6D4 0%, #4563FF 100%)",
        }}
      >
        {isLoading ? "Creating Session..." : "Create Swap Session"}
      </button>

      {sessionURL && (
        <div className="flex w-full flex-col items-center space-y-4 mt-5 p-4 rounded-md bg-gradient-to-l from-[black] via-[#292929] to-[#1f1f1f]">
          {sessionURL === "ABC" ? (
            <Image src={qrcode} width={180} height={180} alt="qrCode" />
          ) : (
            <div className=" p-2 rounded-md shadow-md bg-white">
              <QRCodeSVG value={sessionURL} size={150} />
            </div>
          )}

          <div className="text-center">
            <p className="mb-2 font-semibold text-[16px] raleWayFont text-[#D4D4D8]">
              Session url
            </p>
            {sessionURL !== "ABC" && (
              <div className="flex items-center gap-2 space-x-2 p-2 rounded-md bg-[#27272A]">
                <p className="w-[200px] overflow-scroll h-[20px] text-[#22D3EE] noScroll">
                  {sessionURL}
                </p>
                <span
                  role="button"
                  className="cursor-pointer text-blue-200 hover:underline translate-y-[2px]"
                  onClick={handleCopyClick}
                >
                  {copied ? (
                    <RiFileCopy2Fill size={18} />
                  ) : (
                    <RiFileCopy2Line size={18} />
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SwapSession;
