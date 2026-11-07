export const PUBLIC_CACHE_SECONDS = 60;

export const PRIVATE_CACHE_HEADERS = {
  "Cache-Control": "private, no-store, max-age=0",
  Pragma: "no-cache",
  Vary: "Cookie",
};

export function privateJson(data, init = {}) {
  const headers = new Headers(init.headers);
  for (const [name, value] of Object.entries(PRIVATE_CACHE_HEADERS)) headers.set(name, value);
  return Response.json(data, { ...init, headers });
}

const PUBLIC_QUERIES = {
  profile: [],
  teachers: ["search", "subject", "page", "per_page"],
  achievements: ["category", "year", "search", "page", "per_page"],
  competitions: ["category"],
  curriculums: [],
  "curriculum-pillars": [],
  phases: [],
  "hero-slides": [],
  galleries: ["category", "page", "per_page"],
  extracurriculars: ["page", "per_page"],
  "organization-structures": [],
  stats: [],
};

const MUTATION_SCOPES = {
  profile: ["profile", "teachers", "stats"],
  teachers: ["teachers", "profile", "stats"],
  achievements: ["achievements", "stats"],
  competitions: ["competitions", "stats"],
  "curriculum-pillars": ["curriculum-pillars", "curriculums"],
  phases: ["phases", "curriculums"],
  "hero-slides": ["hero-slides"],
  galleries: ["galleries", "stats"],
  extracurriculars: ["extracurriculars", "extracurricular-images"],
  "organization-structures": ["organization-structures"],
};

export function getPublicCachePolicy(endpoint) {
  if (!endpoint.startsWith("/") || endpoint.includes("#") || endpoint.length > 2048) return null;

  const queryIndex = endpoint.indexOf("?");
  const pathname = queryIndex === -1 ? endpoint : endpoint.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : endpoint.slice(queryIndex + 1);
  const resource = pathname.slice(1);
  const isImageList = /^\/extracurriculars\/[a-zA-Z0-9-]+\/images$/.test(pathname);
  const allowed = isImageList ? ["page", "per_page"] : Object.hasOwn(PUBLIC_QUERIES, resource) ? PUBLIC_QUERIES[resource] : null;
  if (!allowed) return null;

  const params = new URLSearchParams();
  for (const [key, value] of new URLSearchParams(query)) {
    if (allowed.includes(key) && value !== "") params.set(key, value);
  }
  params.sort();
  const search = params.toString();

  return {
    endpoint: pathname + (search ? `?${search}` : ""),
    tags: [`public:${isImageList ? "extracurricular-images" : resource}`],
  };
}

export function getPublicFetchOptions(policy) {
  return {
    cache: "force-cache",
    credentials: "omit",
    headers: { Accept: "application/json" },
    next: { revalidate: PUBLIC_CACHE_SECONDS, tags: policy.tags },
  };
}

export function getPublicInvalidationTags(resource, method) {
  // Reading the admin profile can initialize it in Laravel.
  const scopes = method === "GET"
    ? resource === "profile" ? ["profile", "stats"] : []
    : MUTATION_SCOPES[resource] ?? [];
  return scopes.map((scope) => `public:${scope}`);
}
