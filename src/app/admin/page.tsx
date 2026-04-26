"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Car, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // In a real app, you would verify this against Supabase admins table
    // For now, we'll use the default passcode from migration.sql
    if (passcode === "ZONE2026") {
      // Set a simple cookie or local storage for session (not production grade but works for now)
      localStorage.setItem("admin_session", "active");
      router.push("/admin/dashboard");
    } else {
      setError("Passcode incorrect. Veuillez réessayer.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff0000]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff0000]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="p-3 rounded-2xl bg-[#111] border border-white/10 group-hover:border-[#ff0000] transition-all duration-500">
              <Car className="w-8 h-8 text-[#ff0000]" />
            </div>
          </Link>
          <h1 className="text-3xl font-heading font-bold mb-2 tracking-tight">ADMIN <span className="text-[#ff0000]">ZONE</span></h1>
          <p className="text-gray-500">Accès réservé à l'équipe Benz Auto DZ</p>
        </div>

        <div className="glass-dark p-8 rounded-3xl border border-white/10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Passcode d'accès
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff0000] focus:ring-1 focus:ring-[#ff0000] transition-all text-center tracking-[0.5em] text-xl"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center animate-pulse">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? "Vérification..." : "Entrer dans le Dashboard"}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-600 hover:text-white text-sm transition-colors">
            Retour au site public
          </Link>
        </div>
      </div>
    </div>
  );
}
