import React from "react";

export default function Select({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  placeholder = "Pilih...",
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors appearance-none
          bg-white text-ink
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
          disabled:bg-surface-muted disabled:cursor-not-allowed
          ${error ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-divider"}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-ink-soft">
          {hint}
        </p>
      )}
    </div>
  );
}
