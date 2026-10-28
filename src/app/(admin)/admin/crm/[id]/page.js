"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/molecules/PageHeader";
import Button from "@/components/admin/atoms/Button";
import Badge from "@/components/admin/atoms/Badge";
import Select from "@/components/admin/atoms/Select";
import Textarea from "@/components/admin/atoms/Textarea";
import { ErrorState } from "@/components/admin/atoms/States";
import { apiFetch } from "@/lib/admin/api";
import { useToast } from "@/context/admin/ToastContext";

const CRM_STATUS_OPTS = [
  { value: "new", label: "Baru" },
  { value: "contacted", label: "Dihubungi" },
  { value: "in_progress", label: "Diproses" },
  { value: "resolved", label: "Selesai" },
  { value: "closed", label: "Ditutup" },
];

const PRIORITY_OPTS = [
  { value: "low", label: "Rendah" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Tinggi" },
  { value: "urgent", label: "Mendesak" },
];

export default function CRMDetailPage({ params }) {
  const { id } = params;
  const toast = useToast();
  const router = useRouter();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status form
  const [statusForm, setStatusForm] = useState({ crm_status: "", priority: "", handled_by: "" });
  const [savingStatus, setSavingStatus] = useState(false);

  // Note form
  const [noteText, setNoteText] = useState("");
  const [noteError, setNoteError] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/contacts/${id}`);
      const c = res.data ?? res;
      setContact(c);
      setStatusForm({
        crm_status: c.crm_status ?? "new",
        priority: c.priority ?? "normal",
        handled_by: c.handled_by ?? "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Starts an async request and updates its loading state.
    load();
  }, [load]);

  const handleStatusSave = async (e) => {
    e.preventDefault();
    setSavingStatus(true);
    try {
      await apiFetch(`/contacts/${id}/status`, {
        method: "PATCH",
        body: statusForm,
      });
      toast({ message: "Status kontak berhasil diperbarui.", type: "success" });
      load();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setNoteError("");
    if (noteText.trim().length < 3) {
      setNoteError("Catatan minimal 3 karakter.");
      return;
    }
    if (noteText.length > 2000) {
      setNoteError("Catatan maksimal 2000 karakter.");
      return;
    }
    setSavingNote(true);
    try {
      await apiFetch(`/contacts/${id}/notes`, {
        method: "POST",
        body: { note: noteText },
      });
      toast({ message: "Catatan berhasil ditambahkan.", type: "success" });
      setNoteText("");
      load();
    } catch (err) {
      if (err.errors) setNoteError(err.errors?.note?.[0] ?? err.message);
      else toast({ message: err.message, type: "error" });
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Detail Kontak" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "CRM", href: "/admin/crm" }, { label: "Detail" }]} />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-divider p-5 animate-pulse space-y-3">
              <div className="skeleton h-5 w-40 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-3/4 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={load} />;
  }

  const notes = contact?.notes ?? [];
  const messages = contact?.messages ?? (contact?.message ? [{ content: contact.message, created_at: contact.created_at }] : []);

  return (
    <div>
      <PageHeader
        title={contact?.name ?? "Detail Kontak"}
        description={contact?.email}
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "CRM", href: "/admin/crm" }, { label: contact?.name ?? "Detail" }]}
        actions={
          <Button variant="secondary" size="sm" onClick={() => router.push("/admin/crm")}>
            ← Kembali
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact info + status */}
        <div className="lg:col-span-1 space-y-4">
          {/* Info Card */}
          <div className="bg-white rounded-xl border border-divider p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Informasi Kontak</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-ink-soft">Nama</p>
                <p className="font-medium text-ink">{contact?.name}</p>
              </div>
              <div>
                <p className="text-xs text-ink-soft">Email</p>
                <p className="text-ink">{contact?.email}</p>
              </div>
              {contact?.phone && (
                <div>
                  <p className="text-xs text-ink-soft">Telepon</p>
                  <p className="text-ink">{contact.phone}</p>
                </div>
              )}
              {contact?.subject && (
                <div>
                  <p className="text-xs text-ink-soft">Subjek</p>
                  <p className="text-ink">{contact.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-ink-soft">Tanggal Masuk</p>
                <p className="text-ink">
                  {contact?.created_at ? new Date(contact.created_at).toLocaleDateString("id-ID", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "—"}
                </p>
              </div>
              <div className="flex gap-2 pt-1">
                <Badge status={contact?.crm_status} />
                <Badge status={contact?.priority} />
              </div>
            </div>
          </div>

          {/* Status form */}
          <div className="bg-white rounded-xl border border-divider p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Perbarui Status</h2>
            <form onSubmit={handleStatusSave} className="space-y-3">
              <Select id="crm-detail-status" label="Status CRM" value={statusForm.crm_status}
                onChange={(e) => setStatusForm({ ...statusForm, crm_status: e.target.value })}
                options={CRM_STATUS_OPTS} placeholder="" />
              <Select id="crm-detail-priority" label="Prioritas" value={statusForm.priority}
                onChange={(e) => setStatusForm({ ...statusForm, priority: e.target.value })}
                options={PRIORITY_OPTS} placeholder="" />
              <div className="flex flex-col gap-1.5">
                <label htmlFor="crm-handled-by" className="text-sm font-medium text-ink">Ditangani Oleh</label>
                <input
                  id="crm-handled-by"
                  type="text"
                  placeholder="Nama penanggungjawab"
                  value={statusForm.handled_by}
                  onChange={(e) => setStatusForm({ ...statusForm, handled_by: e.target.value })}
                  className="w-full rounded-lg border border-divider px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <Button type="submit" variant="primary" size="sm" loading={savingStatus} className="w-full">
                Simpan Status
              </Button>
            </form>
          </div>
        </div>

        {/* Messages + Notes */}
        <div className="lg:col-span-2 space-y-4">
          {/* Messages */}
          <div className="bg-white rounded-xl border border-divider p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Pesan</h2>
            {messages.length === 0 ? (
              <p className="text-sm text-ink-soft">Tidak ada pesan.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className="bg-canvas-secondary rounded-xl p-4">
                    <p className="text-sm text-ink whitespace-pre-wrap">{msg.content ?? msg.message}</p>
                    <p className="text-xs text-ink-faint mt-2">
                      {msg.created_at ? new Date(msg.created_at).toLocaleString("id-ID") : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-divider p-5">
            <h2 className="text-sm font-semibold text-ink mb-4">Catatan Internal</h2>

            {/* Add note */}
            <form onSubmit={handleAddNote} className="mb-5">
              <Textarea
                id="crm-note"
                label="Tambah Catatan"
                placeholder="Tulis catatan tindak lanjut... (3–2000 karakter)"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                error={noteError}
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button type="submit" variant="primary" size="sm" loading={savingNote}>
                  + Tambah Catatan
                </Button>
              </div>
            </form>

            {/* Notes list */}
            {notes.length === 0 ? (
              <p className="text-sm text-ink-soft">Belum ada catatan.</p>
            ) : (
              <div className="space-y-3 divide-y divide-divider">
                {notes.map((note, i) => (
                  <div key={note.id ?? i} className="pt-3 first:pt-0">
                    <p className="text-sm text-ink whitespace-pre-wrap">{note.note}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {note.handler && (
                        <span className="text-xs text-ink-soft font-medium">{note.handler?.name ?? note.handled_by}</span>
                      )}
                      <span className="text-xs text-ink-faint">
                        {note.created_at ? new Date(note.created_at).toLocaleString("id-ID") : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
