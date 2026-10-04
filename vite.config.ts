import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const publicSupabaseUrl =
    env["VITE_SUPABASE_URL"] || env["NEXT_PUBLIC_SUPABASE_URL"] || env["SUPABASE_URL"] || "";
  const publicSupabasePublishableKey =
    env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    env["NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"] ||
    env["SUPABASE_PUBLISHABLE_KEY"] ||
    env["VITE_SUPABASE_ANON_KEY"] ||
    env["NEXT_PUBLIC_SUPABASE_ANON_KEY"] ||
    env["SUPABASE_ANON_KEY"] ||
    "";
  const publicSupabaseProjectId =
    env["VITE_SUPABASE_PROJECT_ID"] ||
    env["NEXT_PUBLIC_SUPABASE_PROJECT_ID"] ||
    env["SUPABASE_PROJECT_ID"] ||
    "";

  return {
    plugins: [
      tailwindcss(),
      tanstackStart({
        server: { entry: "server" },
      }),
      process.env["VERCEL"] ? nitro({ preset: "vercel" }) : null,
      react(),
    ],
    define: {
      __PUBLIC_SUPABASE_URL__: JSON.stringify(publicSupabaseUrl),
      __PUBLIC_SUPABASE_PUBLISHABLE_KEY__: JSON.stringify(publicSupabasePublishableKey),
      __PUBLIC_SUPABASE_PROJECT_ID__: JSON.stringify(publicSupabaseProjectId),
    },
    resolve: {
      tsconfigPaths: true,
    },
    build: {
      /**
       * Split the shared vendor code away from application code. A student who
       * already opened the app keeps React, the router, the query client and the
       * Supabase client in the browser cache, so a content update only downloads
       * the small application chunk instead of the whole ~480 kB bundle.
       */
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              { name: "vendor-react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
              { name: "vendor-router", test: /node_modules[\\/]@tanstack[\\/]router/ },
              { name: "vendor-query", test: /node_modules[\\/]@tanstack[\\/]react-query/ },
              { name: "vendor-supabase", test: /node_modules[\\/]@supabase[\\/]/ },
            ],
          },
        },
      },
    },
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
      ...(mode === "fixture"
        ? {
            proxy: {
              "/__fixture__/supabase": {
                target: "http://127.0.0.1:4601",
                changeOrigin: true,
                rewrite: (path: string) => path.replace("/__fixture__/supabase", ""),
              },
            },
          }
        : {}),
    },
  };
});
