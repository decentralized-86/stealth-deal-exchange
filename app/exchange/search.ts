import * as constants from "@/lib/constants";
import { Swap } from "./page";

export const matchByAddress = (pair: Swap, address: string) => {
  if (address === "all") {
    return true;
  }

  if (pair.sellToken?.toLowerCase() === address.toLowerCase()) {
    return true;
  }

  if (pair.buyToken?.toLowerCase() === address.toLowerCase()) {
    return true;
  }

  return false;
};

export const matchBySearch = (pair: Swap, search: string) => {
  if (pair.sellToken?.toLowerCase().includes(search.toLowerCase())) {
    return true;
  }

  if (pair.sellSymbol?.toLowerCase().includes(search.toLowerCase())) {
    return true;
  }

  if (
    pair.sellToken === constants.zeroAddress &&
    "eth".includes(search.toLowerCase())
  ) {
    return true;
  }

  if (pair.buyToken?.toLowerCase().includes(search.toLowerCase())) {
    return true;
  }

  if (pair.buySymbol?.toLowerCase().includes(search.toLowerCase())) {
    return true;
  }

  if (
    pair.buyToken === constants.zeroAddress &&
    "eth".includes(search.toLowerCase())
  ) {
    return true;
  }

  return false;
};
