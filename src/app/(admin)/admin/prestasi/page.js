"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Input from "@/components/admin/atoms/Input";
import Select from "@/components/admin/atoms/Select";
import Textarea from "@/components/admin/atoms/Textarea";
import DataTable from "@/components/admin/organisms/DataTable";
import Modal from "@/components/admin/organisms/Modal";
import { ConfirmDialog } from "@/components/admin/organisms/Modal";
import FileUpload from "@/components/admin/atoms/FileUpload";
import { EmptyState, ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

const CATEGORIES = [
  { value: "akademik", label: "Akademik" },
  { value: "olahraga", label: "Olahraga" },
  { value: "seni", label: "Seni" },
  { value: "keagamaan", label: "Keagamaan" },
  { value: "lainnya", label: "Lainnya" },
];

const LEVELS = [
  { value: "sekolah", label: "Sekolah" },
  { value: "kecamatan", label: "Kecamatan" },
  { value: "kabupaten", label: "Kabupaten/Kota" },
  { value: "provinsi", label: "Provinsi" },
  { value: "nasional", label: "Nasional" },
  { value: "internasional", label: "Internasional" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = {
  title: "", category: "", level: "", year: "", recipient_name: "",
  status: "published", organizer: "", description: "", image: "",
};

export default function PrestasiPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
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
      if (filterCategory) params.set("category", filterCategory);
      const res = await apiFetch(`/achievements?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterCategory]);

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
      category: item.category ?? "",
      level: item.level ?? "",
      year: item.year ?? "",
      recipient_name: item.recipient_name ?? "",
      status: item.status ?? "published",
      organizer: item.organizer ?? "",
      description: item.description ?? "",
      image: item.image ?? "",
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
        await apiFetch(`/achievements/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Prestasi berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/achievements", { method: "POST", body: payload });
        toast({ message: "Prestasi berhasil ditambahkan.", type: "success" });
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
      await apiFetch(`/achievements/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Prestasi berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "title", header: "Judul", render: (row) => <p className="font-medium text-ink max-w-[200px] truncate">{row.title}</p> },
    { key: "category", header: "Kategori", render: (row) => CATEGORIES.find(c => c.value === row.category)?.label ?? row.category },
    { key: "level", header: "Tingkat", render: (row) => LEVELS.find(l => l.value === row.level)?.label ?? row.level },
    { key: "year", header: "Tahun" },
    { key: "recipient_name", header: "Penerima" },
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
        title="Prestasi"
        description="Kelola data prestasi siswa SD Plus An-Nur"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Prestasi" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Prestasi</Button>}
      />

      <div className="flex flex-wrap gap-3 mb-4">
        <Input id="prestasi-search" placeholder="Cari judul..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select id="prestasi-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, { value: "published", label: "Terbit" }, { value: "draft", label: "Draf" }]}
          placeholder="" className="w-40" />
        <Select id="prestasi-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          options={[{ value: "", label: "Semua Kategori" }, ...CATEGORIES]}
          placeholder="" className="w-44" />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada prestasi" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Prestasi" : "Tambah Prestasi"} size="lg">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <Input id="prestasi-title" label="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={formErrors.title?.[0]} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select id="prestasi-category-f" label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORIES} error={formErrors.category?.[0]} required />
            <Select id="prestasi-level-f" label="Tingkat" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} options={LEVELS} error={formErrors.level?.[0]} required />
            <Input id="prestasi-year-f" label="Tahun" type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} error={formErrors.year?.[0]} required />
            <Input id="prestasi-recipient" label="Nama Penerima" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} error={formErrors.recipient_name?.[0]} required />
            <Input id="prestasi-organizer" label="Penyelenggara" value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} error={formErrors.organizer?.[0]} />
            <Select id="prestasi-status-f" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} />
          </div>
          <Textarea id="prestasi-desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description?.[0]} rows={3} />
          <FileUpload id="prestasi-image" label="Gambar" value={form.image} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" error={formErrors.image?.[0]} />
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Prestasi" message={`Yakin ingin menghapus "${deleteTarget?.title}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
