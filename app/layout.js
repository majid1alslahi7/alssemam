import { ThemeProvider } from "../src/context/ThemeContext";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ChunkLoadRecovery from "@/components/ChunkLoadRecovery";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://alssemam.com"),
  title: "شركة السمام | Alssemam - تطوير مواقع وتطبيقات",
  description:
    "شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول، نقدم حلولاً تقنية مبتكرة",
  keywords:
    "شركة السمام, alssemam, تطوير مواقع, تطبيقات موبايل, تصميم مواقع, شركة تقنية, حلول سحابية",
  authors: [{ name: "شركة السمام" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon0.svg", type: "image/svg+xml" },
      { url: "/icon1.webp", type: "image/webp", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-touch-icon.webp", sizes: "180x180", type: "image/webp" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "شركة السمام | Alssemam - تطوير مواقع وتطبيقات",
    description: "شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول",
    url: "https://alssemam.com",
    siteName: "شركة السمام",
    locale: "ar_AR",
    type: "website",
    images: [
      {
        url: "/web-app-manifest-512x512.webp",
        width: 512,
        height: 512,
        alt: "شعار شركة السمام",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "شركة السمام | Alssemam",
    description: "شركة رائدة في تطوير مواقع الويب وتطبيقات المحمول",
    images: ["/web-app-manifest-512x512.webp"],
  },
  alternates: {
    canonical: "https://alssemam.com",
    languages: {
      ar: "https://alssemam.com",
    },
  },
  category: "technology",
  appleWebApp: {
    capable: true,
    title: "شركة السمام",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#1F4E79",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#1F4E79",
  colorScheme: "light dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth">
      <body className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white antialiased font-cairo">
        <ThemeProvider>
          <ChunkLoadRecovery />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
