"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

// Global cache to prevent flickering between page navigations
let cachedSettings: any = null;

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(cachedSettings);
  const [loading, setLoading] = useState(!cachedSettings);
  const supabase = createClient();

  useEffect(() => {
    // If already cached, don't show loading but still refresh in background
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("*")
          .single();

        if (error) throw error;
        
        if (data) {
          // Ensure social_links is an object
          let sLinks = data.social_links;
          if (Array.isArray(sLinks) || !sLinks) {
            sLinks = {};
          }
          const updated = { ...data, social_links: sLinks };
          cachedSettings = updated;
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

