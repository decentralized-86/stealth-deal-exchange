"use client";
import React, { useState } from "react";
import { XAxis, AreaChart, Area } from "recharts";
import { CHART_DATA } from "./TotalListing";
import InfoIcon from "../infoIcon";
import { formatWithCommas } from "@/lib/formats";
import ChartDuration from "./chartDuration";

const TotalValueLocked = () => {
  const [, setDuration] = useState(1);

  return (
    <div className="flex flex-col gap-[24px] border-[#27272a] border border-[1px] rounded-[8px] p-[16px] bg-[#18181b]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px]">
              Total Value Locked
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#fafafa] font-bold text-[28px] leading-[40px]">
            ${formatWithCommas(324187566.908)}
          </div>
        </div>
        <ChartDuration onValueChanged={setDuration} className="ml-auto" />
      </div>
      <AreaChart
        width={1134}
        height={160}
        data={CHART_DATA}
        margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" />
        <Area
          type="monotone"
          dataKey="Ethereum"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#colorUv)"
        />
        <Area
          type="monotone"
          dataKey="Solana"
          stroke="#82ca9d"
          fillOpacity={1}
          fill="url(#colorPv)"
        />
      </AreaChart>
    </div>
  );
};

export default TotalValueLocked;
