import React from "react";
import clsx from "clsx";

type OptionButtonProps = JSX.IntrinsicElements["button"] & {
  selected?: boolean;
};

const OptionButton = React.forwardRef<HTMLButtonElement, OptionButtonProps>(
  ({ className, selected, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        className,
        " border-zinc-800 border rounded-full px-4",
        selected
          ? "bg-cyan-400 text-zinc-900 hover:bg-cyan-300"
          : "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
      )}
      {...props}
    />
  ),
);

OptionButton.displayName = "OptionButton";

export default OptionButton;
