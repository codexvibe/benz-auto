"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Video, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";

export default function NewVideoPage() {
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    platform: "youtube",
    views: "",
    duration: "",
    video_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) router.push("/admin");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("videos")
      .insert([formData]);

    if (error) {
      setError("Erreur: Assurez-vous que la table 'videos' existe dans Supabase.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard/videos");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/dashboard/videos" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour aux Vidéos</span>
        </Link>

        <header className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/20">
            <Video className="w-8 h-8 text-[#ff0000]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Nouvelle Revue Vidéo</h1>
            <p className="text-gray-500">Ajoutez un nouveau vlog ou test automobile.</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Titre de la vidéo</label>
              <input 
                type="text" required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ff0000]"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Plateforme</label>
              <select 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ff0000]"
                value={formData.platform}
                onChange={(e) => setFormData({...formData, platform: e.target.value})}
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre de vues</label>
              <input 
                type="text" placeholder="ex: 124K"
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ff0000]"
                value={formData.views}
                onChange={(e) => setFormData({...formData, views: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">URL Miniature (Thumbnail)</label>
              <input 
                type="text" required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ff0000]"
                value={formData.thumbnail}
                onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">URL de la vidéo</label>
              <input 
                type="text" required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:outline-none focus:border-[#ff0000]"
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit" disabled={loading}
            className="w-full py-4 bg-[#ff0000] text-white font-bold rounded-xl hover:bg-[#cc0000] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? "Enregistrement..." : "Publier la vidéo"}
          </button>
        </form>
      </div>
    </div>
  );
}
