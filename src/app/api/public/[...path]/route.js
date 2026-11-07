import { NextResponse } from "next/server";
import { getPublicCachePolicy, getPublicFetchOptions } from "@/lib/cache-policy";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

const RESPONSE_HEADERS = { "Cache-Control": "no-store" };

export async function GET(request, context) {
  const { path = [] } = await context.params;
  const search = new URL(request.url).search;
  const policy = getPublicCachePolicy(`/${path.join("/")}${search}`);

  if (!policy) {
    return NextResponse.json(
      { success: false, message: "Endpoint publik tidak diizinkan." },
      { status: 404, headers: RESPONSE_HEADERS }
    );
  }

  try {
    // No session headers are forwarded. Browser responses are not cached separately
    // so CMS tag invalidation also takes effect on the next client-side read.
    const response = await fetch(`${API_URL}${policy.endpoint}`, getPublicFetchOptions(policy));
    const data = await response.json().catch(() => null);

    if (data === null) {
      return NextResponse.json(
        { success: false, message: "Respons API publik tidak valid." },
        { status: 502, headers: RESPONSE_HEADERS }
      );
    }

    return NextResponse.json(data, { status: response.status, headers: RESPONSE_HEADERS });
  } catch {
    return NextResponse.json(
      { success: false, message: "Backend tidak dapat dihubungi. Coba lagi nanti." },
      { status: 503, headers: RESPONSE_HEADERS }
    );
  }
}
