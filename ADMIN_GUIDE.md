# 🛠️ Guide d'Administration : HM.ZONEDZ
Ce guide est destiné à l'administrateur chargé de la mise à jour des produits sur Supabase.

---

## 🏗️ Structure du Tableau `products`
Pour chaque produit, remplissez les colonnes exactement comme suit dans l'éditeur de table Supabase.

| Colonne | Description | Exemple de valeur |
| :--- | :--- | :--- |
| **`name`** | Le nom complet du produit | `PABLO ICE COLD` |
| **`category`** | Le type de produit (Filtre boutique) | `Snus` ou `Vape Jetable` |
| **`price`** | Le prix de vente affiché | `1 600 DZD` |
| **`old_price`** | Ancien prix (optionnel pour barre barrée) | `1 900 DZD` ou laissez vide |
| **`image_url`** | Lien vers l'image | `/assets/snus_pablo.png` |
| **`badge`** | Petit texte en haut à gauche (optionnel) | `TOP VENTE` ou `PROMO` |
| **`badge_color`** | Couleur de l'étiquette (voir codes ci-dessous) | `bg-[#ef4444]` |
| **`glow_color`** | Effet de lumière (voir codes ci-dessous) | `box-glow-green-hover` |

---

## 🎨 Dictionnaire des Styles (Copier/Coller)

### 1. Couleurs des Badges (`badge_color`)
Copiez exactement ces codes pour changer la couleur du petit texte en haut de l'image :
- **ROUGE (Agressif) :** `bg-[#ef4444]`
- **VERT (DZ Style) :** `bg-[#39ff14] text-black`
- **JAUNE (Nouveauté) :** `bg-[#facc15] text-black`
- **ROSE (Spécial) :** `bg-[#ff00ff]`
- **NOIR (Premium) :** `bg-black text-white border border-white/20`

### 2. Effets de Lumière (`glow_color`)
Cet effet apparaît quand on passe la souris sur le produit :
- **LUMINEUX VERT :** `box-glow-green-hover`
- **LUMINEUX ROUGE :** `hover:shadow-[0_0_25px_rgba(239,68,68,0.6)]`
- **LUMINEUX JAUNE :** `hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]`
- **DISCRET :** (Laisser vide)

---

## 📦 Les Catégories Autorisées
Pour que les filtres de la boutique fonctionnent, utilisez **exactement** ces noms :
- `Snus`
- `Vape Jetable`
- `Puff`
- `E-Liquides`

---

## 📸 Gestion des Photos
1. Téléchargez vos photos sur Supabase dans la section **Storage** > Dossier **"assets"**.
2. Copiez l'URL publique de la photo.
3. Collez l'URL dans la colonne `image_url`.

> [!IMPORTANT]
> **N'oubliez pas d'enregistrer !** Toutes les modifications faites dans Supabase s'affichent sur le site **hmzonedz.netlify.app** dès qu'un client rafraîchit la page. Pas besoin de redéployer le site pour des changements de prix ou de stock.
