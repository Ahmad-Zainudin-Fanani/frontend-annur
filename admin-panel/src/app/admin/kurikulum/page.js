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
import { EmptyState, ErrorState } from "@/components/atoms/States";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/context/ToastContext";

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = { title: "", description: "", status: "published", subtitle: "", code: "", order: "" };

export default function KurikulumPage() {
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
      const res = await apiFetch(`/curriculum-pillars?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setFormErrors({}); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ title: item.title ?? "", description: item.description ?? "", status: item.status ?? "published", subtitle: item.subtitle ?? "", code: item.code ?? "", order: item.order ?? "" });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      const payload = { ...form, ...(form.order !== "" && { order: Number(form.order) }) };
      if (editItem) {
        await apiFetch(`/curriculum-pillars/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Pilar berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/curriculum-pillars", { method: "POST", body: payload });
        toast({ message: "Pilar berhasil ditambahkan.", type: "success" });
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
      await apiFetch(`/curriculum-pillars/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Pilar berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      load();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "code", header: "Kode", render: (row) => row.code ? <span className="font-mono text-xs bg-surface-muted px-1.5 py-0.5 rounded">{row.code}</span> : "—" },
    { key: "title", header: "Judul", render: (row) => <p className="font-medium text-ink">{row.title}</p> },
    { key: "subtitle", header: "Subjudul" },
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
        title="Pilar Kurikulum"
        description="Kelola pilar-pilar kurikulum sekolah"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Pilar Kurikulum" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Pilar</Button>}
      />
      <div className="flex gap-3 mb-4">
        <Select id="kurikulum-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, { value: "published", label: "Terbit" }, { value: "draft", label: "Draf" }]}
          placeholder="" className="w-44" />
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada pilar kurikulum" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Pilar" : "Tambah Pilar"} size="md">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="kur-code" label="Kode" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} error={formErrors.code?.[0]} />
            <Input id="kur-order" label="Urutan" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} error={formErrors.order?.[0]} />
          </div>
          <Input id="kur-title" label="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={formErrors.title?.[0]} required />
          <Input id="kur-subtitle" label="Subjudul" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} error={formErrors.subtitle?.[0]} />
          <Textarea id="kur-desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description?.[0]} required rows={4} />
          <Select id="kur-status" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} />
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Pilar" message={`Yakin menghapus "${deleteTarget?.title}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
