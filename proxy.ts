import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

const authPayloadSchema = z
    .object({
        id: z.union([z.number(), z.string()]),
        userid: z.union([z.number(), z.string()]).optional(),
        username: z.string().optional(),
        email: z.string().email().optional(),
    })
    .passthrough();

const authPages = new Set(["/login", "/signup"]);
const protectedPrefixes = [
    "/account",
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
    "/wishlist",
];

async function readAuthPayload(request: NextRequest) {
    const token = request.cookies.get("accessToken")?.value;
    const secret = process.env.JWT_SECRET;

    if (!token || !secret) {
        return { payload: null, shouldClearCookie: Boolean(token) };
    }

    try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
        const parsedPayload = authPayloadSchema.safeParse(payload);

        return {
            payload: parsedPayload.success ? parsedPayload.data : null,
            shouldClearCookie: !parsedPayload.success,
        };
    } catch {
        return { payload: null, shouldClearCookie: true };
    }
}

function isProtectedPath(pathname: string) {
    return protectedPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    );
}

function deleteAuthCookie(response: NextResponse) {
    response.cookies.delete({
        name: "accessToken",
        path: "/",
    });
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const { payload, shouldClearCookie } = await readAuthPayload(request);
    const isAuthenticated = Boolean(payload);

    if (authPages.has(pathname) && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProtectedPath(pathname) && !isAuthenticated) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("from", pathname);

        const response = NextResponse.redirect(loginUrl);

        if (shouldClearCookie) {
            deleteAuthCookie(response);
        }

        return response;
    }

    const response = NextResponse.next();

    if (shouldClearCookie) {
        deleteAuthCookie(response);
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)"],
};
