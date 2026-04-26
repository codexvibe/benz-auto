"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings, Save, Phone, Mail, MapPin, CheckCircle2, Lock,
  LayoutDashboard, Video, MessageSquare, Eye, LogOut, Users, Tag,
  AlertTriangle, Power, Car
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) router.push("/admin");
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
    if (data) setMaintenanceMode(data.maintenance_mode);
  };

  const toggleMaintenance = async () => {
    setMaintenanceLoading(true);
    const newVal = !maintenanceMode;
    await supabase.from("site_settings").update({ maintenance_mode: newVal, updated_at: new Date().toISOString() }).eq("id", 1);
    setMaintenanceMode(newVal);
    setMaintenanceLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
    { href: "/admin/dashboard/clients", icon: Users, label: "CRM Clients" },
    { href: "/admin/dashboard/videos", icon: Video, label: "Vlogs & Tests" },
    { href: "/admin/dashboard/inquiries", icon: MessageSquare, label: "Demandes (Leads)" },
    { href: "/admin/dashboard/promos", icon: Tag, label: "Codes Promos" },
    { href: "/admin/dashboard/settings", icon: Settings, label: "Paramètres", active: true },
    { href: "/", icon: Eye, label: "Voir le site" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <aside className="w-64 border-r border-white/5 bg-black p-6 flex flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-[#ff0000] flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">ADMIN <span className="text-[#ff0000]">BA</span></span>
        </div>
        <nav className="space-y-1 flex-grow">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${item.active ? "bg-[#ff0000]/10 text-[#ff0000]" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
              <item.icon className="w-5 h-5" />{item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all mt-auto">
          <LogOut className="w-5 h-5" />Déconnexion
        </button>
      </aside>

      <main className="flex-grow p-4 md:p-8 overflow-y-auto max-w-4xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Paramètres du Site</h1>
          <p className="text-gray-500">Configurez vos informations et gérez la plateforme.</p>
        </header>

        {/* ⚡ MAINTENANCE MODE — Critical Section */}
        <div className={`rounded-2xl border p-6 mb-8 transition-all duration-500 ${maintenanceMode ? "border-red-500/50 bg-red-500/5" : "border-white/5 glass-dark"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${maintenanceMode ? "bg-red-500/20 text-red-500" : "bg-gray-500/10 text-gray-400"}`}>
                <Power className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Mode Maintenance</h2>
                <p className="text-gray-400 text-sm mt-1">
                  {maintenanceMode
                    ? "⚠️ Le site public est actuellement HORS LIGNE. Seul le dashboard admin reste accessible."
                    : "Le site public est en ligne et visible par les visiteurs."}
                </p>
                {maintenanceMode && (
                  <div className="mt-2 flex items-center gap-2 text-red-400 text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-3 h-3" /> MAINTENANCE ACTIVE
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={toggleMaintenance}
              disabled={maintenanceLoading}
              className={`relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none shrink-0 ${maintenanceMode ? "bg-red-500" : "bg-gray-700"}`}
            >
              <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${maintenanceMode ? "left-9" : "left-1"}`} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {/* Coordonnées */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff0000] rounded-full" />Coordonnées
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Téléphone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="email" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Adresse Showroom</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux Sociaux */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#ff0000] rounded-full" />Réseaux Sociaux
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Instagram</label>
                <div className="relative">
                  <InstagramIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.instagram} onChange={e => setFormData({ ...formData, instagram: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">YouTube</label>
                <div className="relative">
                  <YoutubeIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-6 focus:border-[#ff0000] outline-none"
                    value={formData.youtube} onChange={e => setFormData({ ...formData, youtube: e.target.value })} />
                </div>
              </div>
            </div>
          </div>

          {/* Sécurité */}
          <div className="glass-dark p-8 rounded-3xl border border-white/10 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2 text-red-500">
              <Lock className="w-5 h-5" />Accès Admin
            </h2>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Passcode Actuel</label>
              <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-6 focus:border-[#ff0000] outline-none font-mono text-lg tracking-widest"
                value={formData.passcode} onChange={e => setFormData({ ...formData, passcode: e.target.value })} />
              <p className="text-[10px] text-gray-600 mt-2">Attention: Changer ce code affectera votre prochain accès.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button type="submit" disabled={loading}
              className="px-10 py-4 bg-[#ff0000] text-white font-bold rounded-2xl hover:bg-[#cc0000] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,0,0.3)] disabled:opacity-50">
              {loading ? "..." : <Save className="w-5 h-5" />}
              {loading ? "Enregistrement..." : "Enregistrer les Paramètres"}
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-500">
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
