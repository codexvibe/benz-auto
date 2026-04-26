"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Settings, 
  Save, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Lock,
  LayoutDashboard,
  Video,
  MessageSquare,
  Eye,
  LogOut
} from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 7.1C2.6 5.8 3.6 4.8 4.9 4.7 7.3 4.5 12 4.5 12 4.5s4.7 0 7.1.2c1.3.1 2.3 1.1 2.4 2.4.2 1.6.2 4.9.2 4.9s0 3.3-.2 4.9c-.1 1.3-1.1 2.3-2.4 2.4-2.4.2-7.1.2-7.1.2s-4.7 0-7.1-.2c-1.3-.1-2.3-1.1-2.4-2.4-.2-1.6-.2-4.9-.2-4.9s0-3.3.2-4.9z"/>
    <polygon points="10 15 15 12 10 9 10 15"/>
  </svg>
);
import Link from "next/link";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    site_name: "Benz Auto DZ",
    phone: "+213 00 00 00 00",
    email: "contact@benzautodz.com",
    address: "Alger, Algérie",
    instagram: "benzauto_dz",
    youtube: "BenzAutoDZ",
    passcode: "ZONE2026",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) router.push("/admin");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In a real app, save to a 'settings' table in Supabase
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>

        <nav className="space-y-2 flex-grow">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Stock
          </Link>
          <Link href="/admin/dashboard/videos" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <Video className="w-5 h-5" />
            Vlogs & Tests
          </Link>
          <Link href="/admin/dashboard/inquiries" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all">
            <MessageSquare className="w-5 h-5" />
            Demandes
          </Link>
          <Link href="/admin/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff0000]/10 text-[#ff0000] font-medium">
            <Settings className="w-5 h-5" />
            Paramètres
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
      <main className="flex-grow p-4 md:p-10 max-w-4xl">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Paramètres du Site</h1>
          <p className="text-gray-500">Configurez vos informations de contact et accès admin.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
          {/* General Info */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff0000] rounded-full"></span>
              Coordonnées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="email" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Adresse Showroom</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff0000] rounded-full"></span>
              Réseaux Sociaux
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram (Nom d'utilisateur)</label>
                <div className="relative">
                  <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.instagram}
                    onChange={(e) => setFormData({...formData, instagram: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">YouTube (Nom de la chaîne)</label>
                <div className="relative">
                  <YoutubeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="text" 
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.youtube}
                    onChange={(e) => setFormData({...formData, youtube: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
              <Lock className="w-5 h-5" />
              Accès Admin
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Passcode Actuel</label>
              <input 
                type="text" 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-[#ff0000] outline-none font-mono text-lg tracking-widest"
                value={formData.passcode}
                onChange={(e) => setFormData({...formData, passcode: e.target.value})}
              />
              <p className="text-[10px] text-gray-600 mt-2">Attention: Changer ce code affectera votre prochain accès.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              type="submit" disabled={loading}
              className="px-10 py-4 bg-[#ff0000] text-white font-bold rounded-2xl hover:bg-[#cc0000] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,0,0.3)] disabled:opacity-50"
            >
              {loading ? "..." : <Save className="w-5 h-5" />}
              {loading ? "Enregistrement..." : "Enregistrer les Paramètres"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-500 animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-bold">Modifications enregistrées !</span>
              </div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
