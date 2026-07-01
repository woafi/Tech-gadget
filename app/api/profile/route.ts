import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    console.log(profile)

    if (!profile) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: profile });
}

export async function PUT(request: NextRequest) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword } = body;

    const updateData: { name?: string; email?: string; password?: string } = {};

    // Update name
    if (name !== undefined) {
        if (typeof name !== "string" || name.trim().length < 2) {
            return NextResponse.json(
                { error: "Name must be at least 2 characters" },
                { status: 400 },
            );
        }
        updateData.name = name.trim();
    }

    // Update email
    if (email !== undefined) {
        if (typeof email !== "string" || !email.includes("@")) {
            return NextResponse.json(
                { error: "Please provide a valid email address" },
                { status: 400 },
            );
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Check if email is already taken by another user
        const existingUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        if (existingUser && existingUser.id !== currentUser.id) {
            return NextResponse.json(
                { error: "This email is already registered" },
                { status: 409 },
            );
        }

        updateData.email = normalizedEmail;
    }

    // Change password
    if (currentPassword !== undefined || newPassword !== undefined) {
        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: "Both current password and new password are required" },
                { status: 400 },
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: "New password must be at least 6 characters" },
                { status: 400 },
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: currentUser.id },
            select: { password: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isValid = await verifyPassword(currentPassword, user.password);
        if (!isValid) {
            return NextResponse.json(
                { error: "Current password is incorrect" },
                { status: 400 },
            );
        }

        updateData.password = await hashPassword(newPassword);
    }

    // If nothing to update
    if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
            { error: "No fields to update" },
            { status: 400 },
        );
    }

    const updatedUser = await prisma.user.update({
        where: { id: currentUser.id },
        data: updateData,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
        },
    });

    return NextResponse.json({ user: updatedUser });
}
