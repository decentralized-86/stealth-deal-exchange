import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface DropdownProps {
  value?: string;
  label: string;
  onChange?: (value: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  value,
  label,
  onChange,
  options,
  className,
}) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger
      className={clsx(
        "w-32 border-zinc-800 border rounded-full px-4 bg-zinc-900 text-zinc-300 hover:bg-zinc-800",
        className,
      )}
    >
      <SelectValue placeholder={label} />
    </SelectTrigger>
    <SelectContent className="bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-t-2xl rounded-b-2xl">
      <SelectGroup>
        {options.map((option, key) => (
          <SelectItem
            value={option.value}
            key={key}
            className="bg-zinc-900 rounded-xl focus:bg-zinc-800 focus:text-zinc-300"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
