import crypto from "crypto";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export const GOOGLE_OAUTH_STATE_COOKIE = "google_oauth_state";

export interface GoogleUserProfile {
    id: string;
    email: string;
    name: string;
    picture?: string;
}

function getAppBaseUrl() {
    return (
        process.env.NEXT_PUBLIC_APP_URL ||
        process.env.APP_URL ||
        "http://localhost:3000"
    ).replace(/\/$/, "");
}

export function getGoogleOAuthConfig() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
        process.env.GOOGLE_REDIRECT_URI ||
        `${getAppBaseUrl()}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
        return null;
    }

    return { clientId, clientSecret, redirectUri };
}

export function createOAuthState() {
    return crypto.randomBytes(32).toString("hex");
}

export function buildGoogleAuthUrl(state: string) {
    const config = getGoogleOAuthConfig();

    if (!config) {
        throw new Error("Google OAuth is not configured");
    }

    const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export async function exchangeCodeForGoogleProfile(code: string) {
    const config = getGoogleOAuthConfig();

    if (!config) {
        throw new Error("Google OAuth is not configured");
    }

    const tokenResponse = await fetch(GOOGLE_TOKEN_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            code,
            client_id: config.clientId,
            client_secret: config.clientSecret,
            redirect_uri: config.redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!tokenResponse.ok) {
        throw new Error("Failed to exchange Google authorization code");
    }

    const tokenData = (await tokenResponse.json()) as { access_token?: string };

    if (!tokenData.access_token) {
        throw new Error("Google token response did not include an access token");
    }

    const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
        },
    });

    if (!profileResponse.ok) {
        throw new Error("Failed to fetch Google user profile");
    }

    const profile = (await profileResponse.json()) as GoogleUserProfile;

    if (!profile.email) {
        throw new Error("Google account did not provide an email address");
    }

    return profile;
}
