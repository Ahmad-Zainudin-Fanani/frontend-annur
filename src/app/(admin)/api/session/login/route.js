import { cookies } from "next/headers";
import { privateJson } from "@/lib/cache-policy";

const API_BASE_URL = process.env.API_BASE_URL;

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return privateJson(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 422 }
      );
    }

    // Call Laravel login
    const laravelRes = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const laravelData = await laravelRes.json();

    if (!laravelRes.ok) {
      return privateJson(
        { success: false, message: laravelData.message || "Login gagal." },
        { status: laravelRes.status }
      );
    }

    const { token, user } = laravelData;

    // Check role and email verification
    if (user?.role !== "admin") {
      // Revoke token immediately
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      return privateJson(
        { success: false, message: "Akses ditolak. Akun ini bukan admin." },
        { status: 403 }
      );
    }

    if (!user?.email_verified) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      });
      return privateJson(
        { success: false, message: "Email belum diverifikasi. Periksa kotak masuk Anda." },
        { status: 403 }
      );
    }

    // Store token in HttpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });

    return privateJson({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("[BFF login]", err);
    return privateJson(
      { success: false, message: "Terjadi kesalahan server. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
