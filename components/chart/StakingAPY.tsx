"use client";
import React from "react";
import { Tooltip, AreaChart, Area } from "recharts";
import { CHART_DATA } from "./TotalListing";
import InfoIcon from "../infoIcon";

const StakingAPY: React.FC = () => {
  const [isSSR, setIsSSR] = React.useState(true);

  React.useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <div className="flex flex-col bg-[#18181b] rounded-[8px] border-[#27272a] border border-[1px] w-[361px]">
      <div className="flex justify-between p-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex flex-row gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px]">
              Current Staking APY
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#A5F3FC] font-bold text-[48px] leading-[54px]">
            16%
          </div>
        </div>
      </div>
      {!isSSR && (
        <>
          <AreaChart
            width={361}
            height={95}
            data={CHART_DATA}
            syncId="StakingAPY"
            margin={{
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
          >
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Ethereum"
              stroke="#67e8f9"
              fill="#144245"
            />
          </AreaChart>
        </>
      )}
    </div>
  );
};

export default StakingAPY;
