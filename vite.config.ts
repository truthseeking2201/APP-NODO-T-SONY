import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const env = loadEnv(mode, process.cwd(), "");
  const useMocks = (env.VITE_USE_MOCKS ?? "true") !== "false";

  return {
    server: {
      host: "::",
      port: 8080,
      headers: {
        // Prevent Clickjacking attacks
        "X-Frame-Options": "DENY",
        // Other security headers
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1; mode=block",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy":
          "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https:; media-src 'self' https://d2g8s4wkah5pic.cloudfront.net; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
        ...(isProduction && {
          "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
        }),
      },
    },
    plugins: [react(), svgr()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        ...(useMocks
          ? {
              "@mysten/dapp-kit": path.resolve(__dirname, "src/mocks/dapp-kit.tsx"),
              "@mysten/sui/client": path.resolve(__dirname, "src/mocks/sui-client.ts"),
              "@mysten/sui/transactions": path.resolve(__dirname, "src/mocks/transactions.ts"),
              "@mysten/sui/bcs": path.resolve(__dirname, "src/mocks/bcs.ts"),
              "@pythnetwork/pyth-sui-js": path.resolve(__dirname, "src/mocks/pyth-sui-js.ts"),
            }
          : {}),
      },
    },
  };
});
