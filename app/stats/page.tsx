import ETHStakedValue from "@/components/chart/ETHStakedValue";
import EthStakedChart from "@/components/chart/EthStakedChart";
import NumberOfTrades from "@/components/chart/NumberOfTrades";
import StakingAPY from "@/components/chart/StakingAPY";
import TotalListing from "@/components/chart/TotalListing";
import TotalValueLocked from "@/components/chart/TotalValueLocked";
import UserChart from "@/components/chart/UserChart";
import React from "react";
const Stats: React.FC = () => (
  <div className="max-w-[1166px] w-[100%] mx-auto flex flex-col gap-[40px]">
    <div className="flex justify-between">
      <EthStakedChart />
      <ETHStakedValue />
      <StakingAPY />
    </div>
    <TotalValueLocked />
    <UserChart />
    <div className="flex flex-wrap justify-between">
      <TotalListing />
      <NumberOfTrades />
    </div>
  </div>
);

export default Stats;
