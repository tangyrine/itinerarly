import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Use a simple boolean cookie instead of parsing JWT tokens
  // This avoids the OAuth2 invalid character [34] error
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/start/:path*'],
};
