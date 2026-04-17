/// <reference types="vite/client" />

declare const __BASE_PATH__: string;
declare const __IS_PREVIEW__: boolean;
declare const __READDY_PROJECT_ID__: string;
declare const __READDY_VERSION_ID__: string;
declare const __READDY_AI_DOMAIN__: string;

// Injected at build time by vite.config.ts from version.json.
// `__APP_VERSION__` is the user-facing string (e.g. "1.0.0.42" or "1.2.0-rc.1").
// `__APP_VERSION_META__` carries commit hash + build timestamp + numeric parts.
declare const __APP_VERSION__: string;
declare const __APP_VERSION_META__: {
  version: string;
  commit: string;
  builtAt: string;
  major: number;
  minor: number;
  patch: number;
  build: number;
  preRelease: string | null;
};