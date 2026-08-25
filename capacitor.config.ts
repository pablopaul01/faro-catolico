import type { CapacitorConfig } from '@capacitor/cli'

const PRODUCTION_URL = 'https://farocatolico.site'
const DEV_URL = process.env.CAPACITOR_DEV_URL

const config: CapacitorConfig = {
  appId: 'site.farocatolico.app',
  appName: 'Faro Católico',
  webDir: 'capacitor-shell',
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
}

export default config
