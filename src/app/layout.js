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
    "Informasi profil, kegiatan, tenaga pendidik, kurikulum, dan layanan SD Plus An-Nur.",
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
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-canvas text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
