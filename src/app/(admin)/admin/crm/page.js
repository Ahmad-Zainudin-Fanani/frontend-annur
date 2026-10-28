"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Pagination from "@/components/admin/molecules/Pagination";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Input from "@/components/admin/atoms/Input";
import { EmptyState, ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";

const STATUS_OPTS = [
  { value: "all", label: "Semua Status" },
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "in_progress", label: "Diproses" },
  { value: "resolved", label: "Selesai" },
  { value: "closed", label: "Ditutup" },
];

const PRIORITY_OPTS = [
  { value: "all", label: "Semua Prioritas" },
  { value: "low", label: "Rendah" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Tinggi" },
  { value: "urgent", label: "Mendesak" },
];

const PER_PAGE = 15;

export default function CRMPage() {
  const [contacts, setContacts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", String(PER_PAGE));
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterPriority !== "all") params.set("priority", filterPriority);
      if (search) params.set("search", search);
      const res = await apiFetch(`/contacts?${params}`);
      setContacts(res.data?.data ?? res.data ?? []);
      setMeta(res.data?.meta ?? res.meta ?? null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterPriority, search]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div>
      <PageHeader
        title="CRM Kontak"
        description="Kelola dan tindak lanjuti pesan dari calon pengguna dan orang tua"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "CRM Kontak" }]}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input id="crm-search" placeholder="Cari nama atau email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="max-w-xs" />
        <Select id="crm-status" value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} options={STATUS_OPTS} placeholder="" className="w-44" />
        <Select id="crm-priority" value={filterPriority} onChange={(e) => { setFilterPriority(e.target.value); setPage(1); }} options={PRIORITY_OPTS} placeholder="" className="w-44" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="bg-white rounded-xl border border-divider overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-canvas-secondary border-b border-divider">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Prioritas</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Tanggal</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="h-4 bg-surface-muted rounded w-full" /></td>
                      ))}
                    </tr>
                  ))
                ) : contacts.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState title="Belum ada kontak" description="Pesan dari pengunjung website akan muncul di sini." />
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-canvas-secondary/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                      <td className="px-4 py-3 text-ink-muted">{c.email}</td>
                      <td className="px-4 py-3"><Badge status={c.crm_status} /></td>
                      <td className="px-4 py-3"><Badge status={c.priority} /></td>
                      <td className="px-4 py-3 text-ink-soft text-xs whitespace-nowrap">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/crm/${c.id}`} className="text-xs text-primary font-medium hover:underline">
                          Detail →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {meta && <Pagination meta={meta} onPageChange={setPage} />}
        </div>
      )}
    </div>
  );
}
