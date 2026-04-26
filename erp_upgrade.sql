-- ==========================================
-- PHASE 1: ERP UPGRADE - SUPABASE SQL
-- ==========================================

-- 1. Table des Paramètres du site (Pour le Mode Maintenance)
CREATE TABLE IF NOT EXISTS site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assurer qu'il n'y a qu'une seule ligne de paramètres
INSERT INTO site_settings (id, maintenance_mode) 
VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow admin all settings" ON site_settings FOR ALL USING (true);
