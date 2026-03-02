import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/constants'

export const metadata: Metadata = {
  title:       `Aviso legal — ${SITE_NAME}`,
  description: 'Información sobre el propósito de Faro Católico y el uso del contenido publicado en el sitio.',
}

export default function AvisoLegalPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-14 pb-24">
      <h1 className="font-display text-4xl text-light mb-2">Aviso legal</h1>
      <p className="text-light/40 text-sm mb-10">Última actualización: marzo 2026</p>

      <div className="space-y-10 text-light/70 text-sm leading-relaxed">

        <section>
          <h2 className="font-display text-xl text-light mb-3">Propósito del sitio</h2>
          <p>
            <strong className="text-light">{SITE_NAME}</strong> es un proyecto personal sin fines de lucro con el
            único objetivo de facilitar el acceso a contenido católico de calidad: videos, películas, libros y música
            seleccionados para el crecimiento espiritual de las familias.
          </p>
          <p className="mt-3">
            Este sitio funciona como un <em>directorio de recursos</em>. No aloja ni distribuye contenido
            propio: simplemente reúne y presenta enlaces e incrustaciones de material publicado públicamente
            en plataformas de terceros (YouTube, Spotify, Dailymotion, entre otras).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-light mb-3">Propiedad del contenido</h2>
          <p>
            Todo el contenido multimedia mostrado en este sitio —videos, audios, imágenes de portada y demás
            material— pertenece exclusivamente a sus respectivos autores, creadores o titulares de derechos.
            {SITE_NAME} no reclama propiedad alguna sobre dichos materiales.
          </p>
          <p className="mt-3">
            Los videos y audios se reproducen mediante <strong className="text-light">incrustaciones oficiales</strong>{' '}
            (embeds) proporcionadas por las propias plataformas (YouTube, Spotify, Dailymotion, etc.), respetando
            sus condiciones de uso. Los enlaces externos dirigen al sitio original donde el contenido fue publicado.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-light mb-3">Uso justo y fines educativos</h2>
          <p>
            El material aquí compartido se difunde con fines exclusivamente educativos, espirituales y
            sin ánimo de lucro, en el espíritu del uso justo (<em>fair use</em>). Si sos titular de algún
            contenido y considerás que su inclusión vulnera tus derechos, podés contactarnos a través de
            la sección de <strong className="text-light">Contacto</strong> para que lo revisemos y,
            de ser necesario, lo retiremos a la brevedad.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-light mb-3">Contenido sugerido por la comunidad</h2>
          <p>
            Parte del contenido publicado en este sitio proviene de sugerencias enviadas por los propios
            visitantes. El equipo de administración revisa cada propuesta antes de publicarla, con el
            criterio de que sea material apropiado, de calidad y alineado con los valores católicos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-light mb-3">Valoraciones y reseñas</h2>
          <p>
            Las valoraciones de estrellas reflejan únicamente la opinión de los visitantes del sitio.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl text-light mb-3">Contacto</h2>
          <p>
            Para consultas, reportes de contenido o cualquier otra comunicación, podés escribirnos a través
            de la página de <a href="/sugerencias" className="text-accent hover:text-accent/80 transition-colors">Contacto</a>.
          </p>
        </section>

      </div>
    </main>
  )
}
