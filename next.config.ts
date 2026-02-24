import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
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
