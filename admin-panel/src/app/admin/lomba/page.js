"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/molecules/PageHeader";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";
import DataTable from "@/components/organisms/DataTable";
import Modal from "@/components/organisms/Modal";
import { ConfirmDialog } from "@/components/organisms/Modal";
import FileUpload from "@/components/atoms/FileUpload";
import { EmptyState, ErrorState } from "@/components/atoms/States";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = {
  title: "", organizer: "", category: "", status: "published",
  level: "", display_status: "", description: "",
  registration_deadline: "", event_date: "", location: "",
  guide_book_url: "", banner_image: "", is_featured: false,
};

export default function LombaPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (filterStatus !== "all") params.set("status", filterStatus);
      const res = await apiFetch(`/competitions?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title ?? "",
      organizer: item.organizer ?? "",
      category: item.category ?? "",
      status: item.status ?? "published",
      level: item.level ?? "",
      display_status: item.display_status ?? "",
      description: item.description ?? "",
      registration_deadline: item.registration_deadline ?? "",
      event_date: item.event_date ?? "",
      location: item.location ?? "",
      guide_book_url: item.guide_book_url ?? "",
      banner_image: item.banner_image ?? "",
      is_featured: !!item.is_featured,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      const payload = { ...form };
      if (editItem) {
        await apiFetch(`/competitions/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Lomba berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/competitions", { method: "POST", body: payload });
        toast({ message: "Lomba berhasil ditambahkan.", type: "success" });
      }
      setModalOpen(false);
      load();
    } catch (err) {
      if (err.errors) setFormErrors(err.errors);
      else toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/competitions/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Lomba berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      load();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "title", header: "Judul", render: (row) => <p className="font-medium text-ink max-w-[200px] truncate">{row.title}</p> },
    { key: "organizer", header: "Penyelenggara" },
    { key: "category", header: "Kategori" },
    { key: "event_date", header: "Tanggal", render: (row) => row.event_date ? new Date(row.event_date).toLocaleDateString("id-ID") : "—" },
    { key: "is_featured", header: "Unggulan", render: (row) => row.is_featured ? <Badge status="active" label="Ya" /> : "—" },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    { key: "actions", header: "Aksi", render: (row) => (
      <div className="flex gap-2">
        <Button size="xs" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
        <Button size="xs" variant="danger-ghost" onClick={() => { setDeleteTarget(row); setConfirmOpen(true); }}>Hapus</Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Lomba"
        description="Kelola informasi lomba dan kompetisi"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Lomba" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Lomba</Button>}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input id="lomba-search" placeholder="Cari lomba..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select id="lomba-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, { value: "published", label: "Terbit" }, { value: "draft", label: "Draf" }]}
          placeholder="" className="w-40" />
      </div>

      {error ? <ErrorState message={error} onRetry={load} /> : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada lomba" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Lomba" : "Tambah Lomba"} size="lg">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <Input id="lomba-title" label="Judul Lomba" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={formErrors.title?.[0]} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="lomba-organizer" label="Penyelenggara" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} error={formErrors.organizer?.[0]} required />
            <Input id="lomba-category" label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} error={formErrors.category?.[0]} required />
            <Select id="lomba-status-f" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} required />
            <Input id="lomba-level" label="Tingkat" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} error={formErrors.level?.[0]} />
            <Input id="lomba-display-status" label="Status Tampil" value={form.display_status} onChange={(e) => setForm({ ...form, display_status: e.target.value })} error={formErrors.display_status?.[0]} hint='Mis: "Pendaftaran Dibuka"' />
            <Input id="lomba-location" label="Lokasi" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} error={formErrors.location?.[0]} />
            <Input id="lomba-reg-deadline" label="Batas Pendaftaran" type="date" value={form.registration_deadline} onChange={(e) => setForm({ ...form, registration_deadline: e.target.value })} error={formErrors.registration_deadline?.[0]} />
            <Input id="lomba-event-date" label="Tanggal Lomba" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} error={formErrors.event_date?.[0]} />
          </div>
          <Input id="lomba-guide-url" label="URL Buku Panduan" type="url" value={form.guide_book_url} onChange={(e) => setForm({ ...form, guide_book_url: e.target.value })} error={formErrors.guide_book_url?.[0]} hint="https://... atau /path/internal" />
          <Textarea id="lomba-desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description?.[0]} rows={3} />
          <FileUpload id="lomba-banner" label="Banner" value={form.banner_image} onChange={(url) => setForm({ ...form, banner_image: url })} accept="image/*" error={formErrors.banner_image?.[0]} />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-divider text-primary" />
            Tampilkan sebagai Unggulan
          </label>
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Lomba" message={`Yakin ingin menghapus "${deleteTarget?.title}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
