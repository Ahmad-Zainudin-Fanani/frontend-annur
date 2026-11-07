import React from "react";

export default function DataTable({
  columns = [],
  data = [],
  keyExtractor,
  loading = false,
  emptyState,
  footer = null,
  className = "",
}) {
  return (
    <div className={`admin-panel overflow-hidden ${className}`}>
      <div className="overflow-x-auto p-1.5 sm:p-2.5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-divider bg-surface-muted/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                                    className={`px-4 py-3.5 text-left text-[10px] font-semibold text-ink-soft uppercase tracking-[0.08em] whitespace-nowrap first:rounded-tl-xl last:rounded-tr-xl ${col.headerClassName ?? ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-surface-muted rounded w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-0">
                  {emptyState}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={keyExtractor ? keyExtractor(row) : idx}
                  className="table-row-hover hover:bg-canvas-secondary/50"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-ink ${col.className ?? ""}`}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {footer}
    </div>
  );
}
