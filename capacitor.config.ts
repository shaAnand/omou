import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.8e570d7e232f4fbaba704196463d29aa',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://8e570d7e-232f-4fba-ba70-4196463d29aa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ["camera", "photos"]
    }
  }
};

export default config;