import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit', display: 'swap' });

export const metadata: Metadata = {
  title: "Benz Auto DZ | L'Excellence Automobile en Algérie",
  description: "Boutique N°1 en Algérie pour les revues automobiles, les visites de showrooms et la vente de véhicules premium.",
  keywords: ["automobile", "Algérie", "Benz Auto", "showroom premium", "revues auto"],
  authors: [{ name: "Benz Auto DZ" }],
  openGraph: {
    title: "Benz Auto DZ | L'Excellence Automobile en Algérie",
    description: "Boutique N°1 en Algérie pour les revues automobiles, les visites de showrooms et la vente de véhicules premium.",
    url: "https://benzautodz.com",
    siteName: "Benz Auto DZ",
    images: [
      {
        url: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Benz Auto DZ",
      },
    ],
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Benz Auto DZ | L'Excellence Automobile en Algérie",
    description: "Boutique N°1 en Algérie pour les revues automobiles, les visites de showrooms et la vente de véhicules premium.",
    images: ["https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop"],
  },
};

import { ThemeProvider } from "../components/ThemeProvider";
import { CompareProvider } from "../context/CompareContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-black text-white selection:bg-neon-purple selection:text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CompareProvider>
            {children}
          </CompareProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
