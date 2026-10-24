import React from "react";

export default function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  icon,
  onClear,
  id,
  name,
  ...props
}) {
  return (
    <div className="relative flex items-center w-full">
      {icon && (
        <span className="absolute left-4 text-[#7a7a7a] pointer-events-none">
          {icon}
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[44px] bg-white text-[#1d1d1f] placeholder-[#7a7a7a] text-[17px] leading-[1.47] tracking-[-0.374px] rounded-full border border-[#e0e0e0] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all ${
          icon ? "pl-11 pr-10" : "px-5"
        } ${className}`.trim()}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus pencarian"
          className="absolute right-3.5 p-1 text-[#7a7a7a] hover:text-[#1d1d1f] rounded-full apple-press-action cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
