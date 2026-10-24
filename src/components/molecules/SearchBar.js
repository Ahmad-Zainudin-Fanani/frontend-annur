import React from "react";
import Input from "@/components/atoms/Input";
import { SearchIcon } from "@/components/atoms/Icons";

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = "Cari guru, prestasi, atau kurikulum...",
  className = "",
  id = "annur-search-input",
}) {
  return (
    <div className={`w-full max-w-md ${className}`}>
      <Input
        id={id}
        name="q"
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={placeholder}
        icon={<SearchIcon className="w-4 h-4 text-[#7a7a7a]" />}
      />
    </div>
  );
}
