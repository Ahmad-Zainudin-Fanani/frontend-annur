import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;

// GET /api/session — validate current session
export async function GET() {
  const cookieStore = await cookies();

  try {
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const res = await fetch(`${API_BASE_URL}/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });

    if (!res.ok) {
      cookieStore.delete("admin_session");
      return NextResponse.json({ success: false, user: null }, { status: 401 });
    }

    const data = await res.json();
    const user = data.user || data;

    // Re-verify role
    if (user?.role !== "admin") {
      cookieStore.delete("admin_session");
      return NextResponse.json({ success: false, user: null }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[BFF session]", err);
    return NextResponse.json({ success: false, user: null }, { status: 500 });
  }
}
