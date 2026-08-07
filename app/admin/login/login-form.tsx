"use client";

import { LockKeyhole, Ship } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { message?: string } | null;
      setMessage(body?.message ?? "Giriş yapılamadı.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="admin-login-screen">
      <section className="admin-login-card" aria-labelledby="admin-login-title">
        <span className="admin-login-mark" aria-hidden="true">
          <Ship size={34} />
        </span>
        <h1 id="admin-login-title">Okan Kaptan Admin</h1>
        <p>İçerik, görsel ve galeri düzenlemeleri için güvenli giriş.</p>
        <form onSubmit={onSubmit}>
          <label htmlFor="admin-password">Admin şifresi</label>
          <div className="admin-password-field">
            <LockKeyhole size={20} aria-hidden="true" />
            <input
              id="admin-password"
              type="password"
              value={password}
              autoComplete="current-password"
              minLength={12}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {message ? <p className="admin-form-error">{message}</p> : null}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Kontrol ediliyor..." : "Panele giriş yap"}
          </button>
        </form>
      </section>
    </main>
  );
}
