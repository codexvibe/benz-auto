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
      setError("Passcode authentication failed. Cluster access denied.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-[#38BDF8]/30">
      {/* Dynamic Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-[#38BDF8]/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#818CF8]/5 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02]">
           <Globe className="w-[800px] h-[800px] text-white animate-spin-slow" />
        </div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-16">
          <Link href="/" className="inline-flex items-center gap-6 mb-10 group">
            <div className="w-20 h-20 rounded-[2.5rem] bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.3)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative border border-white/10">
               <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <Globe className="w-10 h-10 text-white relative z-10 animate-pulse" />
            </div>
          </Link>
          <h1 className="text-5xl font-black font-heading tracking-tighter uppercase italic mb-4 text-white">
            OSIRIS <span className="text-[#38BDF8]">CORE</span>
          </h1>
          <div className="flex items-center justify-center gap-4">
             <div className="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse shadow-[0_0_10px_#38BDF8]"></div>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em]">Secure Terminal Interface</p>
          </div>
        </div>

        <div className="p-16 rounded-[4rem] bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000"></div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            <div>
              <div className="flex items-center justify-between mb-6 px-4">
                 <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Access Key</label>
                 <ShieldCheck className="w-5 h-5 text-slate-800" />
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-700 w-6 h-6 group-focus-within/input:text-[#38BDF8] transition-colors" />
                <input 
                  type="password" 
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-black/40 border border-white/5 rounded-[2rem] py-8 pl-20 pr-8 focus:outline-none focus:border-[#38BDF8]/50 transition-all text-center tracking-[0.8em] text-3xl font-black text-white placeholder:opacity-10 shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-shake italic">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full group relative py-8 bg-white text-black font-black text-xs uppercase tracking-[0.4em] rounded-[2.5rem] hover:bg-[#38BDF8] hover:text-white transition-all duration-700 flex items-center justify-center gap-4 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] disabled:opacity-50"
            >
              {loading ? (
                 <Cpu className="w-6 h-6 relative z-10 animate-spin" />
              ) : (
                 <Zap className="w-6 h-6 relative z-10 transition-transform group-hover:scale-110" />
              )}
              <span className="relative z-10">{loading ? "SYNCING..." : "AUTHORIZE ACCESS"}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </form>
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 hover:text-white transition-all">
             Abort Security Protocol <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
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
        .animate-spin-slow { animation: spin 20s linear infinite; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
