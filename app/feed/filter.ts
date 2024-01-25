import { LatestPair, TopToken } from "./page";

export const filterLatestPairs = (item: LatestPair, filter: string) => {
  const flt = filter.toLowerCase();

  if (item.token0.name.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.token0.symbol.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.token0.address.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.token1.address.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.token1.address.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.token1.address.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.address.toLowerCase().includes(flt)) {
    return true;
  }

  return false;
};

export const filterTopTokens = (item: TopToken, filter: string) => {
  const flt = filter.toLowerCase();

  if (item.address.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.name.toLowerCase().includes(flt)) {
    return true;
  }

  if (item.symbol.toLowerCase().includes(flt)) {
    return true;
  }

  return false;
};
