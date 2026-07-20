"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erreur de connexion");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <span className="stamp mx-auto flex h-16 w-28 items-center justify-center font-display text-lg text-signal">
          O.W.A
        </span>
        <h1 className="mt-8 text-center font-display text-3xl uppercase">
          Admin
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
          />
          <input
            required
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border hairline bg-transparent px-4 py-3 text-sm outline-none focus:border-signal"
          />
          {error && <p className="text-sm text-signal">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-signal py-3 font-mono text-xs uppercase tracking-widest2 text-ink hover:bg-bone hover:text-ink disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
