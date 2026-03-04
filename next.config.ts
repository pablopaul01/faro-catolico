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
}

export default nextConfig
