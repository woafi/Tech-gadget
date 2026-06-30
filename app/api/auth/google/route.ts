import { NextRequest, NextResponse } from "next/server";
import {
    buildGoogleAuthUrl,
    createOAuthState,
    getGoogleOAuthConfig,
    GOOGLE_OAUTH_STATE_COOKIE,
} from "@/lib/google-oauth";

export async function GET(request: NextRequest) {
    const config = getGoogleOAuthConfig();

    if (!config) {
        return NextResponse.redirect(
            new URL("/login?error=oauth_not_configured", request.url),
        );
    }

    const state = createOAuthState();
    const authUrl = buildGoogleAuthUrl(state);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set(GOOGLE_OAUTH_STATE_COOKIE, state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
    });

    return response;
}
