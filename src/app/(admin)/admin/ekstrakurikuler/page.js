"use client";

import React, { useCallback, useEffect, useState } from "react";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Input from "@/components/admin/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import DataTable from "@/components/admin/organisms/DataTable";
import Pagination from "@/components/admin/molecules/Pagination";
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
  title: "",
  description: "",
  status: "published",
  order: "",
};

const PER_PAGE = 10;
const WIZARD_STEPS = ["Informasi", "Foto", "Ringkasan"];

function getImageError(errors) {
  if (errors.images?.[0]) return errors.images[0];

  return Object.entries(errors).find(([field]) => field.startsWith("images."))?.[1]?.[0];
}

export default function EkstrakurikulerPage() {
  const toast = useToast();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const [imageViewerItem, setImageViewerItem] = useState(null);
  const [imageViewerData, setImageViewerData] = useState([]);
  const [imageViewerMeta, setImageViewerMeta] = useState(null);
  const [imageViewerPage, setImageViewerPage] = useState(1);
  const [imageViewerLoading, setImageViewerLoading] = useState(false);
  const [imageViewerError, setImageViewerError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [images, setImages] = useState([]);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingAltText, setPendingAltText] = useState("");
  const [uploadKey, setUploadKey] = useState(0);
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
      params.set("page", String(page));
      params.set("per_page", String(PER_PAGE));
      if (filterStatus !== "all") params.set("status", filterStatus);

      const response = await apiFetch("/extracurriculars?" + params);
      const responseMeta = response.meta ?? null;
      if (responseMeta && responseMeta.current_page > responseMeta.last_page) {
        setPage(responseMeta.last_page || 1);
        return;
      }
      setData(response.data ?? []);
      setMeta(responseMeta);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, page]);

  useEffect(() => {
    load();
  }, [load]);

  const loadImageViewer = useCallback(async () => {
    if (!imageViewerItem) {
      return;
    }

    setImageViewerLoading(true);
    setImageViewerError(null);

    try {
      const params = new URLSearchParams({ page: String(imageViewerPage), per_page: String(PER_PAGE) });
      const response = await apiFetch("/extracurriculars/" + imageViewerItem.id + "/images?" + params);
      const responseMeta = response.meta ?? null;
      if (responseMeta && responseMeta.current_page > responseMeta.last_page) {
        setImageViewerPage(responseMeta.last_page || 1);
        return;
      }
      setImageViewerData(response.data ?? []);
      setImageViewerMeta(responseMeta);
    } catch (loadError) {
      setImageViewerError(loadError.message);
    } finally {
      setImageViewerLoading(false);
    }
  }, [imageViewerItem, imageViewerPage]);

  useEffect(() => {
    loadImageViewer();
  }, [loadImageViewer]);

  const openImageViewer = (item) => {
    setImageViewerItem(item);
    setImageViewerData([]);
    setImageViewerMeta(null);
    setImageViewerPage(1);
    setImageViewerError(null);
  };

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setImages([]);
    setPendingImage(null);
    setPendingAltText("");
    setWizardStep(1);
    setUploadKey((key) => key + 1);
    setFormErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      status: item.status ?? "published",
      order: item.order ?? "",
    });
    setImages((item.images ?? []).map((image, index) => ({
      path: image.path ?? "",
      url: image.url ?? image.path ?? "",
      alt_text: image.alt_text ?? "",
      order: image.order ?? index,
    })));
    setPendingImage(null);
    setPendingAltText("");
    setWizardStep(1);
    setUploadKey((key) => key + 1);
    setFormErrors({});
    setModalOpen(true);
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleNext = () => {
    if (!form.title.trim()) {
      setFormErrors((current) => ({
        ...current,
        title: ["Nama ekstrakurikuler wajib diisi."],
      }));
      setWizardStep(1);
      return;
    }

    setWizardStep((step) => Math.min(step + 1, WIZARD_STEPS.length));
  };

  const addImage = () => {
    if (!pendingImage?.path) {
      setFormErrors((current) => ({
        ...current,
        images: ["Unggah foto sebelum menambahkannya ke daftar."],
      }));
      return;
    }

    setImages((current) => [
      ...current,
      {
        path: pendingImage.path,
        url: pendingImage.url,
        alt_text: pendingAltText.trim(),
        order: current.length,
      },
    ]);
    setPendingImage(null);
    setPendingAltText("");
    setUploadKey((key) => key + 1);
    setFormErrors((current) => ({ ...current, images: undefined }));
  };

  const removeImage = (indexToRemove) => {
    setImages((current) => current
      .filter((_, index) => index !== indexToRemove)
      .map((image, index) => ({ ...image, order: index })));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setFormErrors({});
    setSaving(true);

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim() || null,
      order: form.order === "" ? 0 : Number(form.order),
      images: images.map((image, index) => ({
        path: image.path,
        alt_text: image.alt_text || null,
        order: index,
      })),
    };

    try {
      if (editItem) {
        await apiFetch(`/extracurriculars/${editItem.id}`, {
          method: "PUT",
          body: payload,
        });
        toast({ message: "Ekstrakurikuler berhasil diperbarui.", type: "success" });
      } else {
        await apiFetch("/extracurriculars", { method: "POST", body: payload });
        toast({ message: "Ekstrakurikuler berhasil ditambahkan.", type: "success" });
      }

      setModalOpen(false);
      await load();
    } catch (saveError) {
      if (saveError.errors) {
        setFormErrors(saveError.errors);
        const hasDetailsError = ["title", "description", "status", "order"]
          .some((field) => saveError.errors[field]);
        const hasImagesError = Object.keys(saveError.errors)
          .some((field) => field.startsWith("images"));
        setWizardStep(hasDetailsError ? 1 : hasImagesError ? 2 : wizardStep);
      } else {
        toast({ message: saveError.message, type: "error" });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await apiFetch(`/extracurriculars/${deleteTarget.id}`, { method: "DELETE" });
      toast({ message: "Ekstrakurikuler berhasil dihapus.", type: "success" });
      setConfirmOpen(false);
      await load();
    } catch (deleteError) {
      toast({ message: deleteError.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      key: "images",
      header: "Foto",
      render: (row) => {
        const imageCount = row.images?.length ?? 0;
        const cover = row.images?.[0];
        return cover?.url || cover?.path ? (
          <div className="flex items-center gap-2">
            <img
              src={cover.url || cover.path}
              alt={cover.alt_text || row.title}
              className="h-12 w-16 rounded-lg border border-divider object-cover"
            />
            <button type="button" onClick={() => openImageViewer(row)} className="text-xs font-medium text-primary hover:underline">
              {imageCount} foto
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => openImageViewer(row)} className="text-xs font-medium text-primary hover:underline">
            0 foto
          </button>
        );
      },
    },
    { key: "title", header: "Nama", render: (row) => <p className="font-medium text-ink">{row.title}</p> },
    { key: "description", header: "Deskripsi", render: (row) => <p className="max-w-xs truncate text-sm text-ink-muted">{row.description || "—"}</p> },
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
        title="Ekstrakurikuler"
        description="Kelola kegiatan ekstrakurikuler dan beberapa foto untuk setiap kegiatan."
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Ekstrakurikuler" }]}
        actions={<Button onClick={openCreate} size="sm">+ Tambah Ekstrakurikuler</Button>}
      />

      <div className="mb-4 flex flex-wrap gap-3">
        <Select
          id="ekstrakurikuler-status"
          value={filterStatus}
          onChange={(event) => { setFilterStatus(event.target.value); setPage(1); }}
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
          data={data}
          keyExtractor={(row) => row.id}
          loading={loading}
          emptyState={(
            <EmptyState
              title="Belum ada ekstrakurikuler"
              action={<Button onClick={openCreate} size="sm">+ Tambah</Button>}
            />
          )}
          footer={meta && <Pagination meta={meta} onPageChange={setPage} />}
        />
      )}

      <Modal
        open={Boolean(imageViewerItem)}
        onClose={() => setImageViewerItem(null)}
        title={"Foto " + (imageViewerItem?.title ?? "Ekstrakurikuler")}
        size="lg"
      >
        {imageViewerError ? (
          <ErrorState message={imageViewerError} onRetry={loadImageViewer} />
        ) : imageViewerLoading ? (
          <p role="status" className="py-8 text-center text-sm text-ink-soft">Memuat foto...</p>
        ) : imageViewerData.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {imageViewerData.map((image) => (
              <li key={image.id} className="overflow-hidden rounded-lg border border-divider">
                <img src={image.url || image.path} alt={image.alt_text || "Foto ekstrakurikuler"} className="h-48 w-full object-cover" />
                <p className="truncate px-3 py-2 text-sm text-ink-soft">{image.alt_text || image.path}</p>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Belum ada foto" description="Ekstrakurikuler ini belum memiliki gambar." />
        )}
        {!imageViewerLoading && !imageViewerError && imageViewerMeta && (
          <Pagination meta={imageViewerMeta} onPageChange={setImageViewerPage} />
        )}
      </Modal>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? "Edit Ekstrakurikuler" : "Tambah Ekstrakurikuler"}
        size="lg"
      >
        <form onSubmit={handleSave} noValidate className="space-y-5">
          <ol className="grid grid-cols-3 gap-2" aria-label="Langkah formulir">
            {WIZARD_STEPS.map((label, index) => {
              const step = index + 1;
              const active = wizardStep === step;
              const completed = wizardStep > step;

              return (
                <li
                  key={label}
                  aria-current={active ? "step" : undefined}
                  className={`rounded-lg border px-3 py-2 text-center text-xs font-medium ${
                    active || completed
                      ? "border-primary bg-primary-light text-primary"
                      : "border-divider bg-white text-ink-soft"
                  }`}
                >
                  <span className="mr-1">{step}.</span>{label}
                </li>
              );
            })}
          </ol>

          {wizardStep === 1 && (
            <div className="space-y-4">
              <Input
                id="extra-title"
                label="Nama Ekstrakurikuler"
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                error={formErrors.title?.[0]}
                required
              />
              <Textarea
                id="extra-description"
                label="Deskripsi"
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
                error={formErrors.description?.[0]}
                rows={4}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="extra-order"
                  label="Urutan"
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(event) => updateField("order", event.target.value)}
                  error={formErrors.order?.[0]}
                />
                <Select
                  id="extra-status"
                  label="Status"
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  options={STATUS_OPTIONS}
                  placeholder=""
                  error={formErrors.status?.[0]}
                />
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-ink">Tambah foto satu per satu</h3>
                <p className="mt-1 text-xs text-ink-soft">Foto bersifat opsional. Unggah satu foto, tambahkan ke daftar, lalu unggah foto berikutnya.</p>
              </div>

              <FileUpload
                key={uploadKey}
                id="extra-image"
                label="Foto Ekstrakurikuler"
                value={pendingImage?.url ?? null}
                onChange={(url, path) => setPendingImage({ url, path })}
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif,.avif"
                error={getImageError(formErrors)}
                hint="Setiap foto diunggah melalui endpoint upload yang sama."
              />

              <Input
                id="extra-image-alt"
                label="Teks alternatif (opsional)"
                value={pendingAltText}
                onChange={(event) => setPendingAltText(event.target.value)}
                hint="Deskripsi singkat foto untuk aksesibilitas."
              />

              <Button type="button" variant="secondary" onClick={addImage} disabled={!pendingImage?.path}>
                + Tambahkan Foto {images.length + 1}
              </Button>

              {images.length > 0 ? (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {images.map((image, index) => (
                    <li key={`${image.path}-${index}`} className="flex items-center gap-3 rounded-lg border border-divider p-2">
                      <img
                        src={image.url || image.path}
                        alt={image.alt_text || `Foto ${index + 1}`}
                        className="h-16 w-20 rounded-md object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink">Foto {index + 1}</p>
                        <p className="truncate text-xs text-ink-soft">{image.alt_text || image.path}</p>
                      </div>
                      <Button type="button" size="xs" variant="danger-ghost" onClick={() => removeImage(index)}>
                        Hapus
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="rounded-lg bg-surface-muted px-3 py-2 text-sm text-ink-soft">Belum ada foto. Anda bisa lanjut tanpa foto.</p>
              )}
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-xl bg-surface-muted p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">Ekstrakurikuler</p>
                <h3 className="mt-1 text-lg font-semibold text-ink">{form.title || "—"}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-ink-muted">{form.description || "Tidak ada deskripsi."}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <Badge status={form.status} />
                  <span className="text-ink-soft">Urutan: {form.order || 0}</span>
                  <span className="text-ink-soft">{images.length} foto</span>
                </div>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {images.map((image, index) => (
                    <div key={`${image.path}-${index}`} className="overflow-hidden rounded-lg border border-divider">
                      <img
                        src={image.url || image.path}
                        alt={image.alt_text || `Foto ${index + 1}`}
                        className="h-28 w-full object-cover"
                      />
                      <p className="truncate px-2 py-1.5 text-xs text-ink-soft">{image.alt_text || `Foto ${index + 1}`}</p>
                    </div>
                  ))}
                </div>
              )}
              {getImageError(formErrors) && <p role="alert" className="text-sm text-danger">{getImageError(formErrors)}</p>}
            </div>
          )}

          <div className="flex flex-wrap justify-between gap-3 border-t border-divider pt-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={wizardStep === 1 || saving}
              onClick={() => setWizardStep((step) => Math.max(step - 1, 1))}
            >
              Kembali
            </Button>
            <div className="ml-auto flex gap-3">
              <Button type="button" variant="secondary" size="sm" onClick={() => setModalOpen(false)} disabled={saving}>
                Batal
              </Button>
              {wizardStep < WIZARD_STEPS.length ? (
                <Button type="button" size="sm" onClick={handleNext}>
                  Lanjut
                </Button>
              ) : (
                <Button type="submit" size="sm" loading={saving}>
                  {editItem ? "Simpan Perubahan" : "Simpan Ekstrakurikuler"}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Hapus Ekstrakurikuler"
        message={`Yakin menghapus "${deleteTarget?.title}" beserta daftar fotonya?`}
        confirmLabel="Hapus"
        loading={deleting}
      />
    </div>
  );
}
