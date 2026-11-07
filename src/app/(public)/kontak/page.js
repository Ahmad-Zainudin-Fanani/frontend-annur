"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import MainLayout from "@/components/templates/MainLayout";
import Heading from "@/components/atoms/Heading";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApiState from "@/components/atoms/ApiState";
import { PhoneIcon, MailIcon, MapPinIcon, CheckIcon, ArrowUpRightIcon } from "@/components/atoms/Icons";
import { publicApi } from "@/data/api";
import { gsap } from "@/lib/gsapConfig";

function ContactOutlineButton({ children, disabled = false, ...props }) {
  const fillRef = useRef(null);
  const labelRef = useRef(null);
  const animationRef = useRef({ x: 0, y: 0, radius: 0 });

  const applyClip = useCallback(() => {
    const { x, y, radius } = animationRef.current;
    const clipPath = `circle(${radius}px at ${x}px ${y}px)`;
    if (fillRef.current) fillRef.current.style.clipPath = clipPath;
    if (labelRef.current) labelRef.current.style.clipPath = clipPath;
  }, []);

  const animateFill = (event, entering) => {
    if (disabled) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const width = button.clientWidth || rect.width;
    const height = button.clientHeight || rect.height;
    const x = event.clientX - rect.left - (button.clientLeft || 0);
    const y = event.clientY - rect.top - (button.clientTop || 0);
    const radius = entering ? Math.hypot(Math.max(x, width - x), Math.max(y, height - y)) + 2 : 0;
    const state = animationRef.current;
    gsap.killTweensOf(state);

    if (entering) {
      Object.assign(state, { x, y, radius: 0 });
      applyClip();
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(state, { x, y, radius });
      applyClip();
      return;
    }
    gsap.to(state, {
      x, y, radius,
      duration: entering ? 0.6 : 0.45,
      ease: entering ? "power3.out" : "power3.inOut",
      onUpdate: applyClip,
    });
  };

  useEffect(() => {
    const state = animationRef.current;
    if (disabled) {
      gsap.killTweensOf(state);
      state.radius = 0;
      applyClip();
    }
    return () => { gsap.killTweensOf(state); };
  }, [disabled, applyClip]);

  return (
    <button
      {...props}
      disabled={disabled}
      onMouseEnter={(event) => animateFill(event, true)}
      onMouseLeave={(event) => animateFill(event, false)}
      className="relative isolate inline-flex min-h-[52px] w-full cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black bg-white px-7 py-3 text-base font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-4 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
    >
      <span ref={fillRef} aria-hidden="true" style={{ clipPath: "circle(0px at 50% 50%)" }} className="pointer-events-none absolute inset-0 z-0 rounded-full bg-black" />
      <span className="relative z-10">{children}</span>
      <span ref={labelRef} aria-hidden="true" style={{ clipPath: "circle(0px at 50% 50%)" }} className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-7 py-3 text-white">
        {children}
      </span>
    </button>
  );
}

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
    if (submitting) return;
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
      <section className="bg-white px-4 pt-16 pb-4 text-center sm:px-6 sm:pt-20 sm:pb-6 lg:px-8 lg:pt-24 lg:pb-8">
        <div className="mx-auto max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#7a7a7a]">
            Sekretariat &amp; Informasi
          </p>
          <Heading as="h1" variant="hero-display" className="text-balance">
            Hubungi {profile?.institutionName || "Sekolah"}.
          </Heading>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-balance text-[#7a7a7a] sm:text-lg lg:text-xl">
            {profile?.tagline || "Hubungi kami untuk informasi sekolah."}
          </p>
        </div>
      </section>

      <section className="bg-white pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <aside aria-labelledby="contact-details-title" className="min-w-0 lg:sticky lg:top-24 lg:col-span-5">
              <h2 id="contact-details-title" className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-3xl">
                Kontak &amp; Lokasi
              </h2>
              {profile?.schoolStatus ? (
                <p className="mt-2 text-sm text-[#7a7a7a]">{profile.schoolStatus}</p>
              ) : null}

              {profileLoading ? <ApiState loading /> : profileError ? <ApiState error={profileError} /> : !profile ? <ApiState empty /> : (
                <>
                  <dl className="mt-6 divide-y divide-[#e0e0e0]">
                    <div className="flex items-start gap-4 py-6 first:pt-0">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f7] text-[#333333]">
                        <MapPinIcon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <dt className="text-sm font-semibold text-[#1d1d1f]">Alamat Sekolah</dt>
                        <dd className="mt-2 space-y-3">
                          <p className="break-words text-base leading-relaxed text-[#7a7a7a]">
                            {profile.location.fullAddress || profile.location.address || "Alamat belum tersedia."}
                          </p>
                          {profile.location.coordinates ? (
                            <p className="text-xs text-[#7a7a7a]">Koordinat: {profile.location.coordinates}</p>
                          ) : null}
                          {profile.location.mapsUrl ? (
                            <Button href={profile.location.mapsUrl} target="_blank" variant="neutral-outline" size="sm" className="gap-2">
                              Buka Petunjuk Arah <ArrowUpRightIcon className="h-3.5 w-3.5" />
                            </Button>
                          ) : null}
                        </dd>
                      </div>
                    </div>

                    {(profile.whatsapp || profile.phone) ? (
                      <div className="flex items-start gap-4 py-6">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f7] text-[#333333]">
                          <PhoneIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-sm font-semibold text-[#1d1d1f]">WhatsApp / Telepon</dt>
                          <dd className="mt-2">
                            <a href={profile.whatsapp ? `https://wa.me/${whatsappNumber}` : `tel:${profile.phone.replace(/[^\d+]/g, "")}`} target={profile.whatsapp ? "_blank" : undefined} rel={profile.whatsapp ? "noopener noreferrer" : undefined} className="break-words text-base text-[#7a7a7a] underline-offset-4 hover:text-[#1d1d1f] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a7a7a]">
                              {profile.whatsapp || profile.phone}
                            </a>
                          </dd>
                        </div>
                      </div>
                    ) : null}

                    {profile.email ? (
                      <div className="flex items-start gap-4 py-6">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f5f5f7] text-[#333333]">
                          <MailIcon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-sm font-semibold text-[#1d1d1f]">Email</dt>
                          <dd className="mt-2">
                            <a href={`mailto:${profile.email}`} className="break-all text-base text-[#7a7a7a] underline-offset-4 hover:text-[#1d1d1f] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7a7a7a]">
                              {profile.email}
                            </a>
                          </dd>
                        </div>
                      </div>
                    ) : null}
                  </dl>

                  {profile.utilities.service_hours ? (
                    <div className="border-t border-[#e0e0e0] pt-6">
                      <h3 className="text-sm font-semibold text-[#1d1d1f]">Waktu Operasional Pelayanan</h3>
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#7a7a7a]">{profile.utilities.service_hours}</p>
                    </div>
                  ) : null}
                </>
              )}
            </aside>

            <div className="min-w-0 rounded-[24px] border border-[#e0e0e0] bg-white p-5 sm:p-8 lg:col-span-7 lg:p-10">
              {submitted ? (
                <div role="status" className="py-10 text-center sm:py-14">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#ecfdf5] text-[#065f46]">
                    <CheckIcon className="h-7 w-7" />
                  </div>
                  <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">Terima Kasih!</h2>
                  <p className="mx-auto mt-3 mb-8 max-w-md text-base leading-relaxed text-[#7a7a7a]">{statusMessage}</p>
                  <ContactOutlineButton type="button" onClick={() => { setSubmitted(false); setStatusMessage(""); }}>
                    Kirim Pesan Lain
                  </ContactOutlineButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} aria-busy={submitting} className="space-y-7">
                  <div className="border-b border-[#e0e0e0] pb-6">
                    <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] sm:text-[28px]">Formulir Pertanyaan &amp; PPDB</h2>
                    <p className="mt-3 text-sm leading-relaxed text-[#7a7a7a]">Isi formulir untuk konsultasi pendaftaran atau informasi sekolah.</p>
                  </div>

                  <fieldset disabled={submitting} className="grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6 disabled:opacity-70">
                    <legend className="sr-only">Data pengirim dan pertanyaan</legend>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="parentName" className="mb-2 block text-sm font-medium text-[#1d1d1f]">Nama Orang Tua / Wali Siswa</label>
                      <Input id="parentName" name="parentName" autoComplete="name" required maxLength={150} value={formData.parentName} onChange={(event) => setFormData({ ...formData, parentName: event.target.value })} />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1d1d1f]">Email Aktif</label>
                      <Input id="email" name="email" type="email" autoComplete="email" required maxLength={150} placeholder="nama@email.com" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} />
                    </div>
                    <div className="min-w-0">
                      <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-[#1d1d1f]">Nomor WhatsApp</label>
                      <Input id="whatsapp" name="whatsapp" type="tel" autoComplete="tel" required maxLength={30} placeholder="Contoh: 081234567890" value={formData.whatsapp} onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })} />
                    </div>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="gradeTarget" className="mb-2 block text-sm font-medium text-[#1d1d1f]">Kelas yang Dituju</label>
                      <select id="gradeTarget" name="gradeTarget" required className="h-[44px] w-full cursor-pointer rounded-full border border-[#e0e0e0] bg-white px-5 text-[15px] text-[#1d1d1f] transition-colors focus:border-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-[#7a7a7a]/25" value={formData.gradeTarget} onChange={(event) => setFormData({ ...formData, gradeTarget: event.target.value })}>
                        <option value="Kelas 1 (Siswa Baru)">Kelas 1 (Peserta Didik Baru)</option>
                        <option value="Kelas 2 (Pindahan)">Kelas 2 (Siswa Pindahan)</option>
                        <option value="Kelas 3 (Pindahan)">Kelas 3 (Siswa Pindahan)</option>
                        <option value="Kelas 4 (Pindahan)">Kelas 4 (Siswa Pindahan)</option>
                        <option value="Kelas 5 (Pindahan)">Kelas 5 (Siswa Pindahan)</option>
                        <option value="Informasi Umum & Survei">Informasi Umum &amp; Jadwal Kunjungan</option>
                      </select>
                    </div>
                    <div className="min-w-0 sm:col-span-2">
                      <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#1d1d1f]">Pesan atau Pertanyaan Khusus</label>
                      <textarea id="message" name="message" rows={6} required minLength={10} maxLength={3000} className="w-full resize-y rounded-2xl border border-[#e0e0e0] bg-white p-4 text-[15px] leading-relaxed text-[#1d1d1f] transition-colors focus:border-[#7a7a7a] focus:outline-none focus:ring-2 focus:ring-[#7a7a7a]/25" value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} />
                    </div>
                  </fieldset>

                  {submitError ? <p role="alert" className="rounded-xl border border-[#b42318]/20 bg-[#fef3f2] px-4 py-3 text-sm leading-relaxed text-[#b42318]">{submitError}</p> : null}

                  <div className="flex flex-col items-start justify-between gap-4 border-t border-[#e0e0e0] pt-6 sm:flex-row sm:items-center">
                    <p className="text-xs text-[#7a7a7a]">Semua kolom wajib diisi.</p>
                    <ContactOutlineButton type="submit" disabled={submitting}>
                      {submitting ? <span role="status" className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />Mengirim…</span> : "Kirim Formulir"}
                    </ContactOutlineButton>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
