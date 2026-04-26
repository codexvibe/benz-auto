"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ChevronLeft, Car, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "../../../../../utils/supabase/client";
import { VehicleForm } from "../../../../../components/Admin/VehicleForm";

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
    if (!session) {
      router.push("/admin");
      return;
    }

    fetchVehicle();
  }, [params.id]);

  const fetchVehicle = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single();

    if (data) setVehicle(data);
    else setError("Véhicule introuvable");
    setLoading(false);
  };

  const handleSubmit = async (data: any) => {
    setSaving(true);
    setError("");

    const { error } = await supabase
      .from("products")
      .update(data)
      .eq("id", params.id);

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center">Chargement...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Retour au Dashboard</span>
        </Link>

        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#ff0000]/10 flex items-center justify-center border border-[#ff0000]/20">
              <Car className="w-8 h-8 text-[#ff0000]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Modifier le Véhicule</h1>
              <p className="text-gray-500">Mettez à jour les détails du modèle {vehicle?.name}.</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        <VehicleForm initialData={vehicle} onSubmit={handleSubmit} loading={saving} />
      </div>
    </div>
  );
}
