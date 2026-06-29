import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, type UserPayload } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;

    if (!accessToken) {
        return NextResponse.json({ user: null });
    }

    const payload = await verifyAccessToken(accessToken);

    if (!payload) {
        return NextResponse.json({ user: null });
    }

    const user: UserPayload = {
        id: payload.id as number,
        userid: payload.userid as number,
        username: payload.username as string,
        email: payload.email as string,
    };

    if (payload.role) {
        user.role = payload.role as string;
    }

    if (payload.phoneNumber) {
        user.phoneNumber = payload.phoneNumber as string;
    }

    return NextResponse.json({ user });
}
