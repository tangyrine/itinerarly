import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log("🛡️ Middleware called for:", request.nextUrl.pathname); // Debug log
  
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';
  const url = request.nextUrl.clone();
  
  console.log("🔐 isLoggedIn cookie:", isLoggedIn); // Debug log
  
  // Allow OAuth callback URLs and auth parameters to pass through
  if (url.pathname.includes('/oauth2/') || 
      url.pathname.includes('/login/oauth2/') ||
      url.searchParams.has('code') || 
      url.searchParams.has('token') ||
      url.searchParams.has('auth') ||
      url.searchParams.has('state')) {
    console.log("✅ OAuth callback detected, allowing through"); // Debug log
    return NextResponse.next();
  }
  
  // Allow signin page itself
  if (url.pathname === '/signin') {
    console.log("✅ Signin page, allowing through"); // Debug log
    return NextResponse.next();
  }

  const referer = request.headers.get('referer') || '';
  const hasOAuthReferer = isValidOAuthReferer(referer);
  
  if (hasOAuthReferer) {
    console.log("✅ Valid OAuth referer, allowing through"); // Debug log
    return NextResponse.next();
  }
  
  // TEMPORARILY DISABLED TO DEBUG INFINITE LOOP
  // if (!isLoggedIn) {
  //   console.log("❌ Not logged in, redirecting to signin"); // Debug log
  //   return NextResponse.redirect(new URL('/signin', request.url));
  // }
  
  console.log("✅ Allowing request through"); // Debug log
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
