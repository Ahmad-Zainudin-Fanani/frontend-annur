"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Input from "@/components/admin/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import Select from "@/components/admin/atoms/Select";
import FileUpload from "@/components/admin/atoms/FileUpload";
import { EmptyState, ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

// Helper component for array fields (very simple – one textarea per item)
function ArrayField({ label, name, values, setValues, errors }) {
  const handleChange = (idx, val) => {
    const newVals = [...values];
    newVals[idx] = val;
    setValues(newVals);
  };
  const addItem = () => setValues([...values, ""]);
  const removeItem = (idx) => setValues(values.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-ink mb-1">{label}</label>
      {values.map((val, i) => (
        <div key={i} className="flex gap-2 items-start">
          <Textarea
            value={val}
            onChange={(e) => handleChange(i, e.target.value)}
            error={errors?.[i]}
            rows={2}
          />
          <Button type="button" variant="danger-ghost" size="xs" onClick={() => removeItem(i)}>
            ✕
          </Button>
        </div>
      ))}
      <Button type="button" variant="secondary" size="sm" onClick={addItem}>+ Tambah {label}</Button>
    </div>
  );
}

export default function ProfilPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Form state – initialize with empty values; will be overridden by API load
  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    vision_title: "",
    vision: [],
    mission_title: "",
    missions: [],
    address: "",
    phone: "",
    whatsapp: "",
    email: "",
    maps_embed_url: "",
    facebook_url: "",
    instagram_url: "",
    youtube_url: "",
    principal_name: "",
    principal_title: "",
    principal_message: "",
    principal_education: "",
    principal_experience: "",
    principal_bio: "",
    principal_photo: "",
    accreditation: "",
    npsn: "",
    // For simplicity, public_sections will be edited as raw JSON string
    public_sections: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [principalOptions, setPrincipalOptions] = useState([]); // list of guru names for select

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch("/profile");
      const data = res.data ?? {};
      // Convert array fields to proper arrays if they come as strings
      setForm({
        name: data.name ?? "",
        tagline: data.tagline ?? "",
        description: data.description ?? "",
        vision_title: data.vision_title ?? "",
        vision: data.vision ?? [],
        mission_title: data.mission_title ?? "",
        missions: data.missions ?? [],
        address: data.address ?? "",
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        maps_embed_url: data.maps_embed_url ?? "",
        facebook_url: data.facebook_url ?? "",
        instagram_url: data.instagram_url ?? "",
        youtube_url: data.youtube_url ?? "",
        principal_name: data.principal_name ?? "",
        principal_title: data.principal_title ?? "",
        principal_message: data.principal_message ?? "",
        principal_education: data.principal_education ?? "",
        principal_experience: data.principal_experience ?? "",
        principal_bio: data.principal_bio ?? "",
        principal_photo: data.principal_photo ?? "",
        accreditation: data.accreditation ?? "",
        npsn: data.npsn ?? "",
        public_sections: JSON.stringify(data.public_sections ?? {}, null, 2),
      });
      // Load guru list for principal_name select (simple GET /teachers?search=) – limit to name field
      const gRes = await apiFetch("/teachers?search=");
      const teachers = gRes.data ?? [];
      setPrincipalOptions(teachers.map((t) => ({ value: t.name, label: t.name })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts async requests and updates their loading state.
    load();
  }, [load]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      // Parse public_sections back to object
      const payload = {
        ...form,
        vision: form.vision.filter((v) => v.trim() !== ""),
        missions: form.missions.filter((v) => v.trim() !== ""),
        public_sections: form.public_sections ? JSON.parse(form.public_sections) : {},
      };
      await apiFetch("/profile", { method: "PUT", body: payload });
      toast({ message: "Profil sekolah berhasil diperbarui.", type: "success" });
      load();
    } catch (err) {
      if (err.errors) {
        setFormErrors(err.errors);
      } else {
        toast({ message: err.message, type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profil Sekolah"
        description="Kelola data profil lengkap sekolah, termasuk kepala sekolah dan bagian publik"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Profil" }]}
        actions={<Button onClick={handleSave} variant="primary" size="sm" loading={saving}>Simpan</Button>}
      />

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : loading ? (
        <EmptyState title="Memuat profil..." description="Silakan tunggu sejenak" />
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Identitas dasar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nama Sekolah" value={form.name} onChange={(e) => handleChange("name", e.target.value)} error={formErrors.name?.[0]} required />
            <Input label="Tagline" value={form.tagline} onChange={(e) => handleChange("tagline", e.target.value)} error={formErrors.tagline?.[0]} />
          </div>
          <Textarea label="Deskripsi" value={form.description} onChange={(e) => handleChange("description", e.target.value)} error={formErrors.description?.[0]} rows={4} />

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Judul Visi" value={form.vision_title} onChange={(e) => handleChange("vision_title", e.target.value)} />
            <Input label="Judul Misi" value={form.mission_title} onChange={(e) => handleChange("mission_title", e.target.value)} />
          </div>
          <ArrayField label="Visi" name="vision" values={form.vision} setValues={(v) => handleChange("vision", v)} errors={formErrors.vision} />
          <ArrayField label="Misi" name="missions" values={form.missions} setValues={(v) => handleChange("missions", v)} errors={formErrors.missions} />

          {/* Kontak */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Alamat" value={form.address} onChange={(e) => handleChange("address", e.target.value)} error={formErrors.address?.[0]} />
            <Input label="Telepon" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} error={formErrors.phone?.[0]} />
            <Input label="WhatsApp" value={form.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} error={formErrors.whatsapp?.[0]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Email" type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} error={formErrors.email?.[0]} />
            <Input label="Google Maps Embed URL" value={form.maps_embed_url} onChange={(e) => handleChange("maps_embed_url", e.target.value)} error={formErrors.maps_embed_url?.[0]} />
            <Input label="Facebook URL" value={form.facebook_url} onChange={(e) => handleChange("facebook_url", e.target.value)} error={formErrors.facebook_url?.[0]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Instagram URL" value={form.instagram_url} onChange={(e) => handleChange("instagram_url", e.target.value)} error={formErrors.instagram_url?.[0]} />
            <Input label="YouTube URL" value={form.youtube_url} onChange={(e) => handleChange("youtube_url", e.target.value)} error={formErrors.youtube_url?.[0]} />
          </div>

          {/* Kepala Sekolah */}
          <div className="border-t border-divider pt-6">
            <h2 className="text-lg font-semibold mb-4 text-ink">Kepala Sekolah</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Nama Kepala Sekolah" value={form.principal_name} onChange={(e) => handleChange("principal_name", e.target.value)} options={principalOptions} placeholder="Pilih guru..." error={formErrors.principal_name?.[0]} />
              <Input label="Jabatan" value={form.principal_title} onChange={(e) => handleChange("principal_title", e.target.value)} error={formErrors.principal_title?.[0]} />
            </div>
            <Textarea label="Pesan Kepala" value={form.principal_message} onChange={(e) => handleChange("principal_message", e.target.value)} error={formErrors.principal_message?.[0]} rows={3} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Input label="Pendidikan" value={form.principal_education} onChange={(e) => handleChange("principal_education", e.target.value)} error={formErrors.principal_education?.[0]} />
              <Input label="Pengalaman" value={form.principal_experience} onChange={(e) => handleChange("principal_experience", e.target.value)} error={formErrors.principal_experience?.[0]} />
              <Input label="Bio" value={form.principal_bio} onChange={(e) => handleChange("principal_bio", e.target.value)} error={formErrors.principal_bio?.[0]} />
            </div>
            <FileUpload label="Foto Kepala Sekolah" value={form.principal_photo} onChange={(url) => handleChange("principal_photo", url)} accept="image/*" error={formErrors.principal_photo?.[0]} />
          </div>

          {/* Akreditasi & NPSN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Input label="Akreditasi" value={form.accreditation} onChange={(e) => handleChange("accreditation", e.target.value)} error={formErrors.accreditation?.[0]} />
            <Input label="NPSN" value={form.npsn} onChange={(e) => handleChange("npsn", e.target.value)} error={formErrors.npsn?.[0]} />
          </div>

          {/* Public Sections – raw JSON editor (advanced users) */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-ink mb-1">Bagian Publik (JSON)</label>
            <Textarea
              value={form.public_sections}
              onChange={(e) => handleChange("public_sections", e.target.value)}
              error={formErrors.public_sections?.[0]}
              rows={8}
            />
            <p className="text-xs text-ink-soft mt-1">Edit JSON secara manual atau gunakan endpoint lain untuk mengelola struktur ini.</p>
          </div>
        </form>
      )}
    </div>
  );
}
