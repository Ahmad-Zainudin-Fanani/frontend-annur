import { profileData } from "@/data/profileData";

export async function GET() {
  return Response.json({
    status: "success",
    message: "Data profil Lembaga Pendidikan Islam An-Nur berhasil diambil",
    data: profileData,
  });
}
