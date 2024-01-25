"use client";
import React, { useState } from "react";
import { XAxis, YAxis, Tooltip, AreaChart, Area } from "recharts";
import { CHART_DATA } from "./TotalListing";
import InfoIcon from "../infoIcon";
import ChartDuration from "./chartDuration";
import { formatWithCommas } from "@/lib/formats";

const NumberOfTrades = () => {
  const [, setDuration] = useState(1);

  return (
    <div className="flex flex-col gap-[24px] w-[571px] border-[#27272a] border border-[1px] rounded-[8px] p-[16px] bg-[#18181b]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px]">
              Number of Trades
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#fafafa] font-bold text-[28px] leading-[40px]">
            {formatWithCommas(340872)}
          </div>
        </div>
      </div>
      <AreaChart
        width={539}
        height={200}
        data={CHART_DATA}
        syncId="number-of-trades"
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Ethereum"
          stroke="#22d3ee"
          fill="#1a434b"
        />
      </AreaChart>
      <ChartDuration onValueChanged={setDuration} className="ml-auto" />
    </div>
  );
};

export default NumberOfTrades;
