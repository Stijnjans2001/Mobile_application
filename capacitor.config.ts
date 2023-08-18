import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'be.stino_pops.Stijn_Janssens',
  appName: 'Stino pops',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    FirebaseAuthentication: {
      skipNativeAuth: false,
      providers: ['google.com']
    },
  },
};

export default config;
