"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/molecules/PageHeader";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import DataTable from "@/components/organisms/DataTable";
import Modal from "@/components/organisms/Modal";
import { ConfirmDialog } from "@/components/organisms/Modal";
import FileUpload from "@/components/atoms/FileUpload";
import { EmptyState, ErrorState } from "@/components/atoms/States";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const CATEGORIES = [
  { value: "kegiatan", label: "Kegiatan" },
  { value: "prestasi", label: "Prestasi" },
  { value: "fasilitas", label: "Fasilitas" },
  { value: "lainnya", label: "Lainnya" },
];

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = {
  title: "", category: "", image: "", status: "published", description: "", event_date: "",
};

export default function GaleriPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
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
      if (filterStatus !== "all") params.set("status", filterStatus);
      if (filterCategory) params.set("category", filterCategory);
      const res = await apiFetch(`/galleries?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterCategory]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title ?? "", category: item.category ?? "", image: item.image ?? "", status: item.status ?? "published", description: item.description ?? "", event_date: item.event_date ?? "" });
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
        await apiFetch(`/galleries/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Galeri berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/galleries", { method: "POST", body: payload });
        toast({ message: "Galeri berhasil ditambahkan.", type: "success" });
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
    setDeleting(true);
    try {
      await apiFetch(`/galleries/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Item galeri berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      load();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "image", header: "Gambar", render: (row) => row.image ? (
      <img src={row.image} alt={row.title} className="w-16 h-10 object-cover rounded-lg border border-divider" />
    ) : "—" },
    { key: "title", header: "Judul", render: (row) => <p className="font-medium text-ink max-w-[180px] truncate">{row.title}</p> },
    { key: "category", header: "Kategori", render: (row) => CATEGORIES.find(c => c.value === row.category)?.label ?? row.category },
    { key: "event_date", header: "Tanggal", render: (row) => row.event_date ? new Date(row.event_date).toLocaleDateString("id-ID") : "—" },
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
        title="Galeri"
        description="Kelola foto dan dokumentasi kegiatan sekolah"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Galeri" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Foto</Button>}
      />
      <div className="flex flex-wrap gap-3 mb-4">
        <Select id="galeri-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, ...STATUS_OPTIONS]} placeholder="" className="w-40" />
        <Select id="galeri-category" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
          options={[{ value: "", label: "Semua Kategori" }, ...CATEGORIES]} placeholder="" className="w-44" />
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada item galeri" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Galeri" : "Tambah Galeri"} size="md">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <Input id="galeri-title" label="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={formErrors.title?.[0]} required />
          <div className="grid grid-cols-2 gap-4">
            <Select id="galeri-cat-f" label="Kategori" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} options={CATEGORIES} error={formErrors.category?.[0]} required />
            <Select id="galeri-status-f" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} />
          </div>
          <Input id="galeri-date" label="Tanggal Kegiatan" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} error={formErrors.event_date?.[0]} />
          <Textarea id="galeri-desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description?.[0]} rows={3} />
          <FileUpload id="galeri-image" label="Gambar" value={form.image} onChange={(url) => setForm({ ...form, image: url })} accept="image/*" error={formErrors.image?.[0]} required />
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Item Galeri" message={`Yakin menghapus "${deleteTarget?.title}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
