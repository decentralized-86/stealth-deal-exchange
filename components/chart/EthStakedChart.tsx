"use client";
import React, { useCallback, useState } from "react";
import { PieChart, Pie, Sector, Cell } from "recharts";
import InfoIcon from "../infoIcon";

const data = [
  {
    name: "",
    value: 68,
  },
  {
    name: "32%",
    value: 32,
  },
];

const colors = ["#27272a", "#22d3ee"];

// @ts-expect-error: TODO: fix
const renderActiveShape = (props) => {
  // const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    // midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    // percent,
    // value,
  } = props;
  // const sin = Math.sin(-RADIAN * midAngle)
  // const cos = Math.cos(-RADIAN * midAngle)
  // const sx = cx + (outerRadius + 10) * cos
  // const sy = cy + (outerRadius + 10) * sin
  // const mx = cx + (outerRadius + 30) * cos
  // const my = cy + (outerRadius + 30) * sin
  // const ex = mx + (cos >= 0 ? 1 : -1) * 22
  // const ey = my
  // const textAnchor = cos >= 0 ? 'start' : 'end'

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill={fill}
        style={{ fontSize: 25 }}
      >
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

const EthStakedChart: React.FC = () => {
  const [isSSR, setIsSSR] = useState(true);

  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    // @ts-expect-error: TODO: fix
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex],
  );

  React.useEffect(() => {
    setIsSSR(false);
  }, []);
  return (
    <div className="flex flex-col bg-[#18181b] rounded-[8px] border-[#27272a] border border-[1px] w-[361px]">
      <div className="flex justify-between p-[16px]">
        <div className="flex flex-col gap-[12px]">
          <div className="flex gap-[8px]">
            <span className="text-[#A1A1AA] text-[16px] font-bold leading-[16px] whitespace-nowrap">
              ETH Staked
            </span>
            <InfoIcon />
          </div>
          <div className="text-[#A5F3FC] font-bold text-[48px] leading-[54px]">
            32%
          </div>
        </div>

        {!isSSR && (
          <PieChart width={800} height={162}>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={120}
              outerRadius={220}
              fill="#22d3ee"
              dataKey="value"
              onMouseEnter={onPieEnter}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index]} />
              ))}
            </Pie>
          </PieChart>
        )}
      </div>
    </div>
  );
};

export default EthStakedChart;
