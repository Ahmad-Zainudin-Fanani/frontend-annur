import { teachersData, teacherDepartments } from "@/data/teachersData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const department = searchParams.get("department");
  const query = searchParams.get("q")?.toLowerCase();

  let filtered = [...teachersData];

  if (department && department !== "Semua Departemen") {
    filtered = filtered.filter((t) => t.department === department);
  }

  if (query) {
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.role.toLowerCase().includes(query) ||
        t.education.toLowerCase().includes(query) ||
        t.department.toLowerCase().includes(query)
    );
  }

  return Response.json({
    status: "success",
    total: filtered.length,
    departments: teacherDepartments,
    data: filtered,
  });
}
