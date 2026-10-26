const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new Error(
      result?.message || `Request API gagal: HTTP ${response.status}`
    );
  }

  return result?.data;
}

function withQuery(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export const publicApi = {
  // Profil dan informasi sekolah
  profile: () => request("/profile"),
  stats: () => request("/stats"),

  // Konten publik
  teachers: (params = {}) =>
    request(`/teachers${withQuery(params)}`),

  achievements: (params = {}) =>
    request(`/achievements${withQuery(params)}`),

  competitions: (params = {}) =>
    request(`/competitions${withQuery(params)}`),

  curriculums: () => request("/curriculums"),

  galleries: (params = {}) =>
    request(`/galleries${withQuery(params)}`),

  // Formulir kontak / CRM
  submitContact: (payload) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};