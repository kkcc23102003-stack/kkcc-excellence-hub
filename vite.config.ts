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
    server: {
      host: "0.0.0.0",
      allowedHosts: true,
    },
  };
});
