"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Badge from "@/components/admin/atoms/Badge";
import { EmptyState, ErrorState, SkeletonCard, SkeletonTableRow } from "@/components/admin/atoms/States";
import { useAuth } from "@/context/admin/AuthContext";
import { apiFetch } from "@/lib/admin/api";

const numberFormat = new Intl.NumberFormat("id-ID");
const focusRing = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#176575]";
const panel = "rounded-3xl border border-slate-200/70 bg-white";
const contentCards = [
  { key: "teachers", label: "Guru", description: "Profil tenaga pendidik", href: "/admin/guru", icon: "people", color: "bg-[#e9f3f3] text-[#176575]" },
  { key: "achievements", label: "Prestasi", description: "Pencapaian sekolah", href: "/admin/prestasi", icon: "award", color: "bg-[#fdf3e4] text-[#95601e]" },
  { key: "competitions", label: "Lomba", description: "Informasi kompetisi", href: "/admin/lomba", icon: "calendar", color: "bg-[#edf0fb] text-[#5662a5]" },
  { key: "galleries", label: "Galeri", description: "Dokumentasi kegiatan", href: "/admin/galeri", icon: "image", color: "bg-[#f8edf2] text-[#a55377]" },
];
const crmStatuses = [
  { key: "new", label: "Baru", color: "bg-[#5c91ba]" },
  { key: "contacted", label: "Dihubungi", color: "bg-[#176575]" },
  { key: "in_progress", label: "Diproses", color: "bg-[#bc8737]" },
  { key: "resolved", label: "Selesai", color: "bg-[#489482]" },
  { key: "closed", label: "Ditutup", color: "bg-[#8998ad]" },
];
const shortcuts = [
  { label: "Slide beranda", description: "Perbarui sorotan utama website", href: "/admin/hero-slides", icon: "image" },
  { label: "Kurikulum", description: "Kelola pilar pembelajaran", href: "/admin/kurikulum", icon: "book" },
  { label: "Galeri sekolah", description: "Bagikan cerita lewat kegiatan", href: "/admin/galeri", icon: "school" },
];

function countValue(value) {
  if (typeof value !== "number" && (typeof value !== "string" || value.trim() === "")) return null;
  const count = Number(value);
  return Number.isSafeInteger(count) && count >= 0 ? count : null;
}

function formatCount(value) {
  const count = countValue(value);
  return count === null ? "—" : numberFormat.format(count);
}

function Icon({ name, className = "h-5 w-5" }) {
  const paths = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    external: "M14 4h6v6m0-6L10 14M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5",
    people: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    award: "M8 3h8v5a4 4 0 0 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 1v6m-4 3h8m-6-3h4v3",
    calendar: "M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm3 10h2m4 0h2m-8 4h2",
    image: "M4 16l5-5 7 7m-2-4 3-3 3 3M8 7h.01M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z",
    book: "M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2V3Z",
    school: "m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7M10 9h4",
  };
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
      <path strokeLinecap="round" strokeLinejoin="round" d={paths[name]} />
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
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
  const statusCounts = crmStatuses.map((status) => ({ ...status, count: countValue(crm[status.key]) }));
  const largestStatusCount = Math.max(0, ...statusCounts.map(({ count }) => count ?? 0));
  const hasStatusCounts = statusCounts.some(({ count }) => count !== null);

  return (
    <div className="space-y-7 text-[#172b4d]">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#176575]">Ruang kerja An-Nur</p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Selamat datang{user?.name ? `, ${user.name}` : " kembali"} <span aria-hidden="true">☀</span></h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Mari rawat cerita sekolah dan jalin komunikasi yang lebih baik.</p>
        </div>
        <Link href="/" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white px-5 text-sm font-medium text-[#172b4d] transition-colors hover:bg-slate-50 ${focusRing}`}>
          Lihat website <Icon name="external" className="h-4 w-4" />
        </Link>
      </header>

      <section aria-labelledby="school-cms-heading" className="relative isolate overflow-hidden rounded-3xl bg-[#176575] p-6 text-white sm:p-8 lg:p-9">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full border-[48px] border-white/5" />
        <div className="flex items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-teal-100">Konten yang bermakna</p>
            <h2 id="school-cms-heading" className="max-w-md text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">Cerita baik An-Nur,<br />dimulai dari sini.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-teal-50/90">Perbarui profil sekolah, tampilkan prestasi, dan bagikan momen belajar kepada orang tua.</p>
            <Link href="/admin/profil" className={`mt-6 inline-flex min-h-11 items-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#176575] transition-colors hover:bg-teal-50 ${focusRing} focus-visible:outline-white`}>
              Kelola profil sekolah <Icon name="arrow" className="h-4 w-4" />
            </Link>
          </div>
          <svg aria-hidden="true" viewBox="0 0 280 220" fill="none" className="hidden w-64 shrink-0 text-white md:block lg:w-72">
            <circle cx="145" cy="108" r="92" fill="currentColor" opacity=".06" />
            <path d="M35 193h210M60 193V98l80-52 80 52v95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".6" />
            <path d="m46 103 94-64 94 64M116 193v-46h48v46M140 39V19m0 0h34l-7 10 7 10h-34" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            <path d="M81 119h17v19H81zm101 0h17v19h-17zM81 154h17v19H81zm101 0h17v19h-17z" fill="currentColor" opacity=".25" />
            <circle cx="140" cy="100" r="17" stroke="currentColor" strokeWidth="2" />
            <path d="M140 90v11l7 4M34 193v-36m0 17-10-9m10 1 10-10m202 37v-36m0 17-10-9m10 1 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </section>

      {error ? (
        <div role="alert" className={panel}><ErrorState message={error} onRetry={load} /></div>
      ) : (
        <div className="space-y-7" aria-busy={loading}>
          <p className="sr-only" role="status">{loading ? "Memuat ringkasan dashboard…" : "Ringkasan dashboard selesai dimuat."}</p>
          <section aria-labelledby="content-stats-heading">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="content-stats-heading" className="text-lg font-semibold tracking-tight">Konten sekolah</h2>
              <p className="text-xs text-slate-500">Ringkasan data CMS</p>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2 xl:grid-cols-4">
              {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="rounded-3xl" />) : contentCards.map((card) => (
                <Link key={card.key} href={card.href} className={`group ${panel} p-5 transition-colors hover:border-[#176575]/40 ${focusRing}`}>
                  <div className="flex items-center justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.color}`}><Icon name={card.icon} /></span>
                    <Icon name="arrow" className="h-4 w-4 text-slate-400 transition-colors group-hover:text-[#176575]" />
                  </div>
                  <p className="mt-5 text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{formatCount(content[card.key])}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{card.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <section aria-labelledby="crm-stats-heading" className={`${panel} p-6 sm:p-7`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="crm-stats-heading" className="text-lg font-semibold tracking-tight">Ikhtisar komunikasi</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Setiap pesan adalah awal sebuah hubungan.</p>
                </div>
                <Link href="/admin/crm" className={`inline-flex min-h-9 items-center gap-2 rounded-lg text-xs font-semibold text-[#176575] hover:underline ${focusRing}`}>Buka CRM <Icon name="arrow" className="h-4 w-4" /></Link>
              </div>
              {loading ? <div className="mt-6"><SkeletonCard className="border-0" /></div> : (
                <>
                  <div className="my-6 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-slate-100 pb-6">
                    <span className="text-4xl font-semibold tracking-tight tabular-nums">{formatCount(crm.total)}</span>
                    <span className="text-sm text-slate-500">total kontak masuk</span>
                  </div>
                  <figure>
                    <figcaption className="mb-4 text-xs leading-5 text-slate-500">Perbandingan jumlah per status, bukan tren waktu. Panjang batang relatif terhadap status terbanyak.</figcaption>
                    <dl className="space-y-4">
                      {statusCounts.map(({ key, label, color, count }) => (
                        <div key={key} className="grid grid-cols-[6rem_minmax(0,1fr)_3rem] items-center gap-3 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_4rem]">
                          <dt className="flex items-center gap-2 text-slate-600"><span aria-hidden="true" className={`h-2 w-2 shrink-0 rounded-full ${color}`} />{label}</dt>
                          <dd aria-hidden="true" className="h-2 overflow-hidden rounded-full bg-slate-100">
                            {count !== null && largestStatusCount > 0 && <div className={`h-full rounded-full ${color}`} style={{ width: `${(count / largestStatusCount) * 100}%` }} />}
                          </dd>
                          <dd className="text-right font-semibold tabular-nums">{count === null ? <span aria-label="Data tidak tersedia">—</span> : numberFormat.format(count)}</dd>
                        </div>
                      ))}
                    </dl>
                    <p className="mt-5 text-xs leading-5 text-slate-500">{!hasStatusCounts ? "Rincian status belum tersedia dari server." : largestStatusCount === 0 ? "Belum ada kontak pada status yang tersedia." : "Jumlah berdasarkan ringkasan CRM saat dimuat."} Tanda — berarti data belum tersedia.</p>
                  </figure>
                </>
              )}
            </section>

            <section aria-labelledby="shortcuts-heading" className={`${panel} p-6 sm:p-7`}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#176575]">Langkah berikutnya</p>
              <h2 id="shortcuts-heading" className="text-lg font-semibold tracking-tight">Akses cepat</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">Hal-hal kecil yang membuat website sekolah tetap relevan.</p>
              <nav aria-label="Pintasan pengelolaan konten" className="mt-5 divide-y divide-slate-100">
                {shortcuts.map((shortcut) => (
                  <Link key={shortcut.href} href={shortcut.href} className={`group flex min-h-20 items-center gap-3 rounded-lg py-4 ${focusRing}`}>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f0f5f7] text-[#176575]"><Icon name={shortcut.icon} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-sm font-semibold group-hover:text-[#176575]">{shortcut.label}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{shortcut.description}</span></span>
                    <Icon name="arrow" className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#176575]" />
                  </Link>
                ))}
              </nav>
            </section>
          </div>

          <section aria-labelledby="recent-inquiries-heading" className={`${panel} overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-3 p-6 sm:p-7">
              <div><h2 id="recent-inquiries-heading" className="text-lg font-semibold tracking-tight">Kontak terbaru</h2><p className="mt-1 text-xs leading-5 text-slate-500">Pesan masuk terbaru untuk ditinjau dan ditindaklanjuti.</p></div>
              <Link href="/admin/crm" className={`inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-xs font-semibold text-[#176575] hover:bg-slate-50 ${focusRing}`}>Lihat semua kontak <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
            {!loading && inquiries.length === 0 ? <EmptyState title="Belum ada kontak masuk" description="Pesan dari formulir kontak website akan tampil di sini." /> : (
              <div className={`overflow-x-auto ${focusRing}`} tabIndex={0} role="region" aria-label="Tabel kontak terbaru, gulir horizontal pada layar kecil">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <caption className="sr-only">Kontak terbaru beserta email, status, prioritas, dan tautan detail</caption>
                  <thead className="border-y border-slate-100 bg-[#f7f9fb] text-xs text-slate-500">
                    <tr>{["Nama kontak", "Email", "Status", "Prioritas", "Detail"].map((label) => <th key={label} scope="col" className="px-6 py-4 font-medium">{label}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? Array.from({ length: 4 }).map((_, i) => <SkeletonTableRow key={i} cols={5} />) : inquiries.map((inq) => (
                      <tr key={inq.id} className="transition-colors hover:bg-slate-50/70">
                        <th scope="row" className="px-6 py-5 font-medium">
                          <div className="flex items-center gap-3"><span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eaf2f4] text-xs font-semibold text-[#176575]">{inq.name?.trim().slice(0, 1).toUpperCase() || "?"}</span><span className="max-w-48 break-words">{inq.name || "Tanpa nama"}</span></div>
                        </th>
                        <td className="max-w-64 break-words px-6 py-5 text-slate-500">{inq.email || "—"}</td>
                        <td className="whitespace-nowrap px-6 py-5"><Badge status={inq.crm_status} label={inq.crm_status ? undefined : "—"} /></td>
                        <td className="whitespace-nowrap px-6 py-5"><Badge status={inq.priority} label={inq.priority ? undefined : "—"} /></td>
                        <td className="px-6 py-5"><Link href={`/admin/crm/${inq.id}`} aria-label={`Lihat detail kontak ${inq.name || "tanpa nama"}`} className={`inline-flex min-h-10 items-center gap-2 rounded-lg text-xs font-semibold text-[#176575] hover:underline ${focusRing}`}>Detail <Icon name="arrow" className="h-4 w-4" /></Link></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
