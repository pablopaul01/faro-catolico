import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { ROUTES } from '@/lib/constants'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: usar getUser() en lugar de getSession() — más seguro en el servidor
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginRoute = pathname === ROUTES.ADMIN_LOGIN

  // Redirigir a login si intenta acceder al admin sin sesión
  if (isAdminRoute && !isLoginRoute && !user) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN_LOGIN, request.url))
  }

  // Redirigir al dashboard si ya está autenticado y visita el login
  if (isLoginRoute && user) {
    return NextResponse.redirect(new URL(ROUTES.ADMIN, request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
