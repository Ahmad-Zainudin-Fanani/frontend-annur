"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/admin/AuthContext";
import Input from "@/components/admin/atoms/Input";
import Button from "@/components/admin/atoms/Button";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError("");

    // Client-side validation
    const newErrors = {};
    if (!email) newErrors.email = "Email wajib diisi.";
    if (!password) newErrors.password = "Password wajib diisi.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      if (result.errors) {
        setErrors(result.errors);
      } else {
        setServerError(result.message || "Login gagal. Periksa kembali data Anda.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#1e2a3a] to-slate-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zNHY2aDZ2LTZoLTZ6bS0xMiAzNHY2aDZ2LTZoLTZ6bTAtMzR2Nmg2di02aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
              <span className="text-white text-xl font-bold">AN</span>
            </div>
            <h1 className="text-2xl font-bold text-ink">Admin Panel</h1>
            <p className="text-sm text-ink-soft mt-1">SD Plus An-Nur — Masuk dengan akun admin Anda</p>
          </div>

          {/* Server error */}
          {serverError && (
            <div
              role="alert"
              className="mb-4 p-3 rounded-xl bg-danger-light border border-danger/20 text-sm text-danger flex items-center gap-2"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              id="login-email"
              label="Email"
              type="email"
              placeholder="admin@annur.sch.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
              autoComplete="email"
            />
            <Input
              id="login-password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              id="login-submit"
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full mt-2"
            >
              {loading ? "Masuk..." : "Masuk"}
            </Button>
          </form>

          <p className="text-center text-xs text-ink-faint mt-6">
            Panel ini hanya untuk administrator sekolah yang terotorisasi.
          </p>
        </div>
      </div>
    </div>
  );
}
