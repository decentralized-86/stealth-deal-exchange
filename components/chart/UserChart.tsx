"use client";
import React, { useState } from "react";
import { XAxis, Tooltip, AreaChart, Area } from "recharts";
import { CHART_DATA } from "./TotalListing";
import InfoIcon from "../infoIcon";
import ChartDuration from "./chartDuration";
import { formatWithCommas } from "@/lib/formats";

const UserChart = () => {
  const [, setDuration] = useState(1);

  return (
    <div className="flex flex-col gap-[24px] border-[#27272a] border border-[1px] rounded-[8px] p-[16px] bg-[#18181b]">
      <div className="flex justify-between">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-row gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px]">
              Number of Users
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#fafafa] font-bold text-[28px] leading-[40px]">
            {formatWithCommas(87566)}
          </div>
        </div>
        <ChartDuration onValueChanged={setDuration} className="ml-auto" />
      </div>
      <AreaChart
        width={1134}
        height={300}
        data={CHART_DATA}
        syncId="user-charts"
        margin={{
          top: 10,
          right: 20,
          left: 20,
          bottom: 0,
        }}
      >
        <XAxis dataKey="name" />
        {/* <YAxis /> */}
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Ethereum"
          stroke="#a3e635"
          fill="#2f3b1f"
        />
      </AreaChart>
    </div>
  );
};

export default UserChart;
