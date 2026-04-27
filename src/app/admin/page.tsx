"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Car, ArrowRight, ShieldCheck, Zap, Globe, Cpu, ChevronRight } from "lucide-react";
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

    if (passcode === "ZONE2026") {
      localStorage.setItem("admin_session", "active");
      router.push("/admin/dashboard");
    } else {
      setError("Authentification échouée. Accès refusé.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-white/3 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-white/2 rounded-full blur-[150px] animate-pulse-slow"></div>
        
        {/* Subtle noise */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] z-10 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-16 animate-slide-up">
          <Link href="/" className="inline-flex items-center gap-6 mb-10 group">
            <div className="w-20 h-20 rounded-[2.5rem] bg-surface border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-700 relative">
               <div className="absolute inset-0 bg-white/5 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Car className="w-10 h-10 text-white relative z-10" />
            </div>
          </Link>
          <h1 className="text-5xl font-black font-heading tracking-tighter uppercase mb-4 text-white">
            BENZ AUTO <span className="text-slate-500 font-light">ADMIN</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Terminal de Gestion Sécurisé</p>
          </div>
        </div>

        <div className="p-8 md:p-16 rounded-[4rem] bg-surface/40 backdrop-blur-3xl border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6 px-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Clé d'Accès</label>
                 <ShieldCheck className="w-5 h-5 text-slate-800" />
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 w-6 h-6 group-focus-within/input:text-white transition-colors" />
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-4xl py-8 pl-20 pr-8 focus:outline-none focus:border-white/20 transition-all text-center tracking-[0.8em] text-3xl font-black text-white placeholder:opacity-10 shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="p-6 rounded-4xl bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-shake italic">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative py-8 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] hover:bg-slate-200 transition-all duration-700 flex items-center justify-center gap-4 overflow-hidden shadow-2xl disabled:opacity-50"
            >
              {loading ? (
                 <Cpu className="w-6 h-6 relative z-10 animate-spin" />
              ) : (
                 <Zap className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110" />
              )}
              <span className="relative z-10">{loading ? "CONNEXION..." : "AUTORISER L'ACCÈS"}</span>
            </button>
          </form>
        </div>

        <div className="mt-16 text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 hover:text-white transition-all">
             Retour au Site <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
