import React from "react";
import Link from "next/link";

export default function PageHeader({ title, description, actions, breadcrumb }) {
  return (
    <div className="mb-7 pt-2">
      {breadcrumb && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center gap-1.5 text-xs text-ink-soft">
            {breadcrumb.map((crumb, i) => (
              <li key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                  <svg className="w-3 h-3 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-ink-muted font-medium">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px] sm:leading-tight">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon, color = "primary", change }) {
  const colorMap = {
    primary: "bg-primary-light text-primary",
    success: "bg-success-light text-success",
    warning: "bg-warning-light text-warning",
    danger: "bg-danger-light text-danger",
    info: "bg-info-light text-info",
  };

  return (
    <div className="admin-panel p-5 flex items-start gap-4 animate-fade-in">
      {icon && (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color] ?? colorMap.primary}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-ink-soft font-medium">{label}</p>
        <p className="text-3xl font-semibold tracking-tight text-ink mt-1 tabular-nums">{value ?? "—"}</p>
        {change && <p className="text-xs text-ink-soft mt-0.5">{change}</p>}
      </div>
    </div>
  );
}
