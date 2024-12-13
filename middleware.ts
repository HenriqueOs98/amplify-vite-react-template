import { NextRequest, NextResponse } from "next/server";
import { db } from "./src/db";

export async function middleware(request: NextRequest) {
    const isLoggedIn = await db.isAuthenticated(request.cookies as any);
    
    if (request.nextUrl.pathname.startsWith("/auth") && isLoggedIn) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!isLoggedIn && !request.nextUrl.pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

