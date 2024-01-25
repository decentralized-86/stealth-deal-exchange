import React from "react";
import clsx from "clsx";

const Input = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      className,
      "bg-zinc-900 py-2 px-4 text-zinc-400 rounded-full",
    )}
    {...props}
  />
));

Input.displayName = "Input";

export default Input;
