"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Phone, Search, User, Clock, CheckCircle2, XCircle,
  Package, ChevronRight, Mail, Filter, ArrowUpRight, Globe, ArrowRight,
  Activity, ShieldCheck, Layers, MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Vue d'ensemble" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventaire" },
  { href: "/admin/dashboard/clients", icon: Users, label: "Clients", active: true },
  { href: "/admin/dashboard/videos", icon: Video, label: "Médias (Reels)" },
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

export default function CRMClientsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const session = localStorage.getItem("admin_session");
    if (!session) { router.push("/admin"); return; }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    const allOrders = data || [];
    setOrders(allOrders);

    const clientMap: Record<string, any> = {};
    allOrders.forEach((order: any) => {
      const key = order.customer_phone;
      if (!clientMap[key]) {
        clientMap[key] = {
          name: order.customer_name,
          phone: order.customer_phone,
          orders: [],
          firstContact: order.created_at,
          lastContact: order.created_at,
        };
      }
      clientMap[key].orders.push(order);
      if (new Date(order.created_at) > new Date(clientMap[key].lastContact)) {
        clientMap[key].lastContact = order.created_at;
      }
    });
    setClients(Object.values(clientMap));
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    fetchOrders();
    if (selectedClient) {
      setSelectedClient((prev: any) => ({
        ...prev,
        orders: prev.orders.map((o: any) => o.id === orderId ? { ...o, status } : o),
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    router.push("/admin");
  };

  const filtered = clients.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-background text-slate-200 flex flex-col xl:flex-row p-4 md:p-6 gap-4 md:gap-6 font-sans overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <main className="grow flex flex-col min-w-0 h-full xl:h-[calc(100vh-3rem)]">
        {/* Header */}
        <header className="min-h-28 py-6 md:py-0 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 px-6 md:px-10 shadow-xl relative shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-white/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase">Base de Données</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Gestion CRM & Identités</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest shadow-xl">
                {clients.length} Profils Synchronisés
             </div>
          </div>
        </header>

        <div className="grow flex flex-col xl:flex-row gap-6 min-h-0 overflow-y-auto xl:overflow-hidden pb-10 xl:pb-0">
          {/* Identity Feed */}
          <div className="w-full xl:w-[40%] flex flex-col gap-6 h-full min-h-125 xl:min-h-0">
             <div className="p-8 bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden h-full">
                <div className="mb-8">
                   <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-white transition-colors" />
                      <input
                        type="text"
                        placeholder="Rechercher une identité..."
                        className="w-full bg-black/20 border border-white/5 rounded-4xl py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-white/20 transition-all font-medium text-slate-300 placeholder:text-slate-700"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                   </div>
                </div>

                <div className="grow overflow-y-auto custom-scrollbar pr-2 space-y-2">
                   {loading ? (
                     <div className="py-20 text-center animate-pulse"><div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                   ) : filtered.length === 0 ? (
                     <div className="py-20 text-center text-slate-700 font-black uppercase tracking-widest italic text-xs">Aucun profil trouvé</div>
                   ) : (
                     filtered.map((c, i) => (
                       <button
                         key={i}
                         onClick={() => setSelectedClient(c)}
                         className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden group ${selectedClient?.phone === c.phone ? 'bg-white/3 border border-white/10 shadow-2xl scale-[1.02] hover:bg-white/1' : 'bg-transparent border border-transparent hover:bg-white/1'}`}
                       >
                         {selectedClient?.phone === c.phone && <div className="absolute left-0 top-0 w-1 h-full bg-white"></div>}
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all duration-700 ${selectedClient?.phone === c.phone ? 'bg-white text-black rotate-3' : 'bg-surface text-slate-600 border border-white/5 group-hover:text-white group-hover:scale-110'}`}>
                           {c.name?.[0]?.toUpperCase() || '?'}
                         </div>
                         <div className="text-left grow">
                           <p className={`font-black text-lg tracking-tight transition-colors ${selectedClient?.phone === c.phone ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{c.name}</p>
                           <p className="text-[10px] text-slate-600 font-black tracking-widest mt-1 uppercase">{c.phone}</p>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-black text-white italic">{c.orders.length}</div>
                            <div className="text-[8px] font-black uppercase text-slate-800 tracking-tighter">Événements</div>
                         </div>
                       </button>
                     ))
                   )}
                </div>
             </div>
          </div>

          {/* Core Profile Area */}
          <div className="grow flex flex-col h-full xl:overflow-hidden min-h-150 xl:min-h-0">
             {!selectedClient ? (
               <div className="grow flex flex-col items-center justify-center bg-surface/20 backdrop-blur-3xl border border-white/5 border-dashed rounded-[3.5rem]">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/2 border border-white/5 flex items-center justify-center mb-8 rotate-12 opacity-40">
                     <User className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-black font-heading uppercase italic text-slate-700 tracking-tight">Terminal d'Accès</h3>
                  <p className="text-xs text-slate-600 mt-4 font-black uppercase tracking-[0.3em]">En attente de sélection</p>
               </div>
             ) : (
               <div className="grow flex flex-col gap-6 min-h-0">
                  {/* Identity Badge */}
                  <div className="p-8 md:p-12 bg-linear-to-br from-surface to-background border border-white/5 rounded-[3.5rem] flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden shadow-2xl shrink-0">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[100px]"></div>
                     <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] bg-white text-black flex items-center justify-center font-black text-5xl md:text-6xl shadow-2xl border border-white/10 relative z-10 rotate-3 shrink-0">
                        {selectedClient.name?.[0]?.toUpperCase()}
                     </div>
                     <div className="relative z-10 space-y-6 text-center md:text-left grow min-w-0">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-heading uppercase italic text-white truncate">{selectedClient.name}</h2>
                        <div className="flex flex-wrap gap-4 items-center justify-center md:justify-start">
                           <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/3 border border-white/5 text-sm font-black text-white uppercase tracking-widest shadow-xl">
                              <Phone className="w-4 h-4" /> {selectedClient.phone}
                           </div>
                           <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/3 border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Clock className="w-4 h-4" /> Initié: {formatDate(selectedClient.firstContact)}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Log Surface */}
                  <div className="grow bg-surface/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] flex flex-col overflow-hidden shadow-2xl shadow-black/50">
                     <div className="p-10 border-b border-white/5 flex items-center justify-between shrink-0">
                        <h3 className="font-black text-xl font-heading uppercase italic tracking-tighter flex items-center gap-4 text-white">
                           <Activity className="w-6 h-6 text-white" /> Protocole d'Interaction
                        </h3>
                        <div className="text-[10px] font-black uppercase text-white bg-white/10 px-6 py-2 rounded-full border border-white/20 tracking-[0.2em]">
                           {selectedClient.orders.length} Transactions Logguées
                        </div>
                     </div>
                     <div className="grow p-10 overflow-y-auto custom-scrollbar space-y-8">
                        {selectedClient.orders.map((order: any, idx: number) => (
                          <div key={order.id} className="relative pl-12 group/item">
                             {idx !== selectedClient.orders.length - 1 && (
                               <div className="absolute left-5.75 top-12 bottom-0 w-0.5 bg-white/3"></div>
                             )}
                             <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-surface border border-white/5 flex items-center justify-center z-10 group-hover/item:border-white/50 group-hover/item:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                   order.status === "En attente" ? "bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse" :
                                   order.status === "Traité" ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" :
                                   "bg-red-400 shadow-[0_0_10px_#f87171]"
                                }`}></div>
                             </div>
                             <div className="p-8 rounded-[3rem] bg-white/2 border border-white/5 hover:bg-white/4 hover:border-white/20 transition-all duration-500 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10 shadow-xl">
                                <div className="grow text-center md:text-left">
                                   <div className="flex flex-col md:flex-row items-center gap-4 mb-3">
                                      <p className="font-black text-2xl tracking-tighter text-white italic uppercase">{order.items_list || "Demande Standard"}</p>
                                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${
                                         order.status === "En attente" ? "bg-amber-400/5 text-amber-400 border-amber-400/10" :
                                         order.status === "Traité" ? "bg-white/5 text-white border-white/10" :
                                         "bg-red-400/5 text-red-400 border-red-400/10"
                                      }`}>{order.status}</span>
                                   </div>
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{formatDate(order.created_at)} · HEXID: 0x{order.id.toString(16).toUpperCase()}</p>
                                </div>
                                <div className="flex gap-3">
                                   <button
                                     onClick={() => updateOrderStatus(order.id, "Traité")}
                                     className={`p-4 rounded-2xl transition-all border shadow-lg ${order.status === "Traité" ? "bg-white/10 border-white/20 text-white" : "bg-surface border-white/5 text-slate-700 hover:text-white hover:border-white/30"}`}
                                     title="Marquer comme Traité"
                                   >
                                      <CheckCircle2 className="w-6 h-6" />
                                   </button>
                                   <button
                                     onClick={() => updateOrderStatus(order.id, "Annulé")}
                                     className={`p-4 rounded-2xl transition-all border shadow-lg ${order.status === "Annulé" ? "bg-red-400/10 border-red-400/20 text-red-400" : "bg-surface border-white/5 text-slate-700 hover:text-red-400 hover:border-red-400/30"}`}
                                     title="Annuler"
                                   >
                                      <XCircle className="w-6 h-6" />
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
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
