import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.brickbrain.app',
  appName: 'BrickBrain AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
