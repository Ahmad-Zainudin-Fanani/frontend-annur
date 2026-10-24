import { curriculumData } from "@/data/curriculumData";

export async function GET() {
  return Response.json({
    status: "success",
    message: "Data kurikulum terpadu An-Nur berhasil diambil",
    data: curriculumData,
  });
}
