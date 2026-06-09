import {
  Space_Grotesk,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
  Great_Vibes,
} from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import ThemeProvider from "@/components/providers/ThemeProvider";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Grain from "@/components/ui/Grain";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-greatvibes",
});

const SITE = "https://rudresh98.github.io";

export const metadata = {
  metadataBase: new URL(SITE),
  title: "Rudresh Oza — GenAI & Full-Stack Engineer",
  description:
    "Rudresh Oza is a GenAI and full-stack engineer with 6 years of experience building LLM-powered products and web applications across the MERN and MEAN stacks.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    title: "Rudresh Oza — GenAI & Full-Stack Engineer",
    description:
      "6 years building LLM-powered products and full-stack web applications. RAG, agents, React, Node, and the details that make software feel considered.",
    images: [{ url: "/profile.jpeg", width: 1200, height: 630, alt: "Rudresh Oza" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rudresh Oza — GenAI & Full-Stack Engineer",
    description:
      "6 years building LLM-powered products and full-stack web applications.",
    images: ["/profile.jpeg"],
  },
  icons: { icon: "/profile-formal.jpg" },
};

export const viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f1" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0b0d" },
  ],
};

const GA_ID = "G-RJWNK3Z3SL";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${jakarta.variable} ${jetbrains.variable} ${greatVibes.variable}`}
    >
      <body className="font-sans antialiased">
        <ThemeProvider>
          <a
            href="#about"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
          >
            Skip to content
          </a>
          <Grain />
          <SmoothScroll />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--surface)",
                color: "var(--ink)",
                border: "1px solid var(--hairline)",
              },
            }}
          />
        </ThemeProvider>

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
