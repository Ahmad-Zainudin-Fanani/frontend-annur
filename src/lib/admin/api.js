/**
 * Fetch wrapper for BFF admin proxy.
 * All requests go to /api/admin/* (never directly to Laravel from the browser).
 */

export async function apiFetch(path, options = {}) {
  const { method = "GET", body, isFormData = false } = options;

  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`/api/admin${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
  });

  if (res.status === 401) {
    // Session expired — redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sesi tidak valid. Silakan login kembali.");
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.errors = data?.errors ?? null;
    throw err;
  }

  return data;
}

export async function apiUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/upload", { method: "POST", body: formData, isFormData: true });
}
