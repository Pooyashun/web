/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Full URL of the server-side lead endpoint. Empty/undefined => preview mode. */
  readonly VITE_LEAD_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
