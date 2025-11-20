import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generateJsonSchemas } from "./scripts/generateJsonSchemas";

const host = process.env.TAURI_DEV_HOST;

function vitePluginZod() {
  return {
    name: "vite-plugin-zod",

    buildStart() {
      console.log("build started");

      generateJsonSchemas();
    },
    watchChange(id) {
      if (id.includes("bridge-type-schemas")) {
        console.log(`Detected change in ${id}, regenerating JSON schemas...`);
        generateJsonSchemas();
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), vitePluginZod()],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    //
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        // 3. tell Vite to ignore watching `src-tauri`
        ignored: ["**/src-tauri/**"],
      },
    },
  };
});
