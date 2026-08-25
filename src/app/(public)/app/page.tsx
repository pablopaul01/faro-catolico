import type { Metadata } from 'next'
import { Download, MonitorSmartphone, Tv, ShieldCheck, RefreshCw } from 'lucide-react'
import { SITE_NAME, APP_DOWNLOAD } from '@/lib/constants'
import { WebOnly } from '@/components/layout/WebOnly'

export const metadata: Metadata = {
  title:       `Descargar app — ${SITE_NAME}`,
  description: 'Descargá la app oficial de Faro Católico para Android: teléfonos, tablets y TV Box. Gratis, sin publicidad.',
}

const INSTALL_STEPS = [
  {
    title: 'Descargá el APK',
    body:  'Tocá el botón de descarga. El archivo pesa menos de 4 MB.',
  },
  {
    title: 'Permití la instalación',
    body:  'Al abrir el archivo, Android te va a pedir autorización para instalar apps de "fuentes desconocidas". Aceptá solo para esta instalación: el APK se descarga directo de farocatolico.site, es nuestro servidor oficial.',
  },
  {
    title: 'Instalá y abrí',
    body:  'Aceptá "Instalar". La app aparece en tu menú como Faro Católico.',
  },
]

export default function AppDownloadPage() {
  return (
    <WebOnly>
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 pb-24">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl text-light mb-3">App de {SITE_NAME}</h1>
        <p className="text-light/60 max-w-xl mx-auto">
          Llevá el faro a tu televisor. La app oficial para Android, optimizada también para
          TV Box: navegá con el control remoto y mirá las películas cómodamente desde el sofá.
        </p>
      </div>

      <div className="bg-card gold-glow rounded-card p-8 text-center mb-12 animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Tv className="w-6 h-6 text-accent" aria-hidden />
          <MonitorSmartphone className="w-6 h-6 text-accent" aria-hidden />
        </div>
        <p className="font-display text-2xl text-light mb-1">Faro Católico para Android</p>
        <p className="text-light/40 text-sm mb-6">
          Versión {APP_DOWNLOAD.VERSION} · {APP_DOWNLOAD.SIZE_MB} · {APP_DOWNLOAD.MIN_ANDROID}
        </p>
        <a
          href={APP_DOWNLOAD.APK_PATH}
          download
          className="inline-flex items-center gap-2 bg-accent text-primary font-semibold px-8 py-4 rounded-card hover:bg-accent/90 transition-colors"
        >
          <Download className="w-5 h-5" aria-hidden />
          Descargar APK
        </a>
      </div>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-light mb-6">Cómo instalar</h2>
        <ol className="space-y-5">
          {INSTALL_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="shrink-0 w-8 h-8 rounded-full gold-border text-accent flex items-center justify-center font-display text-sm">
                {index + 1}
              </span>
              <div>
                <h3 className="text-light font-medium mb-1">{step.title}</h3>
                <p className="text-light/60 text-sm leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="font-display text-2xl text-light mb-6">Cómo instalar en TV Box con Downloader</h2>
        <p className="text-light/60 text-sm leading-relaxed mb-5">
          Si tu TV Box tiene la app <strong className="text-light">Downloader</strong> (la clásica de Fire TV
          y Android TV), podés instalar la app sin usar la computadora:
        </p>
        <ol className="space-y-3">
          {[
            'Abrí Downloader y permití el acceso a archivos si te lo pide',
            'En la barra de dirección escribí: farocatolico.site/apk',
            'Esperá la descarga (menos de 4 MB) y tocá "Instalar"',
          ].map((step, index) => (
            <li key={step} className="flex gap-4 items-start">
              <span className="shrink-0 w-8 h-8 rounded-full gold-border text-accent flex items-center justify-center font-display text-sm">
                {index + 1}
              </span>
              <p className="text-light/60 text-sm leading-relaxed pt-1.5">{step}</p>
            </li>
          ))}
        </ol>
        <p className="text-light/40 text-xs mt-5">
          Consejo: Downloader también soporta códigos cortos numéricos. Registrá el tuyo en
          aftvnews.com/link apuntando a farocatolico.site/apk y compartilo con tu comunidad.
        </p>
      </section>

      <section className="grid sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-card p-5">
          <Tv className="w-5 h-5 text-accent mb-3" aria-hidden />
          <h3 className="text-light text-sm font-medium mb-1">TV Box incluida</h3>
          <p className="text-light/50 text-xs leading-relaxed">
            Navegación con control remoto: el foco dorado te guía por toda la app.
          </p>
        </div>
        <div className="bg-card rounded-card p-5">
          <RefreshCw className="w-5 h-5 text-accent mb-3" aria-hidden />
          <h3 className="text-light text-sm font-medium mb-1">Siempre actualizada</h3>
          <p className="text-light/50 text-xs leading-relaxed">
            El contenido y las mejoras llegan solas: la app muestra el sitio en tiempo real.
          </p>
        </div>
        <div className="bg-card rounded-card p-5">
          <ShieldCheck className="w-5 h-5 text-accent mb-3" aria-hidden />
          <h3 className="text-light text-sm font-medium mb-1">Sin permisos raros</h3>
          <p className="text-light/50 text-xs leading-relaxed">
            Solo necesita internet. Sin publicidad, sin rastreo, sin cuentas.
          </p>
        </div>
      </section>
      </main>
    </WebOnly>
  )
}
