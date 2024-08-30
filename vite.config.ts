import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite as tsrv } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/chain-reaction/",
  plugins: [tsrv(), react()],
});
