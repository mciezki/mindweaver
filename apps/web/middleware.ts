import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import {
  ACTIVE_ACCOUNT_PATH,
  DASHBOARD_PATH,
  FORGOT_PASSWORD_PATH,
  LOGIN_PATH,
  PUBLIC_DASHBOARD_PATH,
  RESET_PASSWORD_PATH,
  SIGN_UP_PATH,
} from './utils/paths';

const publicRoutes = [
  PUBLIC_DASHBOARD_PATH,
  LOGIN_PATH,
  SIGN_UP_PATH,
  FORGOT_PASSWORD_PATH,
  ACTIVE_ACCOUNT_PATH,
  RESET_PASSWORD_PATH,
];

const privateRoutes = [DASHBOARD_PATH, '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      (route === PUBLIC_DASHBOARD_PATH && pathname === PUBLIC_DASHBOARD_PATH),
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (accessToken) {
    if (
      pathname === LOGIN_PATH ||
      pathname === SIGN_UP_PATH ||
      pathname === PUBLIC_DASHBOARD_PATH
    ) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken) {
    if (isPrivateRoute) {
      const loginUrl = new URL(LOGIN_PATH, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|manifest).*)',
  ],
};
