"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Car, LayoutDashboard, Video, MessageSquare, Settings, Eye, LogOut,
  Users, Tag, Phone, Search, User, Clock, CheckCircle2, XCircle,
  Package, ChevronRight, Mail, Filter, ArrowUpRight, Globe, ArrowRight,
  Activity, ShieldCheck, Layers, MoreVertical
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../utils/supabase/client";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/dashboard/stock", icon: Package, label: "Inventory" },
  { href: "/admin/dashboard/clients", icon: Users, label: "CRM", active: true },
  { href: "/admin/dashboard/videos", icon: Video, label: "Media" },
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
          <span className="font-heading font-black text-2xl tracking-tight text-white block">OSIRIS</span>
          <span className="text-[10px] text-[#38BDF8] font-bold uppercase tracking-[0.3em] mt-1 block">Benz Auto Core</span>
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
    <div className="min-h-screen bg-[#05070A] text-slate-200 flex p-6 gap-6 font-sans selection:bg-[#38BDF8]/30 overflow-hidden">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-grow flex flex-col min-w-0 h-[calc(100vh-3rem)]">
        {/* Header */}
        <header className="h-28 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] mb-6 flex items-center justify-between px-10 shadow-xl relative shrink-0">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-white font-heading uppercase italic">Entity Database</h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">CRM Identity Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-6 py-3 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[10px] font-black text-[#38BDF8] uppercase tracking-widest shadow-xl">
                {clients.length} Sync Profiles
             </div>
          </div>
        </header>

        <div className="flex-grow flex gap-6 min-h-0">
          {/* Identity Feed */}
          <div className="w-[40%] flex flex-col gap-6">
             <div className="p-8 bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden h-full">
                <div className="mb-8">
                   <div className="relative group">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#38BDF8] transition-colors" />
                      <input
                        type="text"
                        placeholder="Search identity or signal..."
                        className="w-full bg-black/20 border border-white/5 rounded-[2rem] py-5 pl-14 pr-8 text-sm focus:outline-none focus:border-[#38BDF8]/50 transition-all font-medium text-slate-300 placeholder:text-slate-700"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                   </div>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 space-y-2">
                   {loading ? (
                     <div className="py-20 text-center animate-pulse"><div className="w-8 h-8 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                   ) : filtered.length === 0 ? (
                     <div className="py-20 text-center text-slate-700 font-black uppercase tracking-widest italic text-xs">No identities found in cluster</div>
                   ) : (
                     filtered.map((c, i) => (
                       <button
                         key={i}
                         onClick={() => setSelectedClient(c)}
                         className={`w-full flex items-center gap-6 px-8 py-6 rounded-[2.5rem] transition-all duration-500 relative overflow-hidden group ${selectedClient?.phone === c.phone ? 'bg-white/[0.03] border border-white/10 shadow-2xl scale-[1.02]' : 'bg-transparent border border-transparent hover:bg-white/[0.01]'}`}
                       >
                         {selectedClient?.phone === c.phone && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]"></div>}
                         <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-xl transition-all duration-700 ${selectedClient?.phone === c.phone ? 'bg-[#38BDF8] text-white rotate-3' : 'bg-slate-900 text-slate-600 border border-white/5 group-hover:text-[#38BDF8] group-hover:scale-110'}`}>
                           {c.name?.[0]?.toUpperCase() || '?'}
                         </div>
                         <div className="text-left flex-grow">
                           <p className={`font-black text-lg tracking-tight transition-colors ${selectedClient?.phone === c.phone ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{c.name}</p>
                           <p className="text-[10px] text-slate-600 font-black tracking-widest mt-1 uppercase">{c.phone}</p>
                         </div>
                         <div className="text-right">
                            <div className="text-sm font-black text-[#38BDF8] italic">{c.orders.length}</div>
                            <div className="text-[8px] font-black uppercase text-slate-800 tracking-tighter">Events</div>
                         </div>
                       </button>
                     ))
                   )}
                </div>
             </div>
          </div>

          {/* Core Profile Area */}
          <div className="flex-grow flex flex-col h-full overflow-hidden">
             {!selectedClient ? (
               <div className="flex-grow flex flex-col items-center justify-center bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 border-dashed rounded-[3.5rem]">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 rotate-12 opacity-40">
                     <User className="w-10 h-10 text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-black font-heading uppercase italic text-slate-700 tracking-tight">Access Terminal</h3>
                  <p className="text-xs text-slate-600 mt-4 font-black uppercase tracking-[0.3em]">Awaiting Identity Selection</p>
               </div>
             ) : (
               <div className="flex-grow flex flex-col gap-6 min-h-0">
                  {/* Identity Badge */}
                  <div className="p-12 bg-gradient-to-br from-[#0F172A] to-[#05070A] border border-white/5 rounded-[3.5rem] flex items-center gap-12 relative overflow-hidden shadow-2xl shrink-0">
                     <div className="absolute top-0 right-0 w-96 h-96 bg-[#38BDF8]/5 rounded-full blur-[100px]"></div>
                     <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-tr from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-white font-black text-6xl shadow-[0_0_50px_rgba(56,189,248,0.3)] border border-white/10 relative z-10 rotate-3">
                        {selectedClient.name?.[0]?.toUpperCase()}
                     </div>
                     <div className="relative z-10 space-y-6">
                        <h2 className="text-6xl font-black tracking-tighter font-heading uppercase italic text-white">{selectedClient.name}</h2>
                        <div className="flex flex-wrap gap-4 items-center">
                           <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-black text-[#38BDF8] uppercase tracking-widest shadow-xl">
                              <Phone className="w-4 h-4" /> {selectedClient.phone}
                           </div>
                           <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/[0.03] border border-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Clock className="w-4 h-4" /> Initiated: {formatDate(selectedClient.firstContact)}
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Log Surface */}
                  <div className="flex-grow bg-[#0F172A]/40 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] flex flex-col overflow-hidden shadow-2xl shadow-black/50">
                     <div className="p-10 border-b border-white/[0.05] flex items-center justify-between shrink-0">
                        <h3 className="font-black text-xl font-heading uppercase italic tracking-tighter flex items-center gap-4 text-white">
                           <Activity className="w-6 h-6 text-[#38BDF8]" /> Interaction Protocol
                        </h3>
                        <div className="text-[10px] font-black uppercase text-[#38BDF8] bg-[#38BDF8]/10 px-6 py-2 rounded-full border border-[#38BDF8]/20 tracking-[0.2em]">
                           {selectedClient.orders.length} Logged Transactions
                        </div>
                     </div>
                     <div className="flex-grow p-10 overflow-y-auto custom-scrollbar space-y-8">
                        {selectedClient.orders.map((order: any, idx: number) => (
                          <div key={order.id} className="relative pl-12 group/item">
                             {idx !== selectedClient.orders.length - 1 && (
                               <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-white/[0.03]"></div>
                             )}
                             <div className="absolute left-0 top-0 w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center z-10 group-hover/item:border-[#38BDF8]/50 group-hover/item:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all">
                                <div className={`w-2.5 h-2.5 rounded-full ${
                                   order.status === "En attente" ? "bg-amber-400 shadow-[0_0_10px_#fbbf24] animate-pulse" :
                                   order.status === "Traité" ? "bg-emerald-400 shadow-[0_0_10px_#34d399]" :
                                   "bg-red-400 shadow-[0_0_10px_#f87171]"
                                }`}></div>
                             </div>
                             <div className="p-8 rounded-[3rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-[#38BDF8]/20 transition-all duration-500 flex items-center justify-between gap-10 shadow-xl">
                                <div className="flex-grow">
                                   <div className="flex items-center gap-4 mb-3">
                                      <p className="font-black text-2xl tracking-tighter text-white italic uppercase">{order.items_list || "Standard Inquiry"}</p>
                                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-xl border ${
                                         order.status === "En attente" ? "bg-amber-400/5 text-amber-400 border-amber-400/10" :
                                         order.status === "Traité" ? "bg-emerald-400/5 text-emerald-400 border-emerald-400/10" :
                                         "bg-red-400/5 text-red-400 border-red-400/10"
                                      }`}>{order.status}</span>
                                   </div>
                                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{formatDate(order.created_at)} · HEXID: 0x{order.id.toString(16).toUpperCase()}</p>
                                </div>
                                <div className="flex gap-3">
                                   <button
                                     onClick={() => updateOrderStatus(order.id, "Traité")}
                                     className={`p-4 rounded-2xl transition-all border shadow-lg ${order.status === "Traité" ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/5 text-slate-700 hover:text-emerald-400 hover:border-emerald-400/30"}`}
                                     title="Complete Log"
                                   >
                                      <CheckCircle2 className="w-6 h-6" />
                                   </button>
                                   <button
                                     onClick={() => updateOrderStatus(order.id, "Annulé")}
                                     className={`p-4 rounded-2xl transition-all border shadow-lg ${order.status === "Annulé" ? "bg-red-400/10 border-red-400/20 text-red-400" : "bg-white/[0.03] border-white/5 text-slate-700 hover:text-red-400 hover:border-red-400/30"}`}
                                     title="Void Log"
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
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(56,189,248,0.2); }
      `}</style>
    </div>
  );
}
