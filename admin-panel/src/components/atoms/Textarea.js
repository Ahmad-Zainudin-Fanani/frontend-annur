import React from "react";

export default function Textarea({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  hint,
  rows = 4,
  required = false,
  disabled = false,
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
      <textarea
        id={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm transition-colors resize-y
          bg-white text-ink placeholder:text-ink-faint
          focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
          disabled:bg-surface-muted disabled:cursor-not-allowed
          ${error ? "border-danger focus:ring-danger/30 focus:border-danger" : "border-divider"}`}
        {...props}
      />
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
