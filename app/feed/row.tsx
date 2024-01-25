import React from "react";
import { formatNumber, formatPercent } from "@/lib/formats";
import clsx from "clsx";

interface RowProps {
  token: React.ReactNode;
  price: number;
  volume: number;
  liquidity: number;
  priceChange: number;
}

const Row: React.FC<RowProps> = ({
  token,
  price,
  volume,
  liquidity,
  priceChange,
}) => (
  <tr className="bg-zinc-900 text-green-50">
    <td className="py-2 pl-4 pr-1 rounded-l">{token}</td>
    <td className="py-2 px-1 text-right">{formatNumber(price, 5)}</td>
    <td className="py-2 px-1 text-right">{formatNumber(volume)}</td>
    <td className="py-2 px-1 text-right">{formatNumber(liquidity)}</td>
    <td
      className={clsx(
        "py-2 pr-4 pl-1 rounded-r text-right",
        priceChange >= 0 ? "text-green-400" : "text-red-400",
      )}
    >
      {formatPercent(priceChange)}%
    </td>
  </tr>
);

export default Row;
