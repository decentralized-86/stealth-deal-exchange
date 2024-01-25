export const formatPercent = (value: number) =>
  value > 0 ? `+${value.toFixed(3)}` : value.toFixed(3);

export const formatNumber = (value: number, precision = 2) => {
  if (value < 1000) {
    return value.toFixed(precision);
  } else if (value < 1000000) {
    return (value / 1000).toFixed(precision) + " K";
  } else {
    return (value / 1000000).toFixed(precision) + " M";
  }
};

export const formatWithCommas = (value: number, precision = 2) => {
  const val =
    Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
