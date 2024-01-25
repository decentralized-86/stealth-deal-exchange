import React from "react";
import { MdArrowOutward } from "react-icons/md";
import randomLightBgColor from "@/lib/Utils/randomLightBgColor";
import Link from "next/link";

interface NftDetailProps {
  sessionId: string;
  userAddress: string;
  title?: string;
}

const NftDetail: React.FC<NftDetailProps> = ({
  sessionId,
  userAddress,
  title,
}) => (
  <div className="nft-display-box flex flex-col gap-3 my-4 w-full">
    <div className="border border-[#3F3F46] p-4 rounded-md flex items-center gap-5">
      <div
        style={{ backgroundColor: randomLightBgColor() }}
        className="w-[45px] flex items-center justify-center h-[45px] rounded-full"
      >
        <h1 className="text-black uppercase">{title?.slice(0, 1)}</h1>
      </div>
      <p className="text-[#F4F4F5] mb-2 text-[16px]">{title}</p>
    </div>
    <div className="flex justify-between items-center">
      <p className="text-[14px] text-[#A1A1AA]">from user:</p>
      <p className="w-[50%] text-[#A5F3FC] text-sm font-semibold truncate">
        {userAddress}
      </p>
    </div>
    <Link
      href={`https://someblockexplorer.com/${sessionId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 flex items-center gap-1 raleWayFont rounded-md bg-[#27272A] w-fit text-[14px] text-[#22D3EE]"
    >
      View Session ID
      <MdArrowOutward />
    </Link>
  </div>
);

export default NftDetail;
