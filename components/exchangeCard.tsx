import React from "react";
import { formatUnits } from "viem";
import * as constants from "@/lib/constants";
import Spinner from "./spinner";

export interface ExchangeCardProps {
  direction?: boolean;
  token0: {
    name?: string;
    address?: string;
    amount: bigint;
    decimals: number;
  };
  token1: {
    name?: string;
    address?: string;
    amount: bigint;
    decimals: number;
  };
  pending?: boolean;
  onCancel?: () => void;
  onSwap?: () => void;
}

const ExchangeCard: React.FC<ExchangeCardProps> = ({
  direction = true,
  token0,
  token1,
  onCancel,
  onSwap,
  pending,
}) => {
  const token0Name =
    token0.address === constants.zeroAddress ? "ETH" : token0.name;
  const token1Name =
    token1.address === constants.zeroAddress ? "ETH" : token1.name;
  const token0Decimals =
    token0.address === constants.zeroAddress ? 18 : token0.decimals;
  const token1Decimals =
    token1.address === constants.zeroAddress ? 18 : token1.decimals;

  return (
    <div className="p-4 bg-zinc-900 rounded-lg text-white">
      <div className="flex justify-between items-center">
        <div>
          {token0Name}
          &nbsp;/&nbsp;
          {token1Name}
        </div>
        {pending && <Spinner size="sm" />}
        {!pending && onCancel && (
          <button
            onClick={onCancel}
            className="rounded-xl bg-zinc-700 px-2 py-1 text-xs text-red-500 hover:bg-red-950"
          >
            Cancel
          </button>
        )}
        {!pending && onSwap && (
          <button
            onClick={onSwap}
            className="rounded-xl bg-zinc-700 px-2 py-1 text-xs text-green-500 hover:bg-green-950"
          >
            Swap
          </button>
        )}
      </div>
      <div className="border border-zinc-800 rounded-lg p-3 mt-3">
        <div>
          {formatUnits(token0.amount, token0Decimals)}{" "}
          <span className={direction ? "text-red-500" : "text-green-500"}>
            {token0Name}
          </span>
        </div>
        <div>
          {formatUnits(token1.amount, token1Decimals)}{" "}
          <span className={direction ? "text-green-500" : "text-red-500"}>
            {token1Name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExchangeCard;
