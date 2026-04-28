"use client";

import { useState, useEffect } from "react";
import { createClient } from "../utils/supabase/client";

export function useSiteSettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
          // Ensure social_links is an object
          let sLinks = data.social_links;
          if (Array.isArray(sLinks) || !sLinks) {
            sLinks = {};
          }
          setSettings({ ...data, social_links: sLinks });
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
