"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

import LineChartIcon from "@/assets/images/icons/line_chart.png";
import BarChartIcon from "@/assets/images/icons/bar_chart.png";
import Image from "next/image";
import InfoIcon from "@/components/infoIcon";
import { formatWithCommas } from "@/lib/formats";

export const CHART_DATA = [
  {
    name: "Jan",
    Ethereum: 4000,
    Solana: 1600,
    "Binance Smartchain": 2400,
    amt: 2400,
  },
  {
    name: "Feb",
    Ethereum: 3000,
    "Binance Smartchain": 1398,
    Solana: 2600,
    amt: 2210,
  },
  {
    name: "Mar",
    Solana: 3600,
    Ethereum: 2000,
    "Binance Smartchain": 9800,
    amt: 2290,
  },
  {
    name: "Apr",
    Ethereum: 2780,
    "Binance Smartchain": 3908,
    Solana: 1800,
    amt: 2000,
  },
  {
    name: "May",
    Ethereum: 1890,
    "Binance Smartchain": 4800,
    Solana: 2300,
    amt: 2181,
  },
  {
    name: "June",
    Ethereum: 2390,
    "Binance Smartchain": 3800,
    Solana: 600,
    amt: 2500,
  },
  {
    name: "July",
    Ethereum: 3490,
    "Binance Smartchain": 4300,
    Solana: 1900,
    amt: 2100,
  },
];

const tabs = [BarChartIcon, LineChartIcon];

const TotalListing: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<number>(0);

  return (
    <div className="flex flex-col gap-[24px] w-[571px] border-[#27272a] border border-[1px] rounded-[8px] border border-[1px] rounded-[8px] p-[16px] bg-[#18181b]">
      <div className="flex justify-between">
        <div className="flex gap-[12px] flex-col">
          <div className="flex gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px]">
              Total Listings
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#fafafa] font-bold text-[28px] leading-[40px]">
            {formatWithCommas(3409)} Tokens
          </div>
        </div>
        <div className="flex gap-4 items-center">
          {tabs.map((tab, index: number) => {
            return (
              <button
                className={`${
                  index === activeTab ? "bg-[#000000]" : "bg-[#27272a]"
                } h-[43px] w-[43px] rounded-[7px] flex items-center justify-center`}
                key={index}
                onClick={() => {
                  setActiveTab(index);
                }}
              >
                <Image src={tab} width={16} height={16} alt="icon-bar-chart" />
              </button>
            );
          })}
        </div>
      </div>
      {activeTab === 0 ? (
        <BarChart width={539} height={259} data={CHART_DATA}>
          <XAxis dataKey="name" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Ethereum" stackId="a" fill="#0ea5e9" />
          <Bar dataKey="Binance Smartchain" stackId="a" fill="#eab308" />
          <Bar dataKey="Solana" stackId="a" fill="#6366F1" />
        </BarChart>
      ) : (
        <LineChart
          width={539}
          height={259}
          data={CHART_DATA}
          syncId="total-listing-line-chart"
          margin={{
            top: 10,
            right: 20,
            left: 20,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="Ethereum"
            stroke="#22d3ee"
            fill="#22d3ee"
          />
        </LineChart>
      )}
    </div>
  );
};

export default TotalListing;
