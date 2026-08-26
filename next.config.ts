import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['react-pdf', 'pdfjs-dist'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        // Permite cualquier host HTTPS — necesario para portadas de libros
        // que pueden provenir de cualquier dominio externo
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        // URL corta para apps tipo Downloader en TV Box
        source:      '/apk',
        destination: '/apps/faro-catolico-v1.7.4.apk',
        permanent:   false,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/apps/:file*.apk',
        headers: [
          { key: 'Content-Type',        value: 'application/vnd.android.package-archive' },
          { key: 'Content-Disposition', value: 'attachment; filename="faro-catolico-v1.7.4.apk"' },
        ],
      },
    ]
  },
}

export default nextConfig
