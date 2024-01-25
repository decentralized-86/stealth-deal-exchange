"use client";
import { formatWithCommas } from "@/lib/formats";
import React from "react";
const ETHStakedValue: React.FC = () => {
  return (
    <div className="flex flex-col item-center gap-[34px] bg-[#18181b] rounded-[8px] border-[#27272a] border border-[1px] w-[361px] pt-[20px] pr-[63px] pl-[16px] pb-[16px]">
      <div className="flex flex-col gap-[16px]">
        <span className="text-[#A1A1AA] leading-[24px] text-[16px] font-bold">
          Total ETH Staked
        </span>
        <span className="text-[#fafafa] text-[28px] font-bold leading-[24px]">
          {formatWithCommas(324187566.908)}
        </span>
      </div>
      <div className="flex flex-col gap-[16px]">
        <span className="text-[#A1A1AA] leading-[24px] text-[16px] font-bold">
          Staked ETH Value
        </span>
        <span className="text-[#fafafa] text-[28px] font-bold leading-[24px]">
          {formatWithCommas(324187566.908)}
        </span>
      </div>
    </div>
  );
};

export default ETHStakedValue;
