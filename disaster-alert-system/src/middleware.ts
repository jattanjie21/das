import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // If user is not signed in and the current path is not / or /auth,
  // redirect the user to /
  if (!session && !req.nextUrl.pathname.startsWith('/auth') && req.nextUrl.pathname !== '/') {
    const redirectUrl = new URL('/', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is signed in and the current path is / or /auth,
  // redirect the user to /dashboard
  if (session && (req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/auth'))) {
    const redirectUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
}; 