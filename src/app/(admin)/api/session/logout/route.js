import { cookies } from "next/headers";
import { privateJson } from "@/lib/cache-policy";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (token) {
      // Revoke token on Laravel
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      }).catch(() => {}); // Best effort

      // Remove cookie
      cookieStore.delete("admin_session");
    }

    return privateJson({ success: true });
  } catch (err) {
    console.error("[BFF logout]", err);
    return privateJson({ success: true }); // Always succeed for UX
  }
}
