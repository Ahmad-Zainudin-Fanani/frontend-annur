import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "SD Plus An-Nur | Sekolah Dasar Swasta Islam Unggulan",
  description:
    "Situs resmi SD Plus An-Nur (Sekolah Dasar Swasta). Terakreditasi A, Kurikulum SD Merdeka, 13 Tenaga Pendidik, 398 Siswa, 13 Rombel di Kediri, Jawa Timur.",
  keywords: [
    "SD Plus An-Nur",
    "SD Swasta",
    "Sekolah Dasar Swasta",
    "SD Islam Kediri",
    "Kurikulum SD Merdeka",
    "Tahfidz Juz 30",
    "PPDB SD Plus An-Nur",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-canvas text-ink">
        {children}
      </body>
    </html>
  );
}
