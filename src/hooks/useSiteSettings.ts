"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

// Global cache to prevent flickering between page navigations (in-memory)
let cachedSettings: any = null;

export function useSiteSettings() {
  // Tentative de lecture synchrone pour éviter TOUT clignotement
  const [settings, setSettings] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem("site_settings_cache");
      return local ? JSON.parse(local) : cachedSettings;
    }
    return cachedSettings;
  });
  
  const [loading, setLoading] = useState(!settings);
  const supabase = createClient();

  useEffect(() => {
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

