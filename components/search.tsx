import React from "react";
import clsx from "clsx";
import { FiSearch } from "react-icons/fi";

const Search = React.forwardRef<
  HTMLInputElement,
  JSX.IntrinsicElements["input"]
>(({ className, ...props }, ref) => (
  <div className="relative h-fit leading-none">
    <div className="w-10 h-full absolute flex pointer-events-none">
      <FiSearch className="m-auto w-4 h-4 text-zinc-300" />
    </div>
    <input
      ref={ref}
      placeholder="Search"
      className={clsx(
        className,
        "bg-zinc-900 pl-10 py-2 pr-2 text-zinc-400 rounded-full",
      )}
      {...props}
    />
  </div>
));

Search.displayName = "Search";

export default Search;
