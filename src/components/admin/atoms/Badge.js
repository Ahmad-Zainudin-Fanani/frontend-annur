import React from "react";

const statusStyles = {
  published: "bg-success-light text-success",
  draft: "bg-surface-muted text-ink-muted",
  new: "bg-info-light text-info",
  contacted: "bg-primary-light text-primary",
  in_progress: "bg-warning-light text-warning",
  resolved: "bg-success-light text-success",
  closed: "bg-surface-muted text-ink-muted",
  low: "bg-surface-muted text-ink-muted",
  normal: "bg-info-light text-info",
  high: "bg-warning-light text-warning",
  urgent: "bg-danger-light text-danger",
  active: "bg-success-light text-success",
  inactive: "bg-surface-muted text-ink-muted",
};

const statusLabels = {
  published: "Terbit",
  draft: "Draf",
  new: "Baru",
  contacted: "Dihubungi",
  in_progress: "Diproses",
  resolved: "Selesai",
  closed: "Ditutup",
  low: "Rendah",
  normal: "Normal",
  high: "Tinggi",
  urgent: "Mendesak",
  active: "Aktif",
  inactive: "Nonaktif",
};

export default function Badge({ status, label, className = "" }) {
  const key = status?.toLowerCase().replace(/\s+/g, "_") ?? "";
  const style = statusStyles[key] ?? "bg-surface-muted text-ink-muted";
  const text = label ?? statusLabels[key] ?? status;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}
    >
      {text}
    </span>
  );
}
