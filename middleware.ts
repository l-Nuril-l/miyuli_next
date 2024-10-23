import { jwtDecode } from "jwt-decode";
import { NextRequest, NextResponse } from 'next/server';

interface DecodedToken {
    roles: string[];
    access_token: string;
    id: string;
}

const authorizedRoutes = [
    { route: "/admin", dynamic: true },
    { route: "/settings", exact: true },
    { route: "/feed", exact: true },
    { route: "/im", exact: true },
    { route: "/gim/", dynamic: true },
    { route: "/friends", exact: true },
    { route: "/communities", exact: true },
    { route: "/community/", dynamic: true, rules: [/^\/test\/\d+\/edit$/] },
    { route: "/albums/", dynamic: true },
    { route: "/album/", dynamic: true },
    { route: "/audios/", dynamic: true },
    { route: "/files", exact: true },
    { route: "/video/", dynamic: true, redirect: '/' },
];
//TODO: LOGIN REGISTER TO PROFILE

const unauthorizedRoutes = [
    { route: "/login", exact: true, redirect: '/' },
    { route: "/register", exact: true, redirect: '/' },
    { route: "/audio", exact: true, redirect: '/audios' },
];

export function middleware(req: NextRequest) {
    const cookieAuth = req.cookies.get('auth')?.value;
    const isAuth = cookieAuth !== undefined;
    const auth = cookieAuth ? JSON.parse(cookieAuth) : undefined;
    const { pathname } = req.nextUrl;
    const url = req.nextUrl.clone()
    url.pathname = '/'

    if (!isAuth) {
        for (const item of authorizedRoutes) {
            if (!(item.exact ? pathname === item.route : pathname.startsWith(item.route))) continue;
            if (!item.rules) return NextResponse.redirect(url);
            item.rules.map((rule) => {
                if (new RegExp(rule).test(pathname))
                    return NextResponse.redirect(url);
            })
        }
    }

    if (isAuth) {
        for (const item of unauthorizedRoutes) {
            if (item.exact ? pathname === item.route : pathname.startsWith(item.route)) {
                if (item.redirect) url.pathname = item.redirect;
                return NextResponse.redirect(url);
            }
        }
    }

    if (pathname.startsWith('/admin')) {
        const decodedToken = auth ? jwtDecode<DecodedToken>(auth.access_token) : undefined;
        const raw_roles = jwtDecode(auth.access_token)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        const roles = Array.isArray(raw_roles) ? raw_roles : (raw_roles ? [raw_roles] : [])

        if (!isAuth || !roles.includes('Admin')) return NextResponse.redirect(url);
    }

    return NextResponse.next();
}