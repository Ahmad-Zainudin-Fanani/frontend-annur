"use client";

import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Input from "@/components/admin/atoms/Input";
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

const EMPTY_FORM = {
  name: "",
  position: "",
  parent_id: "",
  order: "",
  status: "published",
};

export default function StrukturOrganisasiPage() {
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
      const response = await apiFetch("/organization-structures?status=all");
      setData(response.data ?? []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an async request and updates its loading state.
    load();
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
      position: item.position ?? "",
      parent_id: item.parent_id ?? "",
      order: item.order ?? "",
      status: item.status ?? "published",
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setFormErrors({});
    setSaving(true);

    const payload = {
      ...form,
      name: form.name.trim(),
      position: form.position.trim(),
      parent_id: form.parent_id || null,
      order: form.order === "" ? 0 : Number(form.order),
    };

    try {
      if (editItem) {
        await apiFetch(`/organization-structures/${editItem.id}`, { method: "PUT", body: payload });
        toast({ message: "Struktur organisasi berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/organization-structures", { method: "POST", body: payload });
        toast({ message: "Struktur organisasi berhasil ditambahkan.", type: "success" });
      }

      setModalOpen(false);
      await load();
    } catch (saveError) {
      if (saveError.errors) setFormErrors(saveError.errors);
      else toast({ message: saveError.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await apiFetch(`/organization-structures/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Struktur organisasi berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      await load();
    } catch (deleteError) {
      toast({ message: deleteError.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleData = data.filter((item) => (
    (filterStatus === "all" || item.status === filterStatus)
    && (!normalizedSearch || `${item.name} ${item.position}`.toLowerCase().includes(normalizedSearch))
  ));

  const parentOptions = [
    { value: "", label: "Tanpa induk" },
    ...data
      .filter((item) => item.id !== editItem?.id)
      .map((item) => ({ value: item.id, label: `${item.position} — ${item.name}` })),
  ];

  const columns = [
    { key: "position", header: "Jabatan", render: (row) => <p className="font-medium text-ink">{row.position}</p> },
    { key: "name", header: "Nama" },
    {
      key: "parent_id",
      header: "Atasan / Induk",
      render: (row) => data.find((item) => item.id === row.parent_id)?.position ?? "—",
    },
    { key: "order", header: "Urutan" },
    { key: "status", header: "Status", render: (row) => <Badge status={row.status} /> },
    {
      key: "actions",
      header: "Aksi",
      render: (row) => (
        <div className="flex gap-2">
          <Button size="xs" variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
          <Button size="xs" variant="danger-ghost" onClick={() => { setDeleteTarget(row); setConfirmOpen(true); }}>Hapus</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Struktur Organisasi Yayasan"
        description="Kelola pengurus yayasan dan hubungan jabatan secara bertingkat."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Struktur Yayasan" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Pengurus</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          id="struktur-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari nama atau jabatan"
          className="w-full sm:max-w-xs"
        />
        <Select
          id="struktur-status"
          value={filterStatus}
          onChange={(event) => setFilterStatus(event.target.value)}
          options={[{ value: "all", label: "Semua Status" }, ...STATUS_OPTIONS]}
          placeholder=""
          className="w-44"
        />
      </div>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <DataTable
          columns={columns}
          data={visibleData}
          keyExtractor={(row) => row.id}
          loading={loading}
          emptyState={(
            <EmptyState
              title="Belum ada struktur organisasi"
              action={<Button onClick={openCreate} size="sm">+ Tambah Pengurus</Button>}
            />
          )}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Pengurus" : "Tambah Pengurus"}
        size="md"
      >
        <form onSubmit={handleSave} noValidate className="space-y-4">
          <Input
            id="struktur-name"
            label="Nama"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            error={formErrors.name?.[0]}
            required
          />
          <Input
            id="struktur-position"
            label="Jabatan"
            value={form.position}
            onChange={(event) => updateField("position", event.target.value)}
            error={formErrors.position?.[0]}
            required
          />
          <Select
            id="struktur-parent"
            label="Atasan / Induk"
            value={form.parent_id}
            onChange={(event) => updateField("parent_id", event.target.value)}
            options={parentOptions}
            placeholder=""
            error={formErrors.parent_id?.[0]}
            hint="Pilih jabatan di atasnya, atau pilih Tanpa induk untuk posisi teratas."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="struktur-order"
              label="Urutan"
              type="number"
              min="0"
              value={form.order}
              onChange={(event) => updateField("order", event.target.value)}
              error={formErrors.order?.[0]}
            />
            <Select
              id="struktur-status"
              label="Status"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
              options={STATUS_OPTIONS}
              placeholder=""
              error={formErrors.status?.[0]}
            />
          </div>
          <div className="flex justify-end gap-3 border-t border-divider pt-4">
            <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
              Batal
            </Button>
            <Button type="submit" size="sm" loading={saving}>
              {editItem ? "Simpan Perubahan" : "Tambah Pengurus"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Pengurus"
        message={`Yakin menghapus "${deleteTarget?.name}"? Jabatan di bawahnya akan menjadi posisi tanpa induk.`}
        confirmLabel="Hapus"
        loading={deleting}
      />
    </div>
  );
}
