import { verifyAccessToken } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const authPaths = [
    "/login",
    "/signup",
    "/forgetpassword",
    "/resentpassword",
];

const protectedPaths = [
    "/profile",
    "/cart",
    "/order",
    "/checkout",
    "/wishlist",
];

function isPathMatch(pathname: string, paths: string[]) {
    return paths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
}

function redirectToLogin(request: NextRequest) {
    const loginUrl = new URL("/login", request.url);
    const redirectTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;

    loginUrl.searchParams.set("redirectTo", redirectTo);

    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("accessToken");

    return response;
}

// Middleware to enforce auth flow: redirect guests from protected pages and prevent logged-in users from accessing auth pages.
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/public") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const isAuthPath = isPathMatch(pathname, authPaths);
    const isProtectedPath = isPathMatch(pathname, protectedPaths);
    const token = request.cookies.get("accessToken")?.value;

    if (isAuthPath) {
        if (!token) return NextResponse.next();

        const payload = await verifyAccessToken(token);

        if (payload) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        const response = NextResponse.next();
        response.cookies.delete("accessToken");
        return response;
    }

    if (isProtectedPath) {
        if (!token) {
            if (pathname.startsWith("/api/")) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            return redirectToLogin(request);
        }

        const payload = await verifyAccessToken(token);

        if (payload) {
            return NextResponse.next();
        }

        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return redirectToLogin(request);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"],
};
