import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

process.env.VITE_APP_VERSION = Date.now().toString(36).toUpperCase();

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: false,
      },
      includeAssets: ["icons/icon-192.png", "icons/icon-512.png"],
      manifest: {
        name: "SINDSPAG - Sistema de Gestão",
        short_name: "SINDSPAG",
        description: "Sistema de Gestão de Associados do SINDSPAG",
        theme_color: "#111520",
        background_color: "#111520",
        display: "standalone",
        display_override: ["standalone", "fullscreen"],
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "pt-BR",
        categories: ["productivity", "utilities"],
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
          { name: "SINDSPAG Dashboard", short_name: "Dashboard", description: "Ver dashboard principal", url: "/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
          { name: "Cadastrar Associado", short_name: "Cadastrar", description: "Cadastrar novo associado", url: "/cadastro", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist: [/^\/~oauth/],
        maximumFileSizeToCacheInBytes: 5000000,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "google-fonts-cache", expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: "CacheFirst",
            options: { cacheName: "supabase-storage", expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 7 } },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
