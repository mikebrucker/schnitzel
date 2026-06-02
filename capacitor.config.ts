import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.mikebrucker.schnitzel",
  appName: "Schnitzel",
  webDir: "dist",
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  server: {
    androidScheme: "https",
  },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
      backgroundColor: "#065f46",
    },
    SplashScreen: {
      launchShowDuration: 2000,
      autoHide: true,
      backgroundColor: "#065f46",
      showSpinner: false,
    },
  },
};

export default config;
