import type { Metadata } from "next";
import { Inter, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: '--font-anton' });

export const metadata: Metadata = {
  title: "HM.ZONEDZ - N°1 en Algérie | Snus & Vapes",
  description: "Boutique N°1 en Algérie pour les Snus, Nicotine Pouches et Vapes. Livraison rapide 58 wilayas. Gros & Détail. Goûts puissants, style unique.",
};

import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "../components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${anton.variable} font-sans antialiased bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
