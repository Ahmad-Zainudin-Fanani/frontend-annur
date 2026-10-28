import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Admin Panel — SD Plus An-Nur",
  description: "Panel administrasi, CMS, dan CRM SD Plus An-Nur",
  robots: "noindex, nofollow",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-canvas-secondary text-ink" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
