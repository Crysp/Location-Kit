/// <reference types="vite/client" />

declare global {
  interface Window {
    locationKitConfig: {
      isDarkTheme: boolean;
      shape: string;
    };
    setShape: (shape: string) => void;
  }
}

export {};
