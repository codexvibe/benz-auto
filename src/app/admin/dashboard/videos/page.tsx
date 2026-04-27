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
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire" },
  { href: "/admin/dashboard/clients", icon: Users, label: "Clients" },
  { href: "/admin/dashboard/videos", icon: Video, label: "Studio Contenu", active: true },
  { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes" },
  { href: "/admin/dashboard/promos", icon: Tag, label: "Promotions" },
  { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres" },
];

function Sidebar({ onLogout }: { onLogout: () => void }) {
  return (
    <aside className="w-full xl:w-80 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 flex flex-col shrink-0 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="flex items-center gap-4 mb-16">
        <div className="w-14 h-14 rounded-2xl bg-surface border border-white/10 flex items-center justify-center shadow-2xl rotate-3">
          <Car className="w-8 h-8 text-white" />
        </div>
        <div>
          <span className="font-heading font-black text-2xl tracking-tight text-white block uppercase">BENZ AUTO</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1 block">Espace Admin</span>
        </div>
      </div>
      <nav className="space-y-3 grow">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-500 group relative overflow-hidden ${item.active ? "bg-white/5 text-white shadow-lg" : "text-slate-500 hover:text-slate-200 hover:bg-white/2"}`}>
            {item.active && <div className="absolute left-0 top-0 w-1 h-full bg-white"></div>}
            <item.icon className={`w-5 h-5 transition-all duration-500 ${item.active ? "text-white scale-110" : "group-hover:text-slate-200"}`} />
            <span className="text-sm uppercase tracking-widest">{item.label}</span>
            {item.active && <ArrowRight className="w-4 h-4 ml-auto text-white animate-bounce-x" />}
          </Link>
        ))}
      </nav>
      <button onClick={onLogout} className="w-full flex items-center justify-between px-8 py-5 rounded-3xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/3 hover:border-white/10 transition-all duration-500 group mt-auto">
        <span className="text-sm font-black uppercase tracking-widest">Déconnexion</span>
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
    if (!confirm("🚨 ATTENTION : Supprimer définitivement ce média ?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (!error) setVideos(videos.filter(v => v.id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="min-h-28 py-6 md:py-0 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative overflow-hidden shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
              <Clapperboard className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">CONTENT STUDIO</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Nœud de Production Multimédia v2.0</p>
            </div>
          </div>

          <Link
            href="/admin/dashboard/videos/new"
            className="group relative px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-4xl hover:bg-slate-200 transition-all duration-500 flex items-center gap-4 overflow-hidden shadow-2xl"
          >
            <Plus className="w-5 h-5 relative z-10 transition-transform group-hover:rotate-90" />
            <span className="relative z-10">Publier un Reel</span>
          </Link>
        </header>

        <div className="grow overflow-y-auto custom-scrollbar pr-2 pb-10">
           {/* Analytic Sensors */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Reach Global", value: "2.4M", icon: Activity, color: "text-white", trend: "+12%" },
                { label: "Assets Archivés", value: videos.length, icon: Layers, color: "text-white", trend: "Sync" },
                { label: "Uptime Serveur", value: "99.9%", icon: Monitor, color: "text-white", trend: "Stable" },
                { label: "Engagement Rate", value: "14.2%", icon: Sparkles, color: "text-white", trend: "High" },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl bg-surface/20 border border-white/5 shadow-2xl group overflow-hidden relative transition-all hover:bg-surface/30">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-1000"></div>
                   <div className="flex items-center justify-between mb-6 relative z-10">
                      <div className="flex items-center gap-3">
                        <stat.icon className={`w-4 h-4 ${stat.color} opacity-40`} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">{stat.label}</span>
                      </div>
                      <span className="text-[8px] font-black text-white bg-white/10 px-2 py-1 rounded-lg border border-white/5">{stat.trend}</span>
                   </div>
                   <h3 className="text-3xl font-black font-heading text-white italic tracking-tighter uppercase relative z-10">{stat.value}</h3>
                </div>
              ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-video rounded-3xl bg-white/2 border border-white/5 animate-pulse shadow-2xl"></div>
                ))
              ) : videos.length === 0 ? (
                <div className="col-span-full py-32 text-center flex flex-col items-center bg-surface/20 rounded-3xl border border-white/5 border-dashed">
                   <div className="w-24 h-24 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 rotate-12 opacity-40">
                      <Video className="w-10 h-10 text-slate-500" />
                   </div>
                   <h3 className="text-2xl font-black font-heading uppercase italic text-slate-700 tracking-tight">Aucun Asset Enregistré</h3>
                   <p className="text-xs text-slate-600 mt-4 font-black uppercase tracking-[0.3em]">La médiathèque est vide</p>
                </div>
              ) : (
                videos.map((v) => (
                  <div key={v.id} className="group p-4 rounded-3xl bg-surface/20 border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden shadow-2xl flex flex-col">
                    <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-2xl mb-6 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)] transition-all">
                       <img src={v.thumbnail} alt="" className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all flex items-center justify-center">
                          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-all group-hover:bg-white shadow-2xl">
                             <Play className="w-6 h-6 text-white fill-white group-hover:text-black group-hover:fill-black transition-all" />
                          </div>
                       </div>
                       
                       <div className="absolute top-4 left-4 flex gap-2">
                          <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                             <span className="text-[8px] font-black uppercase tracking-widest text-white">4K STUDIO</span>
                          </div>
                       </div>

                       <div className="absolute bottom-4 right-4 flex gap-2 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                          <button className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:bg-slate-200 transition-all shadow-2xl">
                             <Share2 className="w-4 h-4" />
                          </button>
                          <button 
                             onClick={() => handleDelete(v.id)}
                             className="w-10 h-10 rounded-xl bg-black border border-white/10 text-white flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                    
                    <div className="px-2 pb-2 grow flex flex-col">
                       <div className="flex items-center justify-between mb-3">
                          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded-md border border-white/5">{v.platform || "Studio Clip"}</span>
                          <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">{new Date(v.created_at).toLocaleDateString()}</span>
                       </div>
                       <h3 className="font-black text-lg tracking-tight mb-4 text-white uppercase italic truncate">{v.title}</h3>
                       <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                <Activity className="w-3 h-3 text-white" /> {v.views || 0} VIEWS
                             </div>
                          </div>
                          <Link href={v.video_url} target="_blank" className="text-[8px] font-black text-white hover:text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                             LIVE SOURCE <ExternalLink className="w-3 h-3" />
                          </Link>
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
