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

const EMPTY_FORM = {
  name: "", subject: "", nip: "", role_title: "", education: "",
  bio: "", gender: "", experience: "", is_leadership: false,
  is_active: true, order: "", photo: "",
};

export default function GuruPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const res = await apiFetch(`/teachers?${params}`);
      setData(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

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
      name: item.name ?? "",
      subject: item.subject ?? "",
      nip: item.nip ?? "",
      role_title: item.role_title ?? "",
      education: item.education ?? "",
      bio: item.bio ?? "",
      gender: item.gender ?? "",
      experience: item.experience ?? "",
      is_leadership: !!item.is_leadership,
      is_active: item.is_active !== false,
      order: item.order ?? "",
      photo: item.photo ?? "",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        subject: form.subject,
        ...(form.nip && { nip: form.nip }),
        ...(form.role_title && { role_title: form.role_title }),
        ...(form.education && { education: form.education }),
        ...(form.bio && { bio: form.bio }),
        ...(form.gender && { gender: form.gender }),
        ...(form.experience && { experience: form.experience }),
        is_leadership: form.is_leadership,
        is_active: form.is_active,
        ...(form.order !== "" && { order: Number(form.order) }),
        ...(form.photo && { photo: form.photo }),
      };

      if (editItem) {
        await apiFetch(`/teachers/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Data guru berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/teachers", { method: "POST", body: payload });
        toast({ message: "Guru baru berhasil ditambahkan.", type: "success" });
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

  const askDelete = (item) => {
    setDeleteTarget(item);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await apiFetch(`/teachers/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Guru berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      setDeleteTarget(null);
      load();
    } catch (err) {
      // Teacher with principal history cannot be deleted (422)
      if (err.status === 422) {
        toast({ message: err.message || "Guru ini pernah menjadi kepala sekolah dan tidak dapat dihapus. Nonaktifkan saja.", type: "warning" });
        setConfirmOpen(false);
      } else {
        toast({ message: err.message, type: "error" });
      }
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    { key: "photo", header: "Foto", render: (row) => row.photo ? (
      <img src={row.photo} alt={row.name} className="w-8 h-8 rounded-full object-cover border border-divider" />
    ) : (
      <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center text-xs font-bold text-ink-faint">
        {row.name?.charAt(0)?.toUpperCase()}
      </div>
    )},
    { key: "name", header: "Nama", render: (row) => (
      <div>
        <p className="font-medium text-ink">{row.name}</p>
        {row.role_title && <p className="text-xs text-ink-soft">{row.role_title}</p>}
      </div>
    )},
    { key: "subject", header: "Mata Pelajaran" },
    { key: "gender", header: "Gender", render: (row) => row.gender === "L" ? "Laki-laki" : row.gender === "P" ? "Perempuan" : "—" },
    { key: "is_leadership", header: "Pimpinan", render: (row) => row.is_leadership ? <Badge status="active" label="Ya" /> : "—" },
    { key: "is_active", header: "Status", render: (row) => <Badge status={row.is_active ? "active" : "inactive"} /> },
    { key: "actions", header: "Aksi", render: (row) => (
      <div className="flex gap-2">
        <Button size="xs" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
        <Button size="xs" variant="danger-ghost" onClick={() => askDelete(row)}>Hapus</Button>
      </div>
    )},
  ];

  return (
    <div>
      <PageHeader
        title="Guru"
        description="Kelola data tenaga pendidik SD Plus An-Nur"
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Guru" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Guru</Button>}
      />

      <div className="flex gap-3 mb-4">
        <Input
          id="guru-search"
          placeholder="Cari nama guru..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <DataTable
          columns={columns}
          data={data}
          keyExtractor={(r) => r.id}
          loading={loading}
          emptyState={<EmptyState title="Belum ada guru" description="Tambahkan data guru pertama." action={<Button onClick={openCreate} size="sm">+ Tambah Guru</Button>} />}
        />
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? "Edit Guru" : "Tambah Guru"} size="lg">
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="guru-name" label="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={formErrors.name?.[0]} required />
            <Input id="guru-subject" label="Mata Pelajaran" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} error={formErrors.subject?.[0]} required />
            <Input id="guru-nip" label="NIP" value={form.nip} onChange={(e) => setForm({ ...form, nip: e.target.value })} error={formErrors.nip?.[0]} />
            <Input id="guru-role-title" label="Jabatan" value={form.role_title} onChange={(e) => setForm({ ...form, role_title: e.target.value })} error={formErrors.role_title?.[0]} />
            <Select id="guru-gender" label="Jenis Kelamin" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
              options={[{ value: "L", label: "Laki-laki" }, { value: "P", label: "Perempuan" }]}
              error={formErrors.gender?.[0]} placeholder="Pilih jenis kelamin"
            />
            <Input id="guru-order" label="Urutan" type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} error={formErrors.order?.[0]} />
            <Input id="guru-education" label="Pendidikan" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })} error={formErrors.education?.[0]} />
            <Input id="guru-experience" label="Pengalaman" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} error={formErrors.experience?.[0]} />
          </div>
          <Textarea id="guru-bio" label="Bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} error={formErrors.bio?.[0]} rows={3} />

          <FileUpload id="guru-photo" label="Foto" value={form.photo} onChange={(url) => setForm({ ...form, photo: url })} accept="image/*" error={formErrors.photo?.[0]} />

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_leadership} onChange={(e) => setForm({ ...form, is_leadership: e.target.checked })} className="rounded border-divider text-primary focus:ring-primary" />
              Pimpinan / Struktural
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-divider text-primary focus:ring-primary" />
              Aktif
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-divider">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Batal</Button>
            <Button type="submit" variant="primary" size="sm" loading={saving}>{editItem ? "Simpan" : "Tambah"}</Button>
          </div>
        </form>
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Guru"
        message={`Yakin ingin menghapus "${deleteTarget?.name}"? Guru dengan riwayat kepala sekolah tidak dapat dihapus.`}
        confirmLabel="Hapus"
        loading={deleting}
      />
    </div>
  );
}
