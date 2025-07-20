import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = [
    '/',
    '/login',
    '/sign-up',
    '/forgot-password',
    '/active-account',
    '/reset-password',
];

const privateRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
];

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;

    const isPublicRoute = publicRoutes.some(route => new RegExp(`^${route}$`).test(request.nextUrl.pathname));
    const isPrivateRoute = privateRoutes.some(route => new RegExp(`^${route}$`).test(request.nextUrl.pathname));

    if (accessToken) {
        if (isPublicRoute && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/sign-up' || request.nextUrl.pathname === '/')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    if (!accessToken) {

        if (isPrivateRoute) {

            const loginUrl = new URL('/login', request.url);
            loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|manifest).*)'],
};