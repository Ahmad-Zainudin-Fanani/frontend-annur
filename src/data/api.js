import { getPublicCachePolicy, getPublicFetchOptions } from "@/lib/cache-policy";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request(endpoint, options = {}) {
  const { includeMeta = false, ...fetchOptions } = options;
  const method = (fetchOptions.method || "GET").toUpperCase();
  const policy = method === "GET" ? getPublicCachePolicy(endpoint) : null;
  const browser = typeof window !== "undefined";
  const canCache = policy && !fetchOptions.cache && !fetchOptions.signal;
  const cacheOptions = canCache && !browser
    ? getPublicFetchOptions(policy)
    : { cache: fetchOptions.cache || "no-store" };
  const url = browser && policy
    ? `/api/public${policy.endpoint}`
    : `${API_URL}${policy?.endpoint || endpoint}`;
  let response;

  try {
    response = await fetch(url, {
      ...cacheOptions,
      ...fetchOptions,
      headers: {
        Accept: "application/json",
        ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
        ...fetchOptions.headers,
      },
      ...(policy ? { credentials: "omit" } : {}),
      cache: browser ? "no-store" : cacheOptions.cache,
    });
  } catch (error) {
    throw new ApiError("Backend tidak dapat dihubungi. Coba lagi nanti.", 0, {
      cause: error,
    });
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || result?.success === false) {
    throw new ApiError(
      result?.message || `Request API gagal: HTTP ${response.status}`,
      response.status,
      result?.errors || {}
    );
  }

  return includeMeta
    ? { data: result?.data, meta: result?.meta ?? null }
    : result?.data;
}

function withQuery(params = {}) {
  const query = new URLSearchParams();
  const filters = { ...params };

  if (filters.q !== undefined && filters.search === undefined) {
    filters.search = filters.q;
  }
  if (filters.department !== undefined && filters.subject === undefined) {
    filters.subject = filters.department;
  }
  delete filters.q;
  delete filters.department;

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

function normalizePrincipal(principal) {
  if (!principal) return null;

  return {
    ...principal,
    role: principal.title || "Kepala Sekolah",
    bio: principal.bio || principal.message || "",
    experience: principal.experience || "",
    period: [principal.started_at, principal.ended_at]
      .filter(Boolean)
      .map((date) => String(date).slice(0, 4))
      .join(" - ") || "Sekarang",
  };
}

export function normalizeProfile(profile) {
  if (!profile) return null;

  const sections = profile.public_sections || {};
  const location = sections.location || {};
  const history = sections.history || {};
  const currentPrincipal = normalizePrincipal(profile.current_principal);
  const otherLeaders = (sections.leadership || []).map((leader) => ({
    ...leader,
    role: leader.role || leader.role_title || leader.title || "",
    bio: leader.bio || leader.message || "",
    education: leader.education || "",
    experience: leader.experience || "",
  }));

  return {
    ...profile,
    institutionName: profile.name,
    shortName: profile.name,
    schoolStatus: sections.school_status || "",
    educationLevel: sections.education_level || "",
    visionTitle: profile.vision_title || "Visi",
    missionTitle: profile.mission_title || "Misi",
    overview: profile.description || "",
    mission: profile.missions || [],
    vision: Array.isArray(profile.vision)
      ? profile.vision.join(" ")
      : profile.vision || "",
    stats: profile.stats || {},
    utilities: sections.utilities || {},
    location: {
      ...location,
      address: profile.address || location.address || "",
      fullAddress: location.full_address || profile.address || "",
      mapsUrl:
        location.maps_url ||
        (location.coordinates
          ? `https://www.google.com/maps?q=${encodeURIComponent(location.coordinates)}`
          : ""),
    },
    coreValues: sections.core_values || [],
    facilities: sections.facilities || [],
    history: {
      ...history,
      shortBackground: profile.history || "",
      milestones: history.milestones || [],
      leadershipTrackRecord: (profile.principal_history || []).map(
        (principal, index) => ({
          ...normalizePrincipal(principal),
          no: String(index + 1).padStart(2, "0"),
          name: principal.name,
          status: principal.title || "Kepala Sekolah",
        })
      ),
    },
    leadership: [
      ...(currentPrincipal ? [currentPrincipal] : []),
      ...otherLeaders,
    ],
    principal: currentPrincipal,
    phone: profile.phone || profile.whatsapp || "",
    email: profile.email || "",
    mapsEmbedUrl: profile.maps_embed_url || "",
    semester: sections.semester || "",
  };
}

export function normalizeTeacher(teacher) {
  return {
    ...teacher,
    role: teacher.role_title || "",
    department: teacher.subject || "",
    quote: teacher.bio || "",
    experience: teacher.experience || "",
    certifications: teacher.certifications || [],
  };
}

export function normalizeAchievement(achievement) {
  let image = achievement.image || "";

  if (image && !image.startsWith("http")) {
    try {
      const apiOrigin = new URL(API_URL).origin;
      image = new URL(image, `${apiOrigin}/`).toString();
    } catch {
      image = achievement.image;
    }
  }

  return {
    ...achievement,
    image,
    imageUrl: image,
    studentName: achievement.recipient_name || "",
    organizer: achievement.organizer || "",
  };
}

export function normalizeExtracurricular(activity) {
  return {
    ...activity,
    description: activity.description || "",
    images: (activity.images ?? [])
      .map((image) => {
        let url = image.url || image.path || "";

        if (url) {
          try {
            const path = !image.url && !/^(https?:\/\/|\/)/.test(url)
              ? `/storage/${url}`
              : url;
            url = new URL(path, `${new URL(API_URL).origin}/`).toString();
          } catch {
            url = "";
          }
        }

        return { ...image, url, alt_text: image.alt_text || activity.title };
      })
      .filter((image) => image.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  };
}

export function normalizeOrganizationStructure(member) {
  let image = "";

  if (member.image) {
    try {
      const url = new URL(member.image, `${new URL(API_URL).origin}/`);
      if (url.protocol === "http:" || url.protocol === "https:") {
        image = url.toString();
      }
    } catch {
      image = "";
    }
  }

  return { ...member, image };
}

export function normalizeCompetition(competition) {
  return {
    ...competition,
    date: competition.event_date || "",
    desc: competition.description || "",
    status: competition.display_status || "",
    level: competition.level || "",
  };
}

export function normalizeGallery(gallery) {
  return {
    ...gallery,
    imageUrl: gallery.image || "",
    date: gallery.event_date || "",
  };
}

export function normalizeHeroSlide(slide) {
  let image = slide.image || "";

  if (image) {
    try {
      const apiOrigin = new URL(API_URL).origin;
      image = new URL(image, `${apiOrigin}/`).toString();
    } catch {
      image = slide.image;
    }
  }

  return {
    id: slide.id,
    image,
    heading: slide.heading || "",
    subheading: slide.subheading || "",
    caption: slide.caption || "",
    buttonLabel: slide.button_label || "",
    buttonUrl: slide.button_url || "",
  };
}

export function normalizeCurriculums(records = [], profile = null) {
  const sections = profile?.public_sections?.curriculum || {};

  return {
    overview: sections.overview || "",
    utilities: sections.utilities || {},
    pillars: records
      .filter((record) => record.section === "pillar")
      .map((record) => ({
        ...record.features,
        id: record.id,
        title: record.title,
        category: record.level,
        summary: record.description,
        points: record.features?.points || [],
      })),
    levels: records
      .filter((record) => record.section === "level")
      .map((record) => ({
        ...record.features,
        id: record.id,
        level: record.level,
        title: record.title,
        description: record.description,
        keyCompetencies: record.features?.key_competencies || [],
      })),
  };
}

export const publicApi = {
  profile: async () => normalizeProfile(await request("/profile")),
  stats: () => request("/stats"),

  teachers: async (params = {}) =>
    (await request(`/teachers${withQuery(params)}`)).map(normalizeTeacher),

  achievements: async (params = {}) =>
    (await request(`/achievements${withQuery(params)}`)).map(
      normalizeAchievement
    ),

  achievement: async (id) => {
    try {
      const item = await request(`/achievements/${id}`);
      if (item) return normalizeAchievement(item);
    } catch {
      // Backend may not have single resource route, fallback to array find
    }
    const all = await publicApi.achievements();
    return all.find((item) => String(item.id) === String(id)) || null;
  },

  competitions: async (params = {}) =>
    (await request(`/competitions${withQuery(params)}`)).map(
      normalizeCompetition
    ),

  extracurriculars: async (params = {}) => {
    const { data, meta } = await request(
      `/extracurriculars${withQuery({ ...params, status: "published" })}`,
      { includeMeta: true }
    );

    return {
      data: (data ?? [])
        .filter((activity) => !activity.status || activity.status === "published")
        .map(normalizeExtracurricular)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
      meta,
    };
  },

  organizationStructures: async () => {
    const data = await request("/organization-structures?status=published");

    if (!Array.isArray(data)) {
      throw new ApiError("Format data pengurus yayasan tidak valid.", 502);
    }

    return data
      .filter((member) => member.status === "published")
      .map(normalizeOrganizationStructure)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  },

  curriculums: (params = {}) =>
    request(`/curriculums${withQuery(params)}`),

  heroSlides: async () =>
    (await request("/hero-slides")).map(normalizeHeroSlide),

  galleries: async (params = {}) =>
    (await request(`/galleries${withQuery(params)}`)).map(normalizeGallery),

  submitContact: (payload) =>
    request("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
