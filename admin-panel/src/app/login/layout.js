
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/context/AuthContext";

export const instant = false;

async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const user = data.user || data;

    if (user?.role !== "admin") return null;

    return user;
  } catch {
    return null;
  }
}

export default async function LoginLayout({ children }) {
  const user = await getSession();

  if (user) {
    redirect("/admin");
  }

  return <AuthProvider initialUser={null}>{children}</AuthProvider>;
}
