import { ThemeProvider } from "../src/context/ThemeContext";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import Script from "next/script";
import "./globals.css";

const chunkRecoveryScript = `
(() => {
  const recoveryKey = 'alssemam:chunk-recovery:v2';
  const recoveryParam = '__alssemam_chunk_recovered';
  const retryWindowMs = 60000;

  const toMessage = (value) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return [value.name, value.message, value.stack].filter(Boolean).join('\\n');
  };

  const isChunkFailure = (value) => (
    /ChunkLoadError|Loading chunk \\d+ failed|CSS_CHUNK_LOAD_FAILED|failed to fetch dynamically imported module|Importing a module script failed/i
      .test(toMessage(value))
  );

  const isNextStaticScript = (target) => (
    target instanceof HTMLScriptElement &&
    typeof target.src === 'string' &&
    target.src.includes('/_next/static/')
  );

  const storage = (() => {
    try {
      const testKey = recoveryKey + ':test';
      sessionStorage.setItem(testKey, '1');
      sessionStorage.removeItem(testKey);
      return sessionStorage;
    } catch {
      return null;
    }
  })();

  const recentlyRecovered = () => {
    const value = Number(storage?.getItem(recoveryKey) || 0);
    return value > 0 && Date.now() - value < retryWindowMs;
  };

  const markRecovered = () => {
    try {
      storage?.setItem(recoveryKey, String(Date.now()));
    } catch {}
  };

  const clearBrowserBuildState = async () => {
    if ('caches' in window) {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
    }

    if (navigator.serviceWorker?.getRegistrations) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((registration) => registration.unregister()));
    }
  };

  const reloadWithCacheBuster = () => {
    const url = new URL(window.location.href);
    url.searchParams.set(recoveryParam, Date.now().toString(36));
    window.location.replace(url.toString());
  };

  const recover = async () => {
    if (recentlyRecovered()) return;

    markRecovered();
    try {
      await clearBrowserBuildState();
    } catch {}

    reloadWithCacheBuster();
  };

  window.addEventListener('error', (event) => {
    if (isNextStaticScript(event.target) || isChunkFailure(event.error) || isChunkFailure(event.message)) {
      event.preventDefault?.();
      void recover();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkFailure(event.reason)) {
      event.preventDefault?.();
      void recover();
    }
  });

  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has(recoveryParam)) {
      url.searchParams.delete(recoveryParam);
      window.history.replaceState(null, document.title, url.pathname + url.search + url.hash);
    }
  } catch {}
})();
`;

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
        <Script
          id="alssemam-chunk-recovery"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: chunkRecoveryScript }}
        />
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PWAInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
