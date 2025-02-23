import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/auth/callback'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth');
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');

  // Handle unauthenticated users
  if (!session) {
    // Allow access to public routes
    if (isPublicRoute || isAuthRoute) {
      return res;
    }
    // Redirect to login for protected routes
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('returnUrl', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Handle authenticated users
  if (session) {
    // Redirect away from auth pages if already logged in
    if (isPublicRoute || isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/auth/:path*',
    '/api/protected/:path*'
  ],
}; 