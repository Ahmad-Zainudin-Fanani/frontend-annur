export default function ApiState({ loading = false, error = null, empty = false, children }) {
  if (loading) {
    return (
      <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
        Memuat data sekolah...
      </p>
    );
  }

  if (error) {
    return (
      <p role="alert" className="py-10 text-center text-sm text-[#b42318]">
        {error}
      </p>
    );
  }

  if (empty) {
    return (
      <p role="status" className="py-10 text-center text-sm text-[#7a7a7a]">
        Belum ada data yang tersedia.
      </p>
    );
  }

  return children;
}
