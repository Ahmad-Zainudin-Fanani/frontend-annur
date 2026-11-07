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
  { id: "public", title: "Bagian Publik", description: "Konfigurasi konten terstruktur untuk website publik.", fields: ["public_sections"], icon: "m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18" },
];

function normalizeForm(data = {}) {
  const next = Object.fromEntries(Object.keys(EMPTY_FORM).map((key) => [key, data[key] ?? EMPTY_FORM[key]]));
  next.vision = Array.isArray(data.vision) ? data.vision : data.vision ? [data.vision] : [];
  next.missions = Array.isArray(data.missions) ? data.missions : data.missions ? [data.missions] : [];
  next.public_sections = JSON.stringify(data.public_sections ?? {}, null, 2);
  return next;
}

function hasContent(section, data) {
  return section.fields.some((field) => {
    if (field === "public_sections") {
      try { return Object.keys(JSON.parse(data[field] || "{}") ?? {}).length > 0; } catch { return false; }
    }
    return Array.isArray(data[field]) ? data[field].some((value) => value.trim()) : String(data[field] || "").trim();
  });
}

function SummaryValue({ label, value }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className={`mt-1 break-words text-sm ${value ? "text-ink" : "text-ink-faint"}`}>{value || "Belum diisi"}</dd>
    </div>
  );
}

function SectionSummary({ section, data }) {
  if (section.id === "identity") {
    return (
      <div className="space-y-4">
        <div><p className="font-semibold text-ink break-words">{data.name || "Nama sekolah belum diisi"}</p><p className="mt-1 line-clamp-2 text-sm text-ink-soft">{data.tagline || "Tagline belum diisi"}</p></div>
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{data.description || "Deskripsi sekolah belum ditambahkan."}</p>
        <dl className="grid grid-cols-2 gap-4 border-t border-divider pt-4"><SummaryValue label="Akreditasi" value={data.accreditation} /><SummaryValue label="NPSN" value={data.npsn} /></dl>
      </div>
    );
  }
  if (section.id === "vision-mission") {
    return (
      <div className="divide-y divide-divider">
        {[{ field: "vision", title: data.vision_title || "Visi" }, { field: "missions", title: data.mission_title || "Misi" }].map(({ field, title }) => {
          const items = data[field].filter((item) => item.trim());
          return (
            <div key={field} className="py-4 first:pt-0 last:pb-0">
              <p className="mb-2 text-sm font-medium text-ink">{title}</p>
              {items.length ? <p className="line-clamp-2 break-words text-sm leading-relaxed text-ink-muted">{items[0]}</p> : <p className="text-sm text-ink-faint">Belum ada poin {field === "vision" ? "visi" : "misi"}.</p>}
              <p className="mt-2 text-xs text-ink-soft">{items.length} poin tersimpan{items.length > 1 ? ` · ${items.length - 1} poin lainnya di editor` : ""}</p>
            </div>
          );
        })}
      </div>
    );
  }
  if (section.id === "contact") return <dl className="space-y-4"><SummaryValue label="Telepon" value={data.phone} /><SummaryValue label="WhatsApp" value={data.whatsapp} /><SummaryValue label="Email" value={data.email} /></dl>;
  if (section.id === "location") return <dl className="space-y-4"><SummaryValue label="Alamat sekolah" value={data.address} /><SummaryValue label="Google Maps" value={data.maps_embed_url ? "Peta lokasi sudah dikonfigurasi" : ""} /></dl>;
  if (section.id === "social") return <dl className="space-y-4"><SummaryValue label="Facebook" value={data.facebook_url} /><SummaryValue label="Instagram" value={data.instagram_url} /><SummaryValue label="YouTube" value={data.youtube_url} /></dl>;
  if (section.id === "principal") {
    return <div className="space-y-4"><div className="flex items-center gap-4"><div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-divider bg-surface-muted">{data.principal_photo ? <Image src={data.principal_photo} alt={data.principal_name || "Kepala sekolah"} fill unoptimized sizes="64px" className="object-cover object-top" /> : <span className="text-xs text-ink-faint">Tanpa foto</span>}</div><dl className="min-w-0 space-y-1"><SummaryValue label={data.principal_title || "Kepala sekolah"} value={data.principal_name} /></dl></div><p className="line-clamp-3 text-sm leading-relaxed text-ink-muted">{data.principal_message || "Sambutan kepala sekolah belum ditambahkan."}</p><dl className="grid gap-4 sm:grid-cols-2"><SummaryValue label="Pendidikan" value={data.principal_education} /><SummaryValue label="Pengalaman" value={data.principal_experience} /></dl><p className="line-clamp-2 text-sm text-ink-soft">{data.principal_bio || "Biografi belum diisi."}</p></div>;
  }
  let keys = [];
  try { keys = Object.keys(JSON.parse(data.public_sections || "{}") ?? {}); } catch { /* Invalid JSON is reported in the editor. */ }
  return <div><span className="inline-flex rounded-md border border-divider bg-surface-muted px-2 py-1 text-xs font-medium text-ink-muted">Editor lanjutan · JSON</span><p className="mt-4 text-sm text-ink-muted">{keys.length ? `${keys.length} kelompok konten dikonfigurasi.` : "Belum ada konfigurasi konten tambahan."}</p>{keys.length > 0 && <p className="mt-2 line-clamp-3 break-words text-xs leading-relaxed text-ink-soft">{keys.join(" · ")}</p>}<p className="mt-4 text-xs leading-relaxed text-ink-soft">Kelola struktur konten tanpa mengubah bagian profil lainnya.</p></div>;
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
  const filledSections = SECTIONS.filter((item) => hasContent(item, profile)).length;
  const teacherOptions = [
    { value: "", label: "Belum dipilih" },
    ...(form.principal_name && !principalOptions.some((option) => option.value === form.principal_name) ? [{ value: form.principal_name, label: form.principal_name }] : []),
    ...principalOptions,
  ];
  const nestedPublicErrors = Object.entries(formErrors).filter(([field]) => field.startsWith("public_sections."));

  return (
    <div className="space-y-6">
      <PageHeader title="Profil Sekolah" description="Kelola informasi sekolah per bagian, tanpa formulir yang menumpuk." breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Profil Sekolah" }]} />

      {error ? <ErrorState message={error} onRetry={load} /> : loading ? (
        <div role="status" aria-label="Memuat profil sekolah"><span className="sr-only">Memuat profil sekolah…</span><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{SECTIONS.map((item) => <SkeletonCard key={item.id} className="min-h-60" />)}</div></div>
      ) : (
        <>
          <section className="flex flex-col justify-between gap-5 rounded-2xl border border-divider bg-white p-5 shadow-sm sm:p-6 lg:flex-row lg:items-center">
            <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wider text-ink-soft">Pusat pengelolaan profil</p><h2 className="mt-2 break-words text-xl font-semibold tracking-tight text-ink">{profile.name || "Lengkapi profil sekolah Anda"}</h2><p className="mt-1 text-sm text-ink-soft">{filledSections} dari {SECTIONS.length} bagian memiliki konten. Pilih bagian untuk mengelolanya.</p></div>
            <Link href="/" target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg border border-divider bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary">Lihat Website <span aria-hidden="true">↗</span></Link>
          </section>
          <div className="grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
            {SECTIONS.map((item) => {
              const filled = hasContent(item, profile);
              return (
                <section key={item.id} aria-labelledby={`section-${item.id}`} className="flex min-w-0 flex-col rounded-2xl border border-divider bg-white shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-3 px-5 pt-5 sm:px-6 sm:pt-6"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-muted text-ink-muted"><svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg></span><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${filled ? "bg-success-light text-success" : "bg-surface-muted text-ink-soft"}`}><span className={`h-1.5 w-1.5 rounded-full ${filled ? "bg-success" : "bg-ink-faint"}`} />{filled ? "Terisi" : "Belum diisi"}</span></div>
                  <div className="px-5 pt-4 sm:px-6"><h2 id={`section-${item.id}`} className="text-base font-semibold text-ink">{item.title}</h2><p className="mt-1 text-xs leading-relaxed text-ink-soft">{item.description}</p></div>
                  <div className="flex-1 px-5 py-5 sm:px-6"><SectionSummary section={item} data={profile} /></div>
                  <div className="flex items-center justify-between gap-3 rounded-b-2xl border-t border-divider bg-surface-muted/30 px-5 py-3.5 sm:px-6"><span className="text-xs text-ink-soft">{item.id === "public" ? "Pengaturan lanjutan" : "Konten website"}</span><Button variant="secondary" size="sm" onClick={() => openEditor(item.id)} aria-label={`${filled ? "Edit" : "Lengkapi"} ${item.title}`}>{filled ? "Edit Bagian" : "Lengkapi"}<span aria-hidden="true">→</span></Button></div>
                </section>
              );
            })}
          </div>
        </>
      )}

      <div ref={dialogRootRef} onKeyDown={handleDialogKeyDown}>
        <div inert={hasConfirmation ? true : undefined} aria-hidden={hasConfirmation ? true : undefined}>
          <Modal open={Boolean(section)} onClose={closeEditor} title={section ? `Edit ${section.title}` : "Edit Profil"} size={["vision-mission", "principal", "public"].includes(activeSection) ? "xl" : "lg"} hideClose={saving || uploading}>
            {section && <form onSubmit={handleSave} noValidate className="space-y-6">
              <div className="flex flex-col justify-between gap-2 border-b border-divider pb-4 sm:flex-row sm:items-start"><p className="max-w-xl text-sm leading-relaxed text-ink-soft">{section.description}</p><span role="status" className={`shrink-0 text-xs font-medium ${dirty ? "text-warning" : "text-ink-faint"}`}>{uploading ? "Mengunggah foto…" : dirty ? "Perubahan belum disimpan" : "Sesuai data tersimpan"}</span></div>
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
