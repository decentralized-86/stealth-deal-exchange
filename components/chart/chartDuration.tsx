import React, { useCallback } from "react";
import OptionButton from "@/components/optionButton";
import clsx from "clsx";

const filters: [string, number][] = [
  ["1 Day", 1],
  ["1 Week", 7],
  ["1 Month", 30],
  ["1 Year", 365],
];

interface ChartDurationProps {
  className?: string;
  onValueChanged?: (value: number) => void;
}

const ChartDuration: React.FC<ChartDurationProps> = ({
  onValueChanged,
  className,
}) => {
  const [value, setValue] = React.useState(1);

  const handleOptionClick = useCallback(
    (val: number) => () => {
      setValue(val);
      onValueChanged?.(val);
    },
    [onValueChanged],
  );

  return (
    <div className={clsx(className, "flex gap-4 h-10")}>
      {filters.map(([label, val], key) => (
        <OptionButton
          key={key}
          selected={value === val}
          onClick={handleOptionClick(val)}
        >
          {label}
        </OptionButton>
      ))}
    </div>
  );
};

export default ChartDuration;
