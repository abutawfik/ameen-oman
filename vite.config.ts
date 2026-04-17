import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import AutoImport from "unplugin-auto-import/vite";
// import { readdyJsxRuntimeProxyPlugin } from "./vite.jsx-runtime-proxy";

const base = process.env.BASE_PATH || "/";
const isPreview = process.env.IS_PREVIEW ? true : false;
//const proxyPlugins = isPreview ? [readdyJsxRuntimeProxyPlugin()] : [];

// ── Version — single source of truth at version.json ────────────────────────
// Per SemVer MAJOR.MINOR.PATCH.BUILD + optional pre-release.
// Injected at build time so the UI reads from a compile-time constant rather
// than fetching a runtime file. CI bumps BUILD on every pipeline via
// `npm run version:build`.
const versionFile = JSON.parse(
  readFileSync(resolve(__dirname, "version.json"), "utf8"),
);
const versionString = (() => {
  const base = `${versionFile.major ?? 0}.${versionFile.minor ?? 0}.${versionFile.patch ?? 0}.${versionFile.build ?? 0}`;
  return versionFile.preRelease ? `${base}-${versionFile.preRelease}` : base;
})();
const commitHash = (() => {
  try {
    return execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString().trim();
  } catch {
    return "unknown";
  }
})();
const versionMeta = {
  version: versionString,
  commit: commitHash,
  builtAt: new Date().toISOString(),
  major: versionFile.major ?? 0,
  minor: versionFile.minor ?? 0,
  patch: versionFile.patch ?? 0,
  build: versionFile.build ?? 0,
  preRelease: versionFile.preRelease ?? null,
};

// https://vite.dev/config/
export default defineConfig({
  define: {
    __BASE_PATH__: JSON.stringify(base),
    __IS_PREVIEW__: JSON.stringify(isPreview),
    __READDY_PROJECT_ID__: JSON.stringify(process.env.PROJECT_ID || ""),
    __READDY_VERSION_ID__: JSON.stringify(process.env.VERSION_ID || ""),
    __READDY_AI_DOMAIN__: JSON.stringify(process.env.READDY_AI_DOMAIN || ""),
    __APP_VERSION__: JSON.stringify(versionString),
    __APP_VERSION_META__: JSON.stringify(versionMeta),
  },
  plugins: [
    // ...proxyPlugins,
    react(),
    AutoImport({
      imports: [
        {
          react: [
            ["default", "React"],
            "useState",
            "useEffect",
            "useContext",
            "useReducer",
            "useCallback",
            "useMemo",
            "useRef",
            "useImperativeHandle",
            "useLayoutEffect",
            "useDebugValue",
            "useDeferredValue",
            "useId",
            "useInsertionEffect",
            "useSyncExternalStore",
            "useTransition",
            "startTransition",
            "lazy",
            "memo",
            "forwardRef",
            "createContext",
            "createElement",
            "cloneElement",
            "isValidElement",
          ],
        },
        {
          "react-router-dom": [
            "useNavigate",
            "useLocation",
            "useParams",
            "useSearchParams",
            "Link",
            "NavLink",
            "Navigate",
            "Outlet",
          ],
        },
        // React i18n
        {
          "react-i18next": ["useTranslation", "Trans"],
        },
      ],
      dts: true,
    }),
  ],
  base,
  build: {
    sourcemap: true,
    outDir: 'out',
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
