"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  LogOut, 
  Video, 
  LayoutDashboard,
  Eye,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) {
      router.push("/admin");
      return;
    }
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("videos") // I'll assume this table exists or will be created
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setVideos(data);
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette vidéo ?")) return;

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (!error) {
      setVideos(videos.filter(v => v.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar (Duplicate for consistency) */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Stock
          </Link>
          <Link href="/admin/dashboard/videos" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff0000]/10 text-[#ff0000] font-medium">
            <Video className="w-5 h-5" />
            Vlogs & Tests
          </Link>
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Eye className="w-5 h-5" />
            Voir le site
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vlogs & Tests Vidéo</h1>
            <p className="text-gray-500">Gérez vos revues YouTube et Instagram.</p>
          </div>
          <Link 
            href="/admin/dashboard/videos/new" 
            className="px-6 py-3 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter une vidéo
          </Link>
        </header>

        <div className="glass-dark rounded-3xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="font-bold text-lg">Dernières Vidéos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-xs text-gray-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Vidéo</th>
                  <th className="px-6 py-4">Plateforme</th>
                  <th className="px-6 py-4">Vues</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {videos.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-500">Aucune vidéo trouvée</td></tr>
                ) : (
                  videos.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 aspect-video rounded bg-gray-900 overflow-hidden">
                            <img src={v.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="font-bold text-sm truncate max-w-xs">{v.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded bg-white/5 text-xs uppercase">{v.platform}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">{v.views}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => handleDelete(v.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
