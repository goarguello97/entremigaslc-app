/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_STORE_NAME?: string;
  readonly VITE_SHEET_MENU_URL?: string;
  readonly VITE_SHEET_CONFIG_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
