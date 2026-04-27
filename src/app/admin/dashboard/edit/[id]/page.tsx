"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ChevronLeft, Car, AlertCircle, LayoutDashboard, Package, Users,
  Video, MessageSquare, Tag, Settings, Eye, LogOut, Globe, ArrowRight,
  Layers, Plus, Activity
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";
import { VehicleForm } from "../../../../../components/Admin/VehicleForm";

import { Sidebar } from "../../../../../components/Admin/Sidebar";


export default function EditVehiclePage() {
  const [vehicle, setVehicle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchVehicle();
  }, [params.id]);

  const fetchVehicle = async () => {
    const { data } = await supabase.from("products").select("*").eq("id", params.id).single();
    if (data) setVehicle(data);
    else setError("Identité de l'actif introuvable dans le cluster de base de données.");
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setSaving(true);
    setError("");
    const { error } = await supabase.from("products").update(data).eq("id", params.id);
    if (error) { setError(error.message); setSaving(false); }
    else { router.push("/admin/dashboard/stock"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,255,255,0.1)]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 gap-4 font-sans">
      <Sidebar onLogout={handleLogout} />
      <main className="grow flex flex-col min-w-0 gap-4">
        <header className="bg-surface border border-white/5 rounded-3xl px-8 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 relative z-10">
             <Link href="/admin/dashboard/stock" className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                <ChevronLeft className="w-5 h-5 text-white" />
             </Link>
             <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Modification</h1>
                <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em] mt-0.5">Modification de : {vehicle?.name}</p>
             </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-black text-white shadow-xl">
             ID: {params?.id || "???"}
          </div>
        </header>

        <div className="grow overflow-y-auto pr-2 custom-scrollbar">
           {error && (
             <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3 text-xs font-bold">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
             </div>
           )}
           <VehicleForm initialData={vehicle} onSubmit={handleSubmit} loading={saving} />
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
