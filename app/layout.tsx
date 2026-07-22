import type { Metadata } from "next";
import {
  Anton,
  Inter,
  IBM_Plex_Mono,
  Bebas_Neue,
} from "next/font/google";

import GrainOverlay from "@/components/ui/GrainOverlay";
import CustomCursor from "@/components/ui/CustomCursor";
import LoadingScreen from "@/components/ui/LoadingScreen";
import LayoutWrapper from "@/components/LayoutWrapper";

import "./globals.css";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://owa-store.example"),

  title: {
    default: "O.W.A — Oranais With Attitude",
    template: "%s · O.W.A",
  },

  description:
    "O.W.A — streetwear premium. Hoodies, t-shirts et accessoires en édition limitée.",

  keywords: [
    "O.W.A",
    "Streetwear",
    "Algeria",
    "Premium Clothing",
  ],

  openGraph: {
    title: "O.W.A",
    description:
      "Streetwear premium. Nouvelles pièces chaque mois.",
    locale: "fr_DZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${anton.variable} ${bebas.variable} ${inter.variable} ${plexMono.variable}`}
    >
      <body className="font-body antialiased">
        <LoadingScreen />
        <GrainOverlay />
        <CustomCursor />

        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}