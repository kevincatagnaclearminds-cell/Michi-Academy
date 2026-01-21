/// <reference types="vite/client" />

// Declaraciones para import.meta.glob
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  readonly glob: <T = unknown>(
    pattern: string,
    options?: { eager?: boolean; as?: string }
  ) => Record<string, T>;
}

