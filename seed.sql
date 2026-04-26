-- ==========================================
-- SCRIPT DE REMPLISSAGE (SEEDING) BENZ AUTO DZ
-- ==========================================
-- Ce script insère des véhicules premium pour remplir votre showroom immédiatement.

TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, category, price, image_url, description, year, mileage, location, engine, power, transmission, fuel, is_featured, status)
VALUES
('Mercedes-Benz G63 AMG', 'SUV', '55 000 000 DZD', 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?q=80&w=1200&auto=format&fit=crop', 'Le summum du luxe tout-terrain. Finition carbone, intérieur cuir rouge.', '2024', '0 km (Neuf)', 'Showroom Alger', 'V8 4.0L Biturbo', '585 ch', 'Automatique', 'Essence', true, 'Disponible'),
('Porsche 911 GT3 RS', 'Sportive', '62 000 000 DZD', 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1200&auto=format&fit=crop', 'Prête pour le circuit. Aérodynamisme actif et moteur atmosphérique.', '2024', '150 km', 'Showroom Alger', 'Flat-6 4.0L', '525 ch', 'PDK', 'Essence', true, 'Disponible'),
('Audi RS Q8', 'SUV', '38 000 000 DZD', 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=1200&auto=format&fit=crop', 'Le SUV le plus rapide de chez Audi Sport. Confort et performance.', '2023', '12 000 km', 'Showroom Oran', 'V8 4.0L TFSI', '600 ch', 'Tiptronic', 'Essence', false, 'Disponible'),
('Range Rover Sport SV', 'SUV', '45 000 000 DZD', 'https://images.unsplash.com/photo-1606016159991-cdf4a33237f6?q=80&w=1200&auto=format&fit=crop', 'Édition limitée SV. Suspension 6D Dynamics et sièges Body and Soul.', '2024', '0 km (Neuf)', 'Showroom Alger', 'V8 4.4L Twin Turbo', '635 ch', 'Automatique', 'Essence', true, 'Arrivage'),
('BMW M5 Competition', 'Berline', '28 000 000 DZD', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop', 'La berline haute performance par excellence. Transmission M xDrive.', '2022', '25 000 km', 'Showroom Constantine', 'V8 4.4L', '625 ch', 'M Steptronic', 'Essence', false, 'Disponible'),
('Lamborghini Urus S', 'SUV', '75 000 000 DZD', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1200&auto=format&fit=crop', 'Le Super SUV polyvalent. Performance de supercar et confort quotidien.', '2024', '0 km (Neuf)', 'Showroom Alger', 'V8 4.0L', '666 ch', 'Automatique', 'Essence', true, 'Réservé');

-- Seed for videos table
TRUNCATE videos RESTART IDENTITY CASCADE;

INSERT INTO videos (title, thumbnail, platform, views, duration, video_url)
VALUES
('TEST DRIVE: MG GT 2024 - Le meilleur rapport qualité/prix ?', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800&auto=format&fit=crop', 'youtube', '124K', '14:20', 'https://youtube.com/watch?v=example1'),
('MARCHÉ DE TIDJELABINE: Les vrais prix aujourd''hui !', 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop', 'youtube', '89K', '22:15', 'https://youtube.com/watch?v=example2'),
('VW TIGUAN R-Line - Walkaround & Exhaust Sound', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop', 'instagram', '45K', '01:00', 'https://instagram.com/p/example3');
