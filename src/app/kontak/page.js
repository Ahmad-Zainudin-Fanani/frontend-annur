"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/templates/MainLayout";
import HeroTile from "@/components/organisms/HeroTile";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApiState from "@/components/atoms/ApiState";
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";
import { publicApi } from "@/data/api";

export default function KontakPage() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [formData, setFormData] = useState({
    parentName: "",
    email: "",
    whatsapp: "",
    gradeTarget: "Kelas 1 (Siswa Baru)",
    message: "",
  });

  useEffect(() => {
    let active = true;
    publicApi
      .profile()
      .then((data) => {
        if (active) {
          setProfile(data);
          setProfileLoading(false);
        }
      })
      .catch((error) => {
        if (active) {
          setProfileError(error.message);
          setProfileLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await publicApi.submitContact({
        name: formData.parentName,
        email: formData.email,
        phone: formData.whatsapp,
        subject: `PPDB - ${formData.gradeTarget}`,
        message: formData.message,
      });
      setStatusMessage(result?.message || "Pesan berhasil dikirim.");
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsapp = (profile?.whatsapp || profile?.phone || "").replace(/\D/g, "");
  const whatsappNumber = whatsapp.startsWith("0")
    ? `62${whatsapp.slice(1)}`
    : whatsapp;

  return (
    <MainLayout>
      <HeroTile
        variant="white"
        eyebrow="Sekretariat & Informasi"
        title={`Hubungi ${profile?.institutionName || "Sekolah"}.`}
        subtitle={profile?.tagline || "Hubungi kami untuk informasi sekolah."}
      />

      <section className="py-16 lg:py-20 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8 apple-product-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#1d1d1f]">
                    Lokasi {profile?.institutionName || "Sekolah"}
                  </h2>
                  {profile?.schoolStatus ? (
                    <Badge variant="primary" size="sm">
                      {profile.schoolStatus}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex items-start gap-3 text-[15px] text-[#333333] mb-4">
                  <MapPinIcon className="w-5 h-5 text-[#0066cc] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-[#1d1d1f]">Alamat Kampus:</span>
                    <span>{profile?.location.fullAddress || ""}</span>
                    {profile?.location.coordinates ? (
                      <span className="text-[13px] text-[#7a7a7a] block mt-1">
                        Koordinat: {profile.location.coordinates}
                      </span>
                    ) : null}
                  </div>
                </div>

                {profile?.location.mapsUrl ? (
                  <div className="p-4 rounded-xl bg-[#fafafc] border border-[#f0f0f0] mb-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#7a7a7a] block">Peta Lokasi</span>
                        <span className="text-sm font-semibold text-[#1d1d1f]">Buka Petunjuk Arah</span>
                      </div>
                      <Button
                        href={profile.location.mapsUrl}
                        target="_blank"
                        variant="primary"
                        size="sm"
                        className="inline-flex items-center gap-1.5"
                      >
                        Buka Maps <ArrowUpRightIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-4 pt-6 border-t border-[#f0f0f0] text-[15px]">
                  {(profile?.whatsapp || profile?.phone) ? (
                    <div className="flex items-center gap-3 text-[#333333]">
                      <PhoneIcon className="w-5 h-5 text-[#0066cc] shrink-0" />
                      <span>WhatsApp / Telepon: {profile.whatsapp || profile.phone}</span>
                    </div>
                  ) : null}
                  {profile?.email ? (
                    <div className="flex items-center gap-3 text-[#333333]">
                      <MailIcon className="w-5 h-5 text-[#0066cc] shrink-0" />
                      <span>{profile.email}</span>
                    </div>
                  ) : null}
                </div>
                {profileLoading ? <ApiState loading /> : null}
                {profileError ? <ApiState error={profileError} /> : null}
                {!profileLoading && !profileError && !profile ? (
                  <ApiState empty />
                ) : null}
              </div>

              {profile?.utilities.service_hours ? (
                <div className="bg-white border border-[#e0e0e0] rounded-2xl p-6 sm:p-8">
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-2">
                    Waktu Operasional Pelayanan
                  </h3>
                  <p className="text-sm text-[#7a7a7a]">
                    {profile.utilities.service_hours}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="lg:col-span-7 bg-white border border-[#e0e0e0] rounded-2xl p-8 lg:p-10 apple-product-shadow">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-[#ecfdf5] text-[#065f46] flex items-center justify-center mx-auto mb-4">
                    <CheckIcon className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                    Terima Kasih!
                  </h2>
                  <p className="text-base text-[#7a7a7a] max-w-md mx-auto mb-6">
                    {statusMessage}
                  </p>
                  <Button
                    variant="pearl-capsule"
                    onClick={() => {
                      setSubmitted(false);
                      setStatusMessage("");
                    }}
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#1d1d1f] mb-2">
                      Formulir Pertanyaan &amp; PPDB
                    </h2>
                    <p className="text-sm text-[#7a7a7a]">
                      Isi formulir untuk konsultasi pendaftaran atau informasi sekolah.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="parentName" className="block text-sm font-semibold text-[#1d1d1f] mb-1.5">
                      Nama Orang Tua / Wali Siswa
                    </label>
                    <Input
                      id="parentName"
                      name="parentName"
                      required
                      maxLength={150}
                      value={formData.parentName}
                      onChange={(event) => setFormData({ ...formData, parentName: event.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#1d1d1f] mb-1.5">
                      Email Aktif
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      maxLength={150}
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="whatsapp" className="block text-sm font-semibold text-[#1d1d1f] mb-1.5">
                      Nomor WhatsApp
                    </label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      type="tel"
                      required
                      maxLength={30}
                      placeholder="Contoh: 081234567890"
                      value={formData.whatsapp}
                      onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })}
                    />
                  </div>

                  <div>
                    <label htmlFor="gradeTarget" className="block text-sm font-semibold text-[#1d1d1f] mb-1.5">
                      Kelas yang Dituju
                    </label>
                    <select
                      id="gradeTarget"
                      name="gradeTarget"
                      className="w-full h-[44px] px-5 bg-white text-[#1d1d1f] text-[15px] rounded-full border border-[#e0e0e0] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all cursor-pointer"
                      value={formData.gradeTarget}
                      onChange={(event) => setFormData({ ...formData, gradeTarget: event.target.value })}
                    >
                      <option value="Kelas 1 (Siswa Baru)">Kelas 1 (Peserta Didik Baru)</option>
                      <option value="Kelas 2 (Pindahan)">Kelas 2 (Siswa Pindahan)</option>
                      <option value="Kelas 3 (Pindahan)">Kelas 3 (Siswa Pindahan)</option>
                      <option value="Kelas 4 (Pindahan)">Kelas 4 (Siswa Pindahan)</option>
                      <option value="Kelas 5 (Pindahan)">Kelas 5 (Siswa Pindahan)</option>
                      <option value="Informasi Umum & Survei">Informasi Umum &amp; Jadwal Kunjungan</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#1d1d1f] mb-1.5">
                      Pesan atau Pertanyaan Khusus
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      required
                      minLength={10}
                      maxLength={3000}
                      className="w-full p-4 bg-white text-[#1d1d1f] text-[15px] rounded-2xl border border-[#e0e0e0] focus:outline-none focus:border-[#0071e3] focus:ring-2 focus:ring-[#0071e3]/20 transition-all"
                      value={formData.message}
                      onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                    />
                  </div>

                  {submitError ? (
                    <p role="alert" className="text-sm text-[#b42318]">
                      {submitError}
                    </p>
                  ) : null}

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={submitting}>
                    {submitting ? "Mengirim..." : "Kirim Formulir Konsultasi"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
