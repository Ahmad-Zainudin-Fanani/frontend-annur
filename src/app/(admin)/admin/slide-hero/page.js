"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Input from "@/components/admin/atoms/Input";
import DataTable from "@/components/admin/organisms/DataTable";
import Modal from "@/components/admin/organisms/Modal";
import { ConfirmDialog } from "@/components/admin/organisms/Modal";
import FileUpload from "@/components/admin/atoms/FileUpload";
import { EmptyState, ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = {
  image: "", heading: "", subheading: "", caption: "",
  status: "published", order: "", button_label: "", button_url: "",
};

export default function HeroSlidesPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
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
      const res = await apiFetch(`/hero-slides?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an async request and updates its loading state.
    load();
  }, [load]);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (item) => {
  console.log("Data slide:", item);
  console.log("URL gambar:", item.image);

  setEditItem(item);
  setForm({
    image: item.image ?? "",
    heading: item.heading ?? "",
    subheading: item.subheading ?? "",
    caption: item.caption ?? "",
    status: item.status ?? "published",
    order: item.order ?? "",
    button_label: item.button_label ?? "",
    button_url: item.button_url ?? "",
  });
  setFormErrors({});
  setModalOpen(true);
};

  const validateCTA = () => {
    const hasLabel = form.button_label.trim() !== "";
    const hasUrl = form.button_url.trim() !== "";
    if (hasLabel !== hasUrl) return "Label dan URL tombol harus keduanya diisi atau keduanya kosong.";
    if (hasUrl && form.button_url.startsWith("//")) return 'URL tombol tidak boleh diawali "//". Gunakan https:// atau path seperti /kontak.';
    return null;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    const ctaErr = validateCTA();
    if (ctaErr) { setFormErrors({ button_url: [ctaErr] }); return; }
    setSaving(true);
    try {
      const payload = { ...form, ...(form.order !== "" && { order: Number(form.order) }) };
      if (editItem) {
        await apiFetch(`/hero-slides/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Slide berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/hero-slides", { method: "POST", body: payload });
        toast({ message: "Slide berhasil ditambahkan.", type: "success" });
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
      await apiFetch(`/hero-slides/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Slide berhasil dihapus.", type: "success" });
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
      <img src={row.image} alt={row.heading} className="w-16 h-10 object-cover rounded-lg border border-divider" />
    ) : "—" },
    { key: "heading", header: "Heading", render: (row) => <p className="font-medium text-ink max-w-[160px] truncate">{row.heading}</p> },
    { key: "subheading", header: "Subheading", render: (row) => <p className="text-xs text-ink-muted max-w-[160px] truncate">{row.subheading}</p> },
    { key: "order", header: "Urutan" },
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
        title="Slide Hero"
        description="Kelola gambar dan teks tampilan utama website"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Slide Hero" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Slide</Button>}
      />
      <div className="flex gap-3 mb-4">
        <Select id="hero-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, ...STATUS_OPTIONS]} placeholder="" className="w-44" />
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada slide" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Slide" : "Tambah Slide"} size="lg">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <FileUpload id="hero-image" label="Gambar Slide" value={form.image} onChange={(url) => setForm({ ...form, image: url })} accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.avif" error={formErrors.image?.[0]} required />
          <Input id="hero-heading" label="Heading" value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} error={formErrors.heading?.[0]} required />
          <Input id="hero-subheading" label="Subheading" value={form.subheading} onChange={(e) => setForm({ ...form, subheading: e.target.value })} error={formErrors.subheading?.[0]} required />
          <Input id="hero-caption" label="Caption" value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} error={formErrors.caption?.[0]} required />
          <div className="grid grid-cols-2 gap-4">
            <Input id="hero-order" label="Urutan" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} error={formErrors.order?.[0]} />
            <Select id="hero-status-f" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} />
          </div>
          <div className="bg-surface-muted rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-ink">CTA Tombol (opsional)</p>
            <p className="text-xs text-ink-soft">Isi keduanya atau kosongkan keduanya. URL harus berupa path internal (/kontak) atau https://...</p>
            <div className="grid grid-cols-2 gap-4">
              <Input id="hero-btn-label" label="Label Tombol" value={form.button_label} onChange={(e) => setForm({ ...form, button_label: e.target.value })} error={formErrors.button_label?.[0]} />
              <Input id="hero-btn-url" label="URL Tombol" value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} error={formErrors.button_url?.[0]} placeholder="/kontak atau https://..." />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Slide" message={`Yakin menghapus slide "${deleteTarget?.heading}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
