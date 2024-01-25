import React from "react";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

interface SpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Spinner: React.FC<SpinnerProps> = ({ className, size = "md" }) => (
  <CgSpinner
    className={clsx(
      className,
      "animate-spin text-zinc-700",
      size === "xs" ? "w-4 h-4" : size === "sm" ? "w-6 h-6" : "w-8 h-8",
    )}
  />
);

export default Spinner;
