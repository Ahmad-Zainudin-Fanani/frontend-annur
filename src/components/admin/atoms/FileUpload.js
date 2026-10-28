"use client";
import React, { useCallback, useRef, useState } from "react";
import { apiUpload } from "@/lib/admin/api";

export default function FileUpload({
  label,
  id,
  value,
  onChange,
  error,
  hint,
  accept = "image/*",
  required = false,
  disabled = false,
  className = "",
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [uploadError, setUploadError] = useState(null);
  const inputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;

      const MAX_SIZE = 10 * 1024 * 1024; // 10 MB – allow high‑resolution images
      const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/avif", "application/pdf"];

      if (file.size > MAX_SIZE) {
        setUploadError("Ukuran file maksimal 5 MB.");
        return;
      }
      if (!ALLOWED.includes(file.type)) {
        setUploadError("Tipe file tidak didukung. Gunakan JPG, PNG, WEBP, GIF, atau PDF.");
        return;
      }

      setUploadError(null);
      setUploading(true);

      try {
        const data = await apiUpload(file);
        setPreview(data.url);
        onChange?.(data.url, data.path);
      } catch (err) {
        setUploadError(err.message || "Upload gagal.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const displayError = error || uploadError;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors
          ${displayError ? "border-danger bg-danger-light/20" : "border-divider hover:border-primary/50 hover:bg-primary-light/30"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={disabled || uploading}
          className="sr-only"
        />

        {uploading ? (
          <div className="flex items-center justify-center py-4 gap-3">
            <svg className="animate-spin w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm text-ink-muted">Mengunggah...</span>
          </div>
        ) : preview && (preview.endsWith(".pdf") || preview.includes("pdf")) ? (
          <div className="flex items-center gap-3 py-2">
            <svg className="w-8 h-8 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-ink">File PDF terpilih</p>
              <p className="text-xs text-ink-soft truncate max-w-[200px]">{preview}</p>
            </div>
          </div>
        ) : preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full max-h-40 object-contain rounded-lg"
            />
            <p className="text-xs text-ink-soft text-center mt-2">Klik untuk ganti</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-2">
            <svg className="w-8 h-8 text-ink-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div className="text-center">
              <p className="text-sm font-medium text-ink">Klik atau seret file ke sini</p>
              <p className="text-xs text-ink-soft">JPG, PNG, WEBP, GIF, AVIF — maks. 10 MB (gambar kualitas tinggi)</p>
            </div>
          </div>
        )}
      </div>

      {displayError && (
        <p role="alert" className="text-xs text-danger">
          {displayError}
        </p>
      )}
      {hint && !displayError && (
        <p className="text-xs text-ink-soft">{hint}</p>
      )}
    </div>
  );
}
