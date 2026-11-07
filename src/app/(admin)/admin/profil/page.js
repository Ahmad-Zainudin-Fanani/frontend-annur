"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Input from "@/components/admin/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import Select from "@/components/admin/atoms/Select";
import FileUpload from "@/components/admin/atoms/FileUpload";
import { ErrorState, SkeletonCard } from "@/components/admin/atoms/States";
import Modal, { ConfirmDialog } from "@/components/admin/organisms/Modal";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

const EMPTY_FORM = {
  name: "", tagline: "", description: "", accreditation: "", npsn: "",
  vision_title: "", vision: [], mission_title: "", missions: [],
  address: "", phone: "", whatsapp: "", email: "", maps_embed_url: "",
  facebook_url: "", instagram_url: "", youtube_url: "",
  principal_name: "", principal_title: "", principal_message: "",
  principal_education: "", principal_experience: "", principal_bio: "", principal_photo: "",
  public_sections: "",
};

const SECTIONS = [
  { id: "identity", title: "Identitas Sekolah", description: "Nama, deskripsi, dan identitas resmi sekolah.", fields: ["name", "tagline", "description", "accreditation", "npsn"], icon: "M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01" },
  { id: "vision-mission", title: "Visi & Misi", description: "Arah, cita-cita, dan langkah nyata pengembangan sekolah.", fields: ["vision_title", "vision", "mission_title", "missions"], icon: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
  { id: "contact", title: "Informasi Kontak", description: "Kanal komunikasi utama sekolah.", fields: ["phone", "whatsapp", "email"], icon: "M4 4h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4C10 22 2 14 4 4Z" },
  { id: "location", title: "Alamat & Lokasi", description: "Alamat sekolah dan peta untuk pengunjung.", fields: ["address", "maps_embed_url"], icon: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" },
  { id: "social", title: "Media Sosial", description: "Tautan akun resmi dan publikasi sekolah.", fields: ["facebook_url", "instagram_url", "youtube_url"], icon: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z" },
  { id: "principal", title: "Kepala Sekolah", description: "Profil, foto, dan sambutan kepala sekolah.", fields: ["principal_name", "principal_title", "principal_message", "principal_education", "principal_experience", "principal_bio", "principal_photo"], icon: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2" },
];

function normalizeForm(data = {}) {
  const next = Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, data[key] ?? EMPTY_FORM[key]]));
  next.vision = Array.isArray(data.vision) ? data.vision : data.vision ? [data.vision] : [];
  next.missions = Array.isArray(data.missions) ? data.missions : data.missions ? [data.missions] : [];
  next.public_sections = JSON.stringify(data.public_sections ?? {}, null, 2);
  return next;
}

function fieldHasContent(field, data) {
  if (field === "public_sections") {
    try { return Object.keys(JSON.parse(data[field] || "{}") ?? {}).length > 0; } catch { return false; }
  }
  return Array.isArray(data[field]) ? data[field].some((value) => value.trim()) : Boolean(String(data[field] ?? "").trim());
}

function ProfileIcon({ path, className = "h-5 w-5" }) {
  return <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>;
}

function ArrayField({ label, name, values, onChange, errors, onRemove }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-ink">Poin {label}</h3><p className="mt-1 text-xs text-ink-soft">Urutan di bawah mengikuti urutan tampil di website.</p></div><Button variant="secondary" size="sm" onClick={() => onChange([...values, ""])}>+ Tambah Poin</Button></div>
      {errors[name]?.[0] && <p role="alert" className="text-sm text-danger">{errors[name][0]}</p>}
      {values.length === 0 ? <div className="rounded-xl border border-dashed border-divider bg-surface-muted px-6 py-10 text-center"><p className="text-sm font-medium text-ink">Belum ada poin {label.toLowerCase()}</p><p className="mt-1 text-sm text-ink-soft">Gunakan Tambah Poin untuk mulai menulis.</p></div> : values.map((value, index) => (
        <div key={index} className="rounded-xl border border-divider bg-surface-muted/50 p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Poin {String(index + 1).padStart(2, "0")}</span><Button variant="danger-ghost" size="xs" onClick={() => onRemove(name, index)} aria-label={`Hapus poin ${label.toLowerCase()} ${index + 1}`}>Hapus</Button></div>
          <Textarea id={`${name}-${index}`} label={`Isi ${label.toLowerCase()} ${index + 1}`} value={value} onChange={(event) => onChange(values.map((item, itemIndex) => itemIndex === index ? event.target.value : item))} error={errors[`${name}.${index}`]?.[0]} rows={4} placeholder={`Tuliskan poin ${label.toLowerCase()} secara jelas…`} />
        </div>
      ))}
    </div>
  );
}

export default function ProfilPage() {
  const toast = useToast();
  const [profile, setProfile] = useState(EMPTY_FORM);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [saveError, setSaveError] = useState(null);
  const [principalOptions, setPrincipalOptions] = useState([]);
  const [teachersError, setTeachersError] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const dialogRootRef = useRef(null);
  const confirmationTriggerRef = useRef(null);
  const section = SECTIONS.find((item) => item.id === activeSection);
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);
  const hasConfirmation = Boolean(confirmation);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setTeachersError(null);
    try {
      const [profileResult, teachersResult] = await Promise.allSettled([
        apiFetch("/profile"), apiFetch("/teachers?per_page=100"),
      ]);
      if (profileResult.status === "rejected") throw profileResult.reason;
      const data = normalizeForm(profileResult.value.data ?? {});
      setProfile(data);
      setForm(data);
      if (teachersResult.status === "fulfilled") {
        setPrincipalOptions((teachersResult.value.data ?? []).map((teacher) => ({ value: teacher.name, label: teacher.name })));
      } else {
        setTeachersError(teachersResult.reason.message);
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Loads the saved profile and teacher options from the API.
    load();
  }, [load]);

  useEffect(() => {
    if (!activeSection) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRootRef.current?.querySelector('[role="dialog"]');
    const frame = requestAnimationFrame(() => {
      const firstField = dialog?.querySelector('input:not([disabled]), textarea:not([disabled]), select:not([disabled])');
      (firstField || dialog?.querySelector("button:not([disabled])"))?.focus();
    });
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [activeSection]);

  useEffect(() => {
    if (!hasConfirmation) return;
    const trigger = confirmationTriggerRef.current;
    const root = dialogRootRef.current;
    root?.querySelector('[role="alertdialog"] button')?.focus();
    return () => {
      if (trigger?.isConnected) trigger.focus();
      else root?.querySelector('[role="dialog"] input, [role="dialog"] textarea')?.focus();
    };
  }, [hasConfirmation]);

  useEffect(() => {
    if (!saving && !uploading) return;
    const dialog = dialogRootRef.current?.querySelector('[role="dialog"]');
    dialog?.setAttribute("tabindex", "-1");
    dialog?.focus();
  }, [saving, uploading]);

  const requestConfirmation = (action) => {
    confirmationTriggerRef.current = document.activeElement;
    setConfirmation(action);
  };

  const openEditor = (id) => {
    setForm({ ...profile, vision: [...profile.vision], missions: [...profile.missions] });
    setFormErrors({});
    setSaveError(null);
    setActiveSection(id);
  };

  const closeEditor = () => {
    if (saving || uploading) return;
    if (dirty) requestConfirmation({ type: "discard" });
    else setActiveSection(null);
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => key !== field && !key.startsWith(`${field}.`))));
    setSaveError(null);
  };

  const handleConfirm = () => {
    if (confirmation.type === "discard") {
      setForm(profile);
      setActiveSection(null);
      setFormErrors({});
      setSaveError(null);
    } else if (confirmation.type === "photo") {
      handleChange("principal_photo", "");
    } else {
      handleChange(confirmation.field, form[confirmation.field].filter((_, index) => index !== confirmation.index));
    }
    setConfirmation(null);
  };

  const handleDialogKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      if (saving || uploading) return;
      if (confirmation) setConfirmation(null);
      else closeEditor();
    }
    if (event.key === "Tab") {
      const dialog = dialogRootRef.current?.querySelector(confirmation ? '[role="alertdialog"]' : '[role="dialog"]');
      const elements = [...(dialog?.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]') ?? [])].filter((element) => element.getClientRects().length > 0);
      if (elements.length === 0) { event.preventDefault(); return; }
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first?.focus(); }
    }
  };

  const parsePublicSections = () => {
    try {
      return form.public_sections.trim() ? JSON.parse(form.public_sections) : {};
    } catch {
      setFormErrors((current) => ({ ...current, public_sections: ["JSON tidak valid. Periksa tanda kutip, koma, dan kurung sebelum menyimpan."] }));
      setSaveError("Konfigurasi belum dapat disimpan karena format JSON tidak valid.");
      return undefined;
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (saving || uploading) return;
    setFormErrors({});
    setSaveError(null);
    const publicSections = parsePublicSections();
    if (publicSections === undefined) return;
    const submittedIndexes = Object.fromEntries(["vision", "missions"].map((field) => [
      field, form[field].map((value, index) => value.trim() ? index : null).filter((index) => index !== null),
    ]));
    const payload = {
      ...form,
      vision: form.vision.filter((value) => value.trim() !== ""),
      missions: form.missions.filter((value) => value.trim() !== ""),
      public_sections: publicSections,
    };
    setSaving(true);
    try {
      const response = await apiFetch("/profile", { method: "PUT", body: payload });
      const saved = normalizeForm({ ...payload, ...response?.data });
      setProfile(saved);
      setForm(saved);
      setActiveSection(null);
      toast({ message: `${section.title} berhasil diperbarui.`, type: "success" });
    } catch (requestError) {
      // The API receives compacted lists, so map validation indexes back to the visible draft rows.
      const errors = Object.fromEntries(Object.entries(requestError.errors || {}).map(([key, messages]) => {
        const match = key.match(/^(vision|missions)\.(\d+)(.*)$/);
        if (!match) return [key, messages];
        const draftIndex = submittedIndexes[match[1]][Number(match[2])] ?? Number(match[2]);
        return [`${match[1]}.${draftIndex}${match[3]}`, messages];
      }));
      setFormErrors(errors);
      setSaveError(requestError.message || "Perubahan gagal disimpan. Silakan coba lagi.");
      const invalidSection = SECTIONS.find((item) => item.fields.some((field) => Object.keys(errors).some((key) => key === field || key.startsWith(`${field}.`))));
      if (invalidSection) setActiveSection(invalidSection.id);
    } finally {
      setSaving(false);
    }
  };

  const fieldProps = (field) => ({
    id: `profile-${field}`,
    value: form[field],
    onChange: (event) => handleChange(field, event.target.value),
    error: formErrors[field]?.[0],
  });
  const sectionProgress = SECTIONS.map((item) => ({
    ...item,
    filled: item.fields.filter((field) => fieldHasContent(field, profile)).length,
  }));
  const totalFields = sectionProgress.reduce((total, item) => total + item.fields.length, 0);
  const filledFields = sectionProgress.reduce((total, item) => total + item.filled, 0);
  const completion = Math.round((filledFields / totalFields) * 100);
  const completeSections = sectionProgress.filter((item) => item.filled === item.fields.length).length;
  const nextSection = sectionProgress.find((item) => item.filled < item.fields.length);
  const teacherOptions = [
    { value: "", label: "Belum dipilih" },
    ...(form.principal_name && !principalOptions.some((option) => option.value === form.principal_name) ? [{ value: form.principal_name, label: form.principal_name }] : []),
    ...principalOptions,
  ];
  const nestedPublicErrors = Object.entries(formErrors).filter(([field]) => field.startsWith("public_sections."));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <PageHeader title="Profil Sekolah" description="Satu ruang untuk merawat cerita dan identitas sekolah." breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Profil Sekolah" }]} />
        <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-divider bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:self-auto">Lihat website <span className="sr-only">(tab baru)</span><ProfileIcon path="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5" className="h-4 w-4" /></Link>
      </div>

      {error ? <ErrorState message={error} onRetry={load} /> : loading ? (
        <div role="status" aria-label="Memuat profil sekolah" className="space-y-6"><span className="sr-only">Memuat profil sekolah…</span><div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"><SkeletonCard className="min-h-80" /><SkeletonCard className="min-h-80" /></div><SkeletonCard className="min-h-96" /></div>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="school-identity" className="relative isolate flex min-w-0 flex-col overflow-hidden rounded-3xl border border-divider bg-white">
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full border-[48px] border-primary/5" />
              <div className="flex-1 p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-light text-primary"><ProfileIcon path={SECTIONS[0].icon} /></span><p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Identitas sekolah</p></div>
                <h2 id="school-identity" className="max-w-2xl break-words text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">{profile.name || "Cerita sekolah dimulai di sini."}</h2>
                <p className="mt-3 break-words text-base font-medium text-primary">{profile.tagline || "Tambahkan tagline yang mencerminkan semangat sekolah."}</p>
                <p className="mt-4 line-clamp-3 max-w-2xl whitespace-pre-line break-words text-sm leading-7 text-ink-soft">{profile.description || "Perkenalkan karakter, nilai, dan perjalanan sekolah. Identitas yang lengkap membantu orang tua mengenal sekolah lebih dekat."}</p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-5 border-t border-divider bg-surface-muted/30 px-6 py-5 sm:px-8">
                <dl className="flex flex-wrap gap-x-8 gap-y-4"><div><dt className="text-[10px] font-medium uppercase tracking-widest text-ink-soft">Akreditasi</dt><dd className="mt-1 max-w-48 break-words text-sm font-semibold text-ink">{profile.accreditation || "Belum diisi"}</dd></div><div className="border-l border-divider pl-8"><dt className="text-[10px] font-medium uppercase tracking-widest text-ink-soft">NPSN</dt><dd className="mt-1 max-w-48 break-words text-sm font-semibold text-ink">{profile.npsn || "Belum diisi"}</dd></div></dl>
                <Button variant="secondary" size="sm" onClick={() => openEditor("identity")} className="rounded-xl">Edit identitas<ProfileIcon path="m16 4 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15l-1 6Z" className="h-4 w-4" /></Button>
              </div>
            </section>

            <section aria-labelledby="completion-title" className="flex flex-col rounded-3xl border border-divider bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3"><h2 id="completion-title" className="text-sm font-semibold text-ink">Kelengkapan profil</h2><ProfileIcon path="M9 12l2 2 4-4M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" className="h-5 w-5 text-primary" /></div>
              <div className="relative mx-auto my-6 flex h-36 w-36 items-center justify-center" role="progressbar" aria-label="Kolom profil terisi" aria-valuemin={0} aria-valuemax={totalFields} aria-valuenow={filledFields} aria-valuetext={`${filledFields} dari ${totalFields} kolom terisi, ${completion} persen`}>
                <svg aria-hidden="true" className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 120 120" fill="none"><circle cx="60" cy="60" r="52" className="stroke-surface-muted" strokeWidth="7" /><circle cx="60" cy="60" r="52" className="stroke-primary" strokeWidth="7" strokeLinecap="round" pathLength="100" strokeDasharray={`${completion} 100`} /></svg>
                <div aria-hidden="true" className="text-center"><p className="text-3xl font-semibold tracking-tight text-ink">{completion}<span className="text-lg text-ink-soft">%</span></p><p className="mt-1 text-[11px] text-ink-soft">kolom terisi</p></div>
              </div>
              <p className="text-center text-sm font-medium text-ink">{filledFields} dari {totalFields} kolom terisi</p>
              <p className="mt-2 text-center text-xs leading-relaxed text-ink-soft">Berdasarkan data tersimpan, termasuk kolom opsional. Bukan status publikasi.</p>
              <div className="mt-5 flex items-center justify-between border-t border-divider pt-4 text-xs"><span className="text-ink-soft">Bagian terisi penuh</span><span className="font-semibold tabular-nums text-primary">{completeSections} / {SECTIONS.length}</span></div>
            </section>
          </div>

          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <section aria-labelledby="workspace-title" className="min-w-0 overflow-hidden rounded-3xl border border-divider bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-6 py-6 sm:px-8"><div><p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">Ruang kerja konten</p><h2 id="workspace-title" className="text-lg font-semibold tracking-tight text-ink">Kelola setiap bagian</h2><p className="mt-1 text-xs leading-relaxed text-ink-soft">Pilih bagian untuk meninjau dan memperbarui informasi.</p></div><span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-ink-muted">{SECTIONS.length} bagian</span></div>
              <ul className="divide-y divide-divider">
                {sectionProgress.map((item, index) => {
                  const complete = item.filled === item.fields.length;
                  const status = complete ? "Terisi penuh" : item.filled ? "Sebagian terisi" : "Belum diisi";
                  return (
                    <li key={item.id}>
                      <button type="button" onClick={() => openEditor(item.id)} aria-label={`Edit ${item.title}, ${status.toLowerCase()}, ${item.filled} dari ${item.fields.length} kolom terisi`} className="group flex w-full cursor-pointer items-center gap-3 px-5 py-5 text-left transition-colors hover:bg-primary/5 focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-4 sm:px-8">
                        <span aria-hidden="true" className="hidden w-4 shrink-0 text-[10px] font-medium tabular-nums text-ink-faint sm:block">{String(index + 1).padStart(2, "0")}</span>
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${complete ? "bg-primary-light text-primary" : "bg-surface-muted text-ink-soft"}`}><ProfileIcon path={item.icon} /></span>
                        <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink group-hover:text-primary">{item.title}</span><span className="mt-1 hidden text-xs leading-relaxed text-ink-soft sm:block">{item.description}</span><span className="mt-1 block text-xs text-ink-soft sm:hidden">{item.filled}/{item.fields.length} kolom · {status}</span></span>
                        <span className="hidden w-28 shrink-0 space-y-2 sm:block"><span className="flex items-center justify-between gap-2 text-[11px]"><span className={complete ? "font-medium text-primary" : "text-ink-soft"}>{status}</span><span className="tabular-nums text-ink-soft">{item.filled}/{item.fields.length}</span></span><span className="block h-1 overflow-hidden rounded-full bg-surface-muted"><span className="block h-full rounded-full bg-primary" style={{ width: `${(item.filled / item.fields.length) * 100}%` }} /></span></span>
                        <span className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-faint transition-colors group-hover:bg-primary-light group-hover:text-primary"><ProfileIcon path="m9 5 7 7-7 7" className="h-4 w-4" /></span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="flex items-start gap-2 border-t border-divider bg-surface-muted/30 px-6 py-4 text-xs leading-relaxed text-ink-soft sm:px-8"><ProfileIcon path="M12 8h.01M12 11v5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" className="h-4 w-4 shrink-0" /><p>Kolom opsional boleh tetap kosong. Setiap bagian disimpan melalui editornya.</p></div>
            </section>

            <aside aria-label="Sorotan profil" className="space-y-6">
              <section aria-labelledby="principal-title" className="overflow-hidden rounded-3xl border border-divider bg-white">
                <div className="relative h-20 overflow-hidden bg-primary-light"><svg aria-hidden="true" className="absolute right-0 top-0 h-full w-full text-primary/10" viewBox="0 0 320 80" fill="none"><circle cx="270" cy="0" r="75" stroke="currentColor" strokeWidth="24" /><path d="M0 65c80-70 140 70 240-20s120-20 140 0" stroke="currentColor" strokeWidth="2" /></svg></div>
                <div className="px-6 pb-6">
                  <div className="relative -mt-8 mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-surface-muted text-primary">{profile.principal_photo ? <Image src={profile.principal_photo} alt={profile.principal_name || "Kepala sekolah"} fill unoptimized sizes="64px" className="object-cover object-top" /> : <ProfileIcon path={SECTIONS[5].icon} className="h-7 w-7" />}</div>
                  <h2 id="principal-title" className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">{profile.principal_title || "Kepala sekolah"}</h2>
                  <p className="mt-2 break-words text-lg font-semibold tracking-tight text-ink">{profile.principal_name || "Belum dipilih"}</p>
                  <p className="mt-3 line-clamp-3 whitespace-pre-line break-words text-sm leading-6 text-ink-soft">{profile.principal_message || "Hadirkan sapaan hangat dari kepala sekolah untuk keluarga dan calon peserta didik."}</p>
                  <button type="button" onClick={() => openEditor("principal")} className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Kelola profil & sambutan<ProfileIcon path="M4 12h16m-6-6 6 6-6 6" className="h-4 w-4" /></button>
                </div>
              </section>

              <section aria-labelledby="next-step-title" className="rounded-3xl border border-primary/10 bg-primary-light p-6">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-primary"><ProfileIcon path={nextSection ? "m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3ZM20 17v4m-2-2h4" : "m5 12 4 4L19 6"} className="h-5 w-5" /></span>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">{nextSection ? "Langkah berikutnya" : "Semua kolom terisi"}</p>
                <h2 id="next-step-title" className="mt-2 text-base font-semibold text-ink">{nextSection ? `Lengkapi ${nextSection.title.toLowerCase()}` : "Profil siap ditinjau kembali"}</h2>
                <p className="mt-2 text-xs leading-6 text-ink-muted">{nextSection ? `${nextSection.fields.length - nextSection.filled} kolom belum terisi di bagian ini. Tambahkan informasi yang relevan untuk sekolah.` : "Seluruh bagian telah terisi. Tinjau website untuk memastikan informasi tetap akurat dan terkini."}</p>
                <Button variant="primary" size="sm" className="mt-5 w-full rounded-xl" onClick={() => openEditor(nextSection?.id || "identity")}>{nextSection ? "Lanjutkan mengisi" : "Tinjau identitas"}<ProfileIcon path="M4 12h16m-6-6 6 6-6 6" className="h-4 w-4" /></Button>
              </section>
            </aside>
          </div>
        </>
      )}

      <div ref={dialogRootRef} onKeyDown={handleDialogKeyDown}>
        <div inert={hasConfirmation ? true : undefined} aria-hidden={hasConfirmation ? true : undefined}>
          <Modal open={Boolean(section)} onClose={closeEditor} title={section ? `Edit ${section.title}` : "Edit Profil"} size={["vision-mission", "principal", "public"].includes(activeSection) ? "xl" : "lg"} hideClose={saving || uploading}>
            {section && <form onSubmit={handleSave} noValidate className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-primary/10 bg-primary-light/50 p-4 sm:flex-row sm:items-center">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-primary"><ProfileIcon path={section.icon} /></span>
                <div className="min-w-0 flex-1"><p className="text-sm leading-relaxed text-ink-muted">{section.description}</p><p className="mt-1 text-xs text-ink-soft">Perbarui informasi, lalu simpan untuk menerapkannya.</p></div>
                <span role="status" className={`self-start rounded-full bg-white px-3 py-1.5 text-[11px] font-medium sm:max-w-36 sm:self-center ${dirty ? "text-warning" : "text-ink-soft"}`}>{uploading ? "Mengunggah foto…" : dirty ? "Perubahan belum disimpan" : "Sesuai data tersimpan"}</span>
              </div>
              {saveError && <div role="alert" className="rounded-xl border border-danger/20 bg-danger-light px-4 py-3 text-sm text-danger"><p className="font-medium">Perubahan belum tersimpan</p><p className="mt-1">{saveError}</p></div>}
              <fieldset disabled={saving || uploading} className="min-w-0 space-y-5 disabled:opacity-70">
                {activeSection === "identity" && <><Input label="Nama Sekolah" {...fieldProps("name")} required /><Input label="Tagline" {...fieldProps("tagline")} hint="Kalimat singkat yang mewakili identitas sekolah." /><Textarea label="Deskripsi Sekolah" {...fieldProps("description")} rows={6} /><div className="grid gap-5 sm:grid-cols-2"><Input label="Akreditasi" {...fieldProps("accreditation")} /><Input label="NPSN" {...fieldProps("npsn")} /></div></>}
                {activeSection === "vision-mission" && (
                  <div className="grid gap-6 md:grid-cols-2">
                    {[{ label: "Visi", titleField: "vision_title", field: "vision" }, { label: "Misi", titleField: "mission_title", field: "missions" }].map(({ label, titleField, field }) => (
                      <section key={field} aria-label={`Editor ${label}`} className="min-w-0 space-y-5">
                        <Input label={`Judul ${label}`} {...fieldProps(titleField)} />
                        <ArrayField label={label} name={field} values={form[field]} onChange={(values) => handleChange(field, values)} errors={formErrors} onRemove={(name, index) => requestConfirmation({ type: "item", field: name, index })} />
                      </section>
                    ))}
                  </div>
                )}
                {activeSection === "contact" && <><div className="grid gap-5 sm:grid-cols-2"><Input label="Telepon" type="tel" {...fieldProps("phone")} /><Input label="WhatsApp" type="tel" {...fieldProps("whatsapp")} /></div><Input label="Email Sekolah" type="email" {...fieldProps("email")} /></>}
                {activeSection === "location" && <><Textarea label="Alamat Lengkap" {...fieldProps("address")} rows={4} /><Textarea label="Google Maps Embed URL" {...fieldProps("maps_embed_url")} rows={4} hint="Masukkan URL embed peta, bukan keseluruhan tag iframe." /></>}
                {activeSection === "social" && <><Input label="Facebook URL" {...fieldProps("facebook_url")} /><Input label="Instagram URL" {...fieldProps("instagram_url")} /><Input label="YouTube URL" {...fieldProps("youtube_url")} /><p className="text-xs leading-relaxed text-ink-soft">Gunakan tautan akun resmi sekolah. Kosongkan kanal yang belum digunakan.</p></>}
                {activeSection === "principal" && <>
                  {teachersError && <p role="alert" className="rounded-lg bg-warning-light p-3 text-sm text-ink-muted">Daftar guru belum dapat dimuat: {teachersError}. Data kepala sekolah yang tersimpan tetap dipertahankan.</p>}
                  <div className="grid gap-5 sm:grid-cols-2"><Select label="Nama Kepala Sekolah" {...fieldProps("principal_name")} options={teacherOptions} placeholder="" /><Input label="Jabatan" {...fieldProps("principal_title")} /></div>
                  <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]"><div className="space-y-2"><FileUpload key={form.principal_photo} id="profile-principal-photo" label="Foto Kepala Sekolah" value={form.principal_photo} onChange={(url) => handleChange("principal_photo", url)} accept="image/*" disabled={saving || uploading} onUploadingChange={setUploading} error={formErrors.principal_photo?.[0]} />{form.principal_photo && <Button variant="danger-ghost" size="sm" onClick={() => requestConfirmation({ type: "photo" })}>Hapus Foto</Button>}</div><Textarea label="Sambutan Kepala Sekolah" {...fieldProps("principal_message")} rows={8} /></div>
                  <div className="grid gap-5 sm:grid-cols-2"><Textarea label="Pendidikan" {...fieldProps("principal_education")} rows={4} /><Textarea label="Pengalaman" {...fieldProps("principal_experience")} rows={4} /></div><Textarea label="Biografi" {...fieldProps("principal_bio")} rows={5} />
                </>}
                {activeSection === "public" && <>
                  <div className="rounded-xl border border-divider bg-surface-muted p-4 text-sm leading-relaxed text-ink-muted">Bagian ini mempertahankan editor JSON untuk seluruh konten publik yang sudah ada. Ubah hanya struktur yang dipahami; properti lain tetap disimpan bersama konfigurasi.</div>
                  <div className="flex flex-wrap items-center justify-between gap-3"><span className="text-xs text-ink-soft">Validasi format dilakukan sebelum penyimpanan.</span><Button variant="secondary" size="sm" onClick={() => { const parsed = parsePublicSections(); if (parsed !== undefined) handleChange("public_sections", JSON.stringify(parsed, null, 2)); }}>Rapikan JSON</Button></div>
                  <Textarea label="Konfigurasi Bagian Publik (JSON)" {...fieldProps("public_sections")} rows={18} spellCheck={false} style={{ fontFamily: "monospace", tabSize: 2, lineHeight: "1.7" }} />
                  {nestedPublicErrors.length > 0 && <ul className="space-y-1 rounded-lg bg-danger-light p-3 text-sm text-danger" aria-label="Kesalahan konfigurasi">{nestedPublicErrors.map(([field, messages]) => <li key={field}>{field}: {messages[0]}</li>)}</ul>}
                </>}
              </fieldset>
              <div className="sticky -bottom-5 z-10 -mx-6 flex flex-col-reverse justify-between gap-3 border-t border-divider bg-white px-6 py-4 sm:flex-row sm:items-center"><p className="text-xs text-ink-soft">Perubahan diterapkan setelah disimpan.</p><div className="flex justify-end gap-3"><Button variant="secondary" size="sm" onClick={closeEditor} disabled={saving || uploading}>Batal</Button><Button type="submit" size="sm" loading={saving} disabled={!dirty || uploading}>{saving ? "Menyimpan…" : uploading ? "Menunggu Unggahan…" : "Simpan Perubahan"}</Button></div></div>
            </form>}
          </Modal>
        </div>
        <ConfirmDialog open={hasConfirmation} onClose={() => setConfirmation(null)} onConfirm={handleConfirm} title={confirmation?.type === "discard" ? "Buang perubahan?" : confirmation?.type === "photo" ? "Hapus foto kepala sekolah?" : "Hapus poin ini?"} message={confirmation?.type === "discard" ? "Perubahan di editor ini belum disimpan. Tutup editor dan kembali ke data tersimpan?" : "Data akan dihapus dari draft. Penghapusan baru diterapkan setelah Anda memilih Simpan Perubahan."} confirmLabel={confirmation?.type === "discard" ? "Buang Perubahan" : "Hapus dari Draft"} />
      </div>
    </div>
  );
}
