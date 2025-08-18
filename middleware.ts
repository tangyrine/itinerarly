import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true';

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/start/:path*'],
};
