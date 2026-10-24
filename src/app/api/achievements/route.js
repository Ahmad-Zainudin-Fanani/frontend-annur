import { achievementsData, achievementCategories } from "@/data/achievementsData";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const query = searchParams.get("q")?.toLowerCase();

  let filtered = [...achievementsData];

  if (category && category !== "Semua") {
    filtered = filtered.filter((a) => a.category === category);
  }

  if (query) {
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(query) ||
        a.studentName.toLowerCase().includes(query) ||
        a.organizer.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
  }

  return Response.json({
    status: "success",
    total: filtered.length,
    categories: achievementCategories,
    data: filtered,
  });
}
