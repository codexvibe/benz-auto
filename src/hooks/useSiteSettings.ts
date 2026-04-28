"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

// Global cache to prevent flickering between page navigations (in-memory)
let cachedSettings: any = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);
  const supabase = createClient();

  useEffect(() => {
    // 1. Essayer de charger depuis le localStorage pour un affichage instantané
    if (!cachedSettings) {
      const local = localStorage.getItem("site_settings_cache");
      if (local) {
        try {
          const parsed = JSON.parse(local);
          cachedSettings = parsed;
          setSettings(parsed);
          setLoading(false);
        } catch (e) {
          console.error("Local cache error:", e);
        }
      }
    }

    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .single();

        if (error) throw error;
        
        if (data) {
          let sLinks = data.social_links;
          if (Array.isArray(sLinks) || !sLinks) {
            sLinks = {};
          }
          const updated = { ...data, social_links: sLinks };
          
          // Mettre à jour le cache mémoire et local
          cachedSettings = updated;
          localStorage.setItem("site_settings_cache", JSON.stringify(updated));
          setSettings(updated);
        }
      } catch (err) {
        console.error("Error fetching site settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}

