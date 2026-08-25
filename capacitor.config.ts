import type { CapacitorConfig } from '@capacitor/cli'

const PRODUCTION_URL = 'https://farocatolico.site'
const DEV_URL = process.env.CAPACITOR_DEV_URL

const config: CapacitorConfig = {
  appId: 'site.farocatolico.app',
  appName: 'Faro Católico',
  webDir: 'capacitor-shell',
  backgroundColor: '#0D1B2A',
  android: {
    appendUserAgent: ' FaroCatolicoApp/1.2.0',
  },
  server: {
    url: DEV_URL ?? PRODUCTION_URL,
    cleartext: false,
    androidScheme: 'https',
    allowNavigation: [
      'farocatolico.site',
      '*.farocatolico.site',
      'www.youtube-nocookie.com',
      'player.vimeo.com',
      'www.dailymotion.com',
      'ok.ru',
    ],
  },
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'DARK',
      hidden: false,
    },
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: '#111D2A',
      splashFullScreen: true,
      splashImmersive: true,
      showSpinner: true,
      spinnerColor: '#D4AF37',
      spinnerStyle: 'SMALL',
    },
  },
}

export default config
