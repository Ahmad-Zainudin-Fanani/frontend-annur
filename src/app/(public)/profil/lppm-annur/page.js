import MainLayout from "@/components/templates/MainLayout";
import FoundationStructure from "@/components/organisms/FoundationStructure";
import CTASection from "@/components/organisms/CTASection";

export const metadata = {
  title: "LPPM ANNUR | SD Plus An-Nur",
  description: "Informasi struktur yayasan dan pengurus LPPM ANNUR.",
};

export const instant = false;

export default function LppmAnnurPage() {
  return (
    <MainLayout>
      <section id="pengurus-yayasan" className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.2px] text-[#7a7a7a]">
              Struktur Yayasan
            </span>
            <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-[36px]">
              Pengurus Yayasan
            </h2>
          </div>
          <FoundationStructure />
        </div>
      </section>

      {/* CTA */}
      <CTASection
        theme="neutral"
        eyebrow="Silaturahmi & Kunjungan"
        title="Ingin Mengenal Lebih Dekat LPPM ANNUR?"
        description="Kami terbuka untuk berdiskusi dan bersilaturahmi mengenai peran yayasan dalam mendidik generasi Qur'ani yang berakhlak mulia."
        primaryText="Hubungi Kami"
        primaryHref="/kontak"
        secondaryText=""
        secondaryHref=""
      />
    </MainLayout>
  );
}
