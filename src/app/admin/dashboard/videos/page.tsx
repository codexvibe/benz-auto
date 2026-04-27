"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Plus, Trash2, Package, Search, Play,
  ChevronRight, ExternalLink, Activity, Globe, ArrowRight, Layers,
  Sparkles, Monitor, Clapperboard, Share2, MoreVertical, Camera
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media", active: true },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Leads" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Offers" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "System" },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-80 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#38BDF8] to-transparent"></div>
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.3)] rotate-3">
          <Globe className="w-8 h-8 text-white animate-pulse" />
        </div>
        <div>
          <span className="font-heading font-black text-2xl tracking-tighter text-white block">OSIRIS</span>
          <span className="text-[10px] text-[#38BDF8] font-black uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
        </div>
      </div>
      <nav className="space-y-3 flex-grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-[0_10px_20px_rgba(0,0,0,0.2)]" : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.02]"}`}>
            {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]"></div>}
            <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-[#38BDF8] scale-110" : "group-hover:text-slate-200"}`} />
            <span className="text-sm tracking-tight">{item.label}</span>
            {item.active && <ArrowRight className="w-4 h-4 ml-auto text-[#38BDF8] animate-bounce-x" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-red-500/10 border border-white/[0.03] hover:border-red-500/20 transition-all duration-500 group mt-auto">
        <span className="text-sm font-black uppercase tracking-widest">Disconnect</span>
        <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </aside>
  );
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    if (data) setVideos(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("🚨 MEDIA DESTRUCTION: Erase this asset from global registry?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (!error) setVideos(videos.filter(v => v.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex p-6 gap-6 font-sans selection:bg-[#38BDF8]/30">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-28 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex items-center justify-between px-10 shadow-xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <Clapperboard className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Visual Archive</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Vlogs, Reviews & Tech Tests</p>
            </div>
          </div>

          <Link
            href="/admin/dashboard/videos/new"
            className="group relative px-10 py-5 bg-[#38BDF8] text-white font-black text-xs uppercase tracking-[0.2em] rounded-[2rem] hover:bg-[#0EA5E9] transition-all duration-500 flex items-center gap-4 overflow-hidden shadow-[0_20px_40px_rgba(56,189,248,0.2)]"
          >
            <Plus className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90" />
            <span className="relative z-10">Broadcast Asset</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>
        </header>

        <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 pb-10">
           {/* Analytic Sensors */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Content Reach", value: "1.2M", icon: Activity, color: "text-[#38BDF8]" },
                { label: "Archived Clips", value: videos.length, icon: Layers, color: "text-indigo-400" },
                { label: "Active Nodes", value: "24/7", icon: Monitor, color: "text-emerald-400" },
                { label: "Engagement", value: "84%", icon: Sparkles, color: "text-amber-400" },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-[#0F172A]/40 backdrop-blur-xl border border-white/[0.05] shadow-2xl group overflow-hidden relative">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-[#38BDF8]/5 transition-all"></div>
                   <div className="flex items-center gap-4 mb-4">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</span>
                   </div>
                   <h3 className="text-3xl font-black font-heading text-white italic tracking-tighter">{stat.value}</h3>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-[3rem] bg-white/[0.02] border border-white/[0.05] animate-pulse shadow-2xl"></div>
                ))
              ) : videos.length === 0 ? (
                <div className="col-span-full py-32 text-center flex flex-col items-center bg-[#0F172A]/20 rounded-[4rem] border border-white/5 border-dashed">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 rotate-12 opacity-40">
                      <Video className="w-10 h-10 text-slate-500" />
                   </div>
                   <h3 className="text-2xl font-black font-heading uppercase italic text-slate-700 tracking-tight">No Media Registered</h3>
                   <p className="text-xs text-slate-600 mt-4 font-black uppercase tracking-[0.3em]">Buffer is currently void</p>
                </div>
              ) : (
                videos.map((v) => (
                  <div key={v.id} className="group p-6 rounded-[3.5rem] bg-[#0F172A]/40 backdrop-blur-3xl border border-white/[0.05] hover:border-[#38BDF8]/20 transition-all duration-700 relative overflow-hidden shadow-2xl flex flex-col">
                    <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl mb-8 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
                       <img src={v.thumbnail} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all flex items-center justify-center">
                          <div className="w-16 h-16 rounded-[1.8rem] bg-[#0F172A]/80 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-[#38BDF8] group-hover:border-[#38BDF8] shadow-2xl">
                             <Play className="w-8 h-8 text-white fill-white transition-transform group-hover:rotate-12" />
                          </div>
                       </div>
                       <div className="absolute top-6 right-6 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-3">
                          {v.platform === "YouTube" ? <Video className="w-4 h-4 text-red-500 shadow-[0_0_10px_#ef4444]" /> : <Camera className="w-4 h-4 text-pink-500 shadow-[0_0_10px_#ec4899]" />}
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">{v.platform}</span>
                       </div>
                    </div>
                    
                    <div className="px-4 pb-4 flex-grow flex flex-col">
                       <h3 className="font-black text-2xl tracking-tighter mb-4 text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1 italic uppercase">{v.title}</h3>
                       <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-6 text-slate-500">
                             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                <Activity className="w-4 h-4 text-[#38BDF8]/60" /> {v.views || 0}
                             </div>
                             <div className="w-1 h-1 rounded-full bg-slate-800"></div>
                             <p className="text-[10px] font-black uppercase tracking-widest italic">{new Date(v.created_at).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                             <button className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-[#38BDF8]/50 hover:text-[#38BDF8] transition-all shadow-2xl">
                                <Share2 className="w-5 h-5" />
                             </button>
                             <button 
                               onClick={() => handleDelete(v.id)}
                               className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-red-500/50 hover:text-red-400 transition-all shadow-2xl"
                             >
                                <Trash2 className="w-5 h-5" />
                             </button>
                          </div>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(5px); }
        }
        .animate-bounce-x { animation: bounce-x 1s infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.2); }
      `}</style>
    </div>
  );
}
