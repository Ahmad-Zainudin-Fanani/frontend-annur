/**
 * Fetch wrapper for BFF admin proxy.
 * All requests go to /api/admin/* (never directly to Laravel from the browser).
 */

const CMS_RESOURCES = new Set([
  "profile", "teachers", "achievements", "competitions", "curriculum-pillars",
  "phases", "hero-slides", "galleries", "extracurriculars", "organization-structures",
]);
const TTL = 30_000;
const MAX_ENTRIES = 100;
const snapshots = new Map();
const pending = new Map();
let scope = null;
let generation = 0;
let sessionRevision = 0;
let storageRevision = 0;
let listenersReady = false;
let needsFocusRevalidation = false;
let channel = null;

function clearStorage() {
  storageRevision += 1;
  snapshots.clear();
  pending.clear();
}

function invalidate() {
  generation += 1;
  clearStorage();
}

function invalidateSession() {
  sessionRevision += 1;
  invalidate();
}

function broadcast(type) {
  try {
    channel?.postMessage({ type });
  } catch {
    // Cross-tab coordination is best-effort; local invalidation still applies.
  }
}

function browserReady() {
  if (typeof window === "undefined") return false;
  if (!listenersReady) {
    listenersReady = true;
    const suspend = () => {
      needsFocusRevalidation = true;
      clearStorage();
    };
    const resume = () => {
      clearStorage();
      needsFocusRevalidation = false;
    };
    window.addEventListener("blur", suspend);
    window.addEventListener("focus", resume);
    window.addEventListener("pageshow", resume);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") suspend();
      else resume();
    });
    try {
      if (typeof window.BroadcastChannel === "function") {
        channel = new window.BroadcastChannel("annur-admin-cache");
        channel.onmessage = ({ data }) => {
          if (data?.type === "session-change") {
            // Never trust another tab's identity; wait for local auth revalidation.
            scope = null;
            invalidateSession();
          } else if (data?.type === "invalidate") {
            invalidate();
          }
        };
      }
    } catch {
      channel = null;
    }
  }
  return true;
}

/** Local initialization is silent; explicit session operations opt into broadcast. */
export function setAdminCacheScope(userId, { broadcast: notify = false } = {}) {
  if (!browserReady()) return;
  const nextScope = userId == null ? null : String(userId);
  if (nextScope === scope && !notify) return;
  scope = nextScope;
  invalidateSession();
  if (notify) broadcast("session-change");
}

function canCache() {
  return scope !== null && !needsFocusRevalidation &&
    document.visibilityState !== "hidden" &&
    (typeof document.hasFocus !== "function" || document.hasFocus());
}

function cmsKey(path) {
  // Match only actual CMS routes, not lookalike prefixes or normalized traversal.
  if (typeof path !== "string" || !path.startsWith("/") || path.includes("#")) return null;
  const [pathname, query = ""] = path.split(/\?(.*)/s);
  const segments = pathname.slice(1).split("/");
  if (!CMS_RESOURCES.has(segments[0]) || segments.some((segment) =>
    segment === "." || segment === ".." || /[%\\\\]/.test(segment))) return null;
  const params = new URLSearchParams(query);
  // Stable sorting preserves ordering of repeated values (which may be meaningful).
  params.sort();
  const search = params.toString();
  return `${pathname}${search ? `?${search}` : ""}`;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

async function request(path, options, method) {
  const { body, isFormData = false, signal } = options;

  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`/api/admin${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    cache: "no-store",
    ...(signal ? { signal } : {}),
  });

  if (res.status === 401 || res.status === 403) {
    setAdminCacheScope(null, { broadcast: true });
  } else if (res.ok && method !== "GET" && method !== "HEAD") {
    invalidate();
    broadcast("invalidate");
  }

  if (res.status === 401) {
    // Session expired — redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Sesi tidak valid. Silakan login kembali.");
  }

  let json = true;
  const data = await res.json().catch(() => {
    json = false;
    return null;
  });

  if (!res.ok) {
    const err = new Error(data?.message || `HTTP ${res.status}`);
    err.status = res.status;
    err.errors = data?.errors ?? null;
    throw err;
  }

  return { data, json };
}

export async function apiFetch(path, options = {}) {
  const method = (options.method ?? "GET").toUpperCase();
  const browser = browserReady();
  const resourceKey = method === "GET" ? cmsKey(path) : null;
  const guarded = browser && resourceKey !== null;
  const requestScope = scope;
  const requestSession = sessionRevision;

  for (let attempt = 0; ; attempt += 1) {
    const shared = guarded && canCache() && options.cache !== false &&
      !options.signal && !options.body && !options.isFormData;
    const requestGeneration = generation;
    const requestStorage = storageRevision;
    const key = shared ? JSON.stringify([scope, resourceKey]) : null;

    if (shared) {
      const now = Date.now();
      for (const [entryKey, entry] of snapshots) {
        if (entry.expires <= now) snapshots.delete(entryKey);
      }
      const cached = snapshots.get(key);
      if (cached) return clone(cached.data);
    }

    const existing = shared ? pending.get(key) : null;
    const work = existing ?? request(path, options, method);
    if (shared && !existing && pending.size < MAX_ENTRIES) pending.set(key, work);
    try {
      const result = await work;
      // Even a switch away and back to the same user is a different session.
      if (guarded && (requestSession !== sessionRevision || requestScope !== scope)) {
        throw new Error("Sesi tidak valid. Silakan login kembali.");
      }
      if (guarded && requestGeneration !== generation) {
        // Retry a mutation race once, but never retry across a session change.
        if (attempt === 0) continue;
        throw new Error("Data tidak lagi valid. Silakan muat ulang.");
      }
      if (shared && !existing && requestStorage === storageRevision && canCache() &&
          result.json && result.data?.success !== false) {
        if (snapshots.size >= MAX_ENTRIES) snapshots.delete(snapshots.keys().next().value);
        snapshots.set(key, { data: clone(result.data), expires: Date.now() + TTL });
      }
      return shared ? clone(result.data) : result.data;
    } finally {
      // Never remove a newer request, including one installed after a focus change.
      if (shared && !existing && pending.get(key) === work) pending.delete(key);
    }
  }
}

export async function apiUpload(file) {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch("/upload", { method: "POST", body: formData, isFormData: true });
}
