import React from "react";
import { CgSpinner } from "react-icons/cg";
import clsx from "clsx";

type ButtonProps = JSX.IntrinsicElements["button"] & {
  loading?: boolean;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, loading, children, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        className,
        " border-zinc-800 border rounded-full px-4 py-1 flex items-center disabled:bg-zinc-700 disabled:text-zinc-500",
        "bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
      )}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="mr-1">
          <CgSpinner className="animate-spin" />
        </div>
      )}
      {children}
    </button>
  ),
);

Button.displayName = "Button";

export default Button;
