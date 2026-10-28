import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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
      }).catch(() => {}); // Best effort

      // Remove cookie
      cookieStore.delete("admin_session");
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[BFF logout]", err);
    return NextResponse.json({ success: true }); // Always succeed for UX
  }
}
