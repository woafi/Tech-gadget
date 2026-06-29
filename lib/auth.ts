import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import type { User } from "@prisma/client";

const TOKEN_EXPIRY = "30d";
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30;

export interface UserPayload {
    id: number;
    userid: number;
    username: string;
    email: string;
    role?: string;
    phoneNumber?: string;
}

type AuthUser = Pick<User, "id" | "name" | "email"> &
    Partial<{
        role: string | null;
        phone: string | null;
    }>;

function getJwtSecret() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return new TextEncoder().encode(secret);
}

// Hash a password using bcrypt
export async function hashPassword(password: string) {
    return bcrypt.hash(password, 12);
}

// Verify a password against a hash
export async function verifyPassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
}

// Generate an access token
export async function generateAccessToken(user: AuthUser) {

    const userObject: JWTPayload = {
        id: user.id,
        userid: user.id,
        username: user.name,
        email: user.email,
    };

    if (user.role) {
        userObject.role = user.role;
    }

    if (user.phone) {
        userObject.phoneNumber = user.phone;
    }

    return new SignJWT(userObject)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(TOKEN_EXPIRY)
        .sign(getJwtSecret());
}


// Verify an access token
export async function verifyAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, getJwtSecret());
        return payload;
    } catch {
        return null;
    }
}


// Set auth cookies (HttpOnly, Secure, SameSite)
export async function setAuthCookies(accessToken: string) {
    const cookieStore = await cookies();

    const baseOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/",
    };

    cookieStore.set("accessToken", accessToken, {
        ...baseOptions,
        maxAge: TOKEN_MAX_AGE,
    });

}

// Clear auth cookies (logout)
export async function clearAuthCookies() {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
}

// Get current user from cookies
export async function getCurrentUser(): Promise<UserPayload | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    const payload = await verifyAccessToken(accessToken);
    return payload as UserPayload | null;
}


// Get auth tokens from cookies
export async function getAuthTokens() {
    const cookieStore = await cookies();
    return {
        accessToken: cookieStore.get("accessToken")?.value,
    };
}
