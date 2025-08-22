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
  const hasOAuthReferer = isValidOAuthReferer(referer);
  
  if (hasOAuthReferer) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    const fromSignin = referer && referer.includes('/signin');
    if (fromSignin) {
      return NextResponse.next();
    }
  
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

function isValidOAuthReferer(refererUrl: string): boolean {
  if (!refererUrl) {
    return false;
  }
  
  try {
    const parsedUrl = new URL(refererUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    const allowedOAuthHosts = [
      'github.com',
      'google.com', 
      'accounts.google.com',
      'oauth.google.com',
    ];
    
    return allowedOAuthHosts.some(allowedHost => {
      if (hostname === allowedHost) {
        return true;
      }
      
      if (hostname.endsWith('.' + allowedHost)) {
        const subdomain = hostname.substring(0, hostname.length - allowedHost.length - 1);
        return subdomain.length > 0 && !subdomain.endsWith('.');
      }
      
      return false;
    });
  } catch (error) {
    console.warn('Invalid referer URL format:', refererUrl);
    return false;
  }
}

export const config = {
  matcher: ['/start/:path*'],
};
