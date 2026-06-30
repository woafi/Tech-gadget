import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import {
    exchangeCodeForGoogleProfile,
    GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/google-oauth";
import { generateAccessToken, hashPassword } from "@/lib/auth";
import prisma from "@/utils/prisma";

function redirectWithError(request: NextRequest, error: string) {
    const referer = request.headers.get("referer") ?? "";
    const fallbackPath = referer.includes("/signup") ? "/signup" : "/login";
    return NextResponse.redirect(new URL(`${fallbackPath}?error=${error}`, request.url));
}

function clearOAuthStateCookie(response: NextResponse) {
    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

async function findOrCreateGoogleUser(email: string, name: string) {
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return existingUser;
    }

    const randomPassword = crypto.randomBytes(32).toString("hex");

    return prisma.user.create({
        data: {
            email,
            name: name.trim() || email.split("@")[0],
            password: await hashPassword(randomPassword),
        },
    });
}

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const error = searchParams.get("error");
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = request.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;

    if (error) {
        const response = redirectWithError(request, "oauth_denied");
        clearOAuthStateCookie(response);
        return response;
    }

    if (!code || !state || !storedState || state !== storedState) {
        const response = redirectWithError(request, "oauth_state_mismatch");
        clearOAuthStateCookie(response);
        return response;
    }

    try {
        const profile = await exchangeCodeForGoogleProfile(code);
        const user = await findOrCreateGoogleUser(profile.email, profile.name);
        const accessToken = await generateAccessToken(user);

        const response = NextResponse.redirect(new URL("/", request.url));

        response.cookies.set("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
        });

        clearOAuthStateCookie(response);

        return response;
    } catch (callbackError) {
        console.error("Google OAuth callback error:", callbackError);

        const response = redirectWithError(request, "oauth_failed");
        clearOAuthStateCookie(response);
        return response;
    }
}
