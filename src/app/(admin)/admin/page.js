"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import PageHeader, { StatCard } from "@/components/admin/molecules/PageHeader";
import Badge from "@/components/admin/atoms/Badge";
import { SkeletonCard } from "@/components/admin/atoms/States";
import { ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/dashboard");
      setData(res.data ?? res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an async request and updates its loading state.
    load();
  }, [load]);

  const crm = data?.crm_stats ?? {};
  const content = data?.content_stats ?? {};
  const inquiries = data?.recent_inquiries ?? [];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Ringkasan konten dan aktivitas CRM An-Nur"
        breadcrumb={[{ label: "Admin" }, { label: "Dashboard" }]}
      />

      {error && <ErrorState message={error} onRetry={load} />}

      {!error && (
        <>
          {/* CRM Stats */}
          <section aria-labelledby="crm-stats-heading">
            <h2 id="crm-stats-heading" className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
              CRM Kontak
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <>
                  <StatCard label="Total Kontak" value={crm.total} color="primary" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  } />
                  <StatCard label="Baru" value={crm.new} color="info" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  } />
                  <StatCard label="Diproses" value={crm.in_progress} color="warning" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  } />
                  <StatCard label="Selesai" value={crm.resolved} color="success" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  } />
                  <StatCard label="Ditutup" value={crm.closed} color="danger" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  } />
                </>
              )}
            </div>
          </section>

          {/* Content Stats */}
          <section aria-labelledby="content-stats-heading">
            <h2 id="content-stats-heading" className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
              Konten
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              ) : (
                <>
                  <StatCard label="Guru" value={content.teachers} color="primary" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  } />
                  <StatCard label="Prestasi" value={content.achievements} color="success" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  } />
                  <StatCard label="Lomba" value={content.competitions} color="warning" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  } />
                  <StatCard label="Galeri" value={content.galleries} color="info" icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  } />
                </>
              )}
            </div>
          </section>

          {/* Recent Inquiries */}
          <section aria-labelledby="recent-inquiries-heading">
            <div className="flex items-center justify-between mb-3">
              <h2 id="recent-inquiries-heading" className="text-sm font-semibold text-ink-muted uppercase tracking-wide">
                Kontak Terbaru
              </h2>
              <Link href="/admin/crm" className="text-xs text-primary hover:underline font-medium">
                Lihat semua →
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-divider overflow-hidden">
              {loading ? (
                <div className="divide-y divide-divider">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-4 animate-pulse flex gap-4">
                      <div className="skeleton h-4 w-32 rounded" />
                      <div className="skeleton h-4 w-20 rounded" />
                      <div className="skeleton h-4 w-16 rounded" />
                    </div>
                  ))}
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-10 text-sm text-ink-soft">Belum ada kontak masuk.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-canvas-secondary border-b border-divider">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Nama</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Prioritas</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-ink-muted uppercase tracking-wide">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-canvas-secondary/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-ink">{inq.name}</td>
                          <td className="px-4 py-3 text-ink-muted">{inq.email}</td>
                          <td className="px-4 py-3">
                            <Badge status={inq.crm_status} />
                          </td>
                          <td className="px-4 py-3">
                            <Badge status={inq.priority} />
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/admin/crm/${inq.id}`} className="text-xs text-primary hover:underline font-medium">
                              Detail
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
