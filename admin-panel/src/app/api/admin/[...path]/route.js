import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

const ALLOWED_PREFIXES = [
  "/admin/dashboard",
  "/admin/profile",
  "/admin/teachers",
  "/admin/achievements",
  "/admin/competitions",
  "/admin/curriculum-pillars",
  "/admin/phases",
  "/admin/hero-slides",
  "/admin/galleries",
  "/admin/contacts",
  "/admin/upload",
];

function isAllowed(path) {
  return ALLOWED_PREFIXES.some(
    (prefix) =>
      path === prefix ||
      path.startsWith(`${prefix}/`) ||
      path.startsWith(`${prefix}?`)
  );
}

export async function GET(request, context) {
  return proxy(request, context, "GET");
}

export async function POST(request, context) {
  return proxy(request, context, "POST");
}

export async function PUT(request, context) {
  return proxy(request, context, "PUT");
}

export async function PATCH(request, context) {
  return proxy(request, context, "PATCH");
}

export async function DELETE(request, context) {
  return proxy(request, context, "DELETE");
}

async function proxy(request, context, method) {
  if (!API_BASE_URL) {
    console.error("[BFF proxy] API_BASE_URL belum dikonfigurasi.");

    return NextResponse.json(
      {
        success: false,
        message: "Konfigurasi API server belum tersedia.",
      },
      { status: 500 }
    );
  }

  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    if (origin && host) {
      try {
        const originHost = new URL(origin).host;

        if (originHost !== host) {
          return NextResponse.json(
            { success: false, message: "Forbidden" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { success: false, message: "Invalid origin" },
          { status: 403 }
        );
      }
    }
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Sesi tidak valid." },
      { status: 401 }
    );
  }

  const resolvedParams = await context.params;
  const pathSegments = resolvedParams?.path ?? [];
  const apiPath = `/admin/${pathSegments.join("/")}`;

  if (!isAllowed(apiPath)) {
    console.error("[BFF proxy] Endpoint ditolak:", {
      apiPath,
      method,
      pathSegments,
    });

    return NextResponse.json(
      { success: false, message: "Endpoint tidak diizinkan." },
      { status: 403 }
    );
  }

  const requestUrl = new URL(request.url);
  const queryString = requestUrl.searchParams.toString();
  const laravelUrl =
    `${API_BASE_URL.replace(/\/+$/, "")}${apiPath}` +
    (queryString ? `?${queryString}` : "");

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  let body;

  if (method !== "GET" && method !== "DELETE") {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      body = await request.formData();
    } else {
      headers["Content-Type"] = "application/json";
      body = await request.text();
    }
  }

  try {
    const response = await fetch(laravelUrl, {
      method,
      headers,
      ...(body !== undefined ? { body } : {}),
      cache: "no-store",
    });

    const responseData = await response.json().catch(() => null);

    if (response.status === 401) {
      cookieStore.delete("admin_session");
    }

    if (!response.ok) {
      console.error("[BFF proxy] Respons Laravel:", {
        apiPath,
        method,
        status: response.status,
        response: responseData,
      });
    }

    return NextResponse.json(responseData ?? {}, {
      status: response.status,
    });
  } catch (error) {
    console.error("[BFF proxy] Gagal menghubungi Laravel:", {
      apiPath,
      method,
      error,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Tidak dapat terhubung ke server. Coba lagi.",
      },
      { status: 503 }
    );
  }
}