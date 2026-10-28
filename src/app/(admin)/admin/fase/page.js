"use client";
import React, { useEffect, useState, useCallback } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Input from "@/components/admin/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import DataTable from "@/components/admin/organisms/DataTable";
import Modal from "@/components/admin/organisms/Modal";
import { ConfirmDialog } from "@/components/admin/organisms/Modal";
import { EmptyState, ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

const STATUS_OPTIONS = [
  { value: "published", label: "Terbit" },
  { value: "draft", label: "Draf" },
];

const EMPTY_FORM = { title: "", phase_name: "", description: "", status: "published", code: "", order: "" };

export default function FasePage() {
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
      const res = await apiFetch(`/phases?${params}`);
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
    setEditItem(item);
    setForm({ title: item.title ?? "", phase_name: item.phase_name ?? "", description: item.description ?? "", status: item.status ?? "published", code: item.code ?? "", order: item.order ?? "" });
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
        await apiFetch(`/phases/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Fase berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/phases", { method: "POST", body: payload });
        toast({ message: "Fase berhasil ditambahkan.", type: "success" });
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
      await apiFetch(`/phases/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Fase berhasil dihapus.", type: "success" });
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
    { key: "phase_name", header: "Nama Fase" },
    { key: "title", header: "Judul", render: (row) => <p className="font-medium text-ink">{row.title}</p> },
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
        title="Fase"
        description="Kelola fase kurikulum dan pembelajaran"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Fase" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Fase</Button>}
      />
      <div className="flex gap-3 mb-4">
        <Select id="fase-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          options={[{ value: "all", label: "Semua Status" }, ...STATUS_OPTIONS]} placeholder="" className="w-44" />
      </div>
      {error ? <ErrorState message={error} onRetry={load} /> : (
        <DataTable columns={columns} data={data} keyExtractor={(r) => r.id} loading={loading}
          emptyState={<EmptyState title="Belum ada fase" action={<Button onClick={openCreate} size="sm">+ Tambah</Button>} />}
        />
      )}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Fase" : "Tambah Fase"} size="md">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="fase-code" label="Kode" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} error={formErrors.code?.[0]} />
            <Input id="fase-order" label="Urutan" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} error={formErrors.order?.[0]} />
          </div>
          <Input id="fase-phase-name" label="Nama Fase" value={form.phase_name} onChange={(e) => setForm({ ...form, phase_name: e.target.value })} error={formErrors.phase_name?.[0]} required />
          <Input id="fase-title" label="Judul" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={formErrors.title?.[0]} required />
          <Textarea id="fase-desc" label="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} error={formErrors.description?.[0]} required rows={4} />
          <Select id="fase-status-f" label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} options={STATUS_OPTIONS} placeholder="" error={formErrors.status?.[0]} />
          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={handleDelete}
        title="Hapus Fase" message={`Yakin menghapus "${deleteTarget?.title}"?`} confirmLabel="Hapus" loading={deleting}
      />
    </div>
  );
}
