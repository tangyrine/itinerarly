import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const url = request.nextUrl.clone();

  if (url.pathname.includes('/oauth2/') || 
      url.pathname.includes('/login/oauth2/') ||
      url.searchParams.has('code') || 
      url.searchParams.has('token') ||
      url.searchParams.has('auth') ||
      url.searchParams.has('state')) {
    return NextResponse.next();
  }
  
  if (url.pathname === '/signin') {
    return NextResponse.next();
  }

  const referer = request.headers.get('referer') || '';
  const hasOAuthReferer = referer.includes('github.com') ||
                         referer.includes('google.com') ||
                         referer.includes('accounts.google.com');
  
  if (hasOAuthReferer) {
    return NextResponse.next();
  }
  
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/start/:path*'],
};
