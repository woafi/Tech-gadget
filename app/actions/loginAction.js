"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { generateAccessToken, setAuthCookies, verifyPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .min(1, "Email is required")
        .email("Enter a valid email address"),
    password: z
        .string()
        .min(1, "Password is required"),
});

export async function loginAction(prevState, formData) {
    const raw = Object.fromEntries(formData);
    const result = loginSchema.safeParse(raw);

    const values = {
        email: typeof raw.email === "string" ? raw.email : "",
        password: "",
    };

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        return {
            message: "Please fill the highlighted fields.",
            fieldErrors: {
                email: fieldErrors.email?.[0] || "",
                password: fieldErrors.password?.[0] || "",
            },
            values,
        };
    }

    const { email, password } = result.data;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Use a single generic message for both cases to avoid
        // revealing whether an email is registered.
        if (!user) {
            return {
                message: "Invalid email or password.",
                fieldErrors: { email: "", password: "" },
                values,
            };
        }

        const isValid = await verifyPassword(password, user.password);
        if (!isValid) {
            return {
                message: "Invalid email or password.",
                fieldErrors: { email: "", password: "" },
                values,
            };
        }

        const accessToken = await generateAccessToken(user);
        await setAuthCookies(accessToken);
    } catch (error) {
        console.error(error);

        return {
            message: "Server error. Please try again.",
            fieldErrors: { email: "", password: "" },
            values,
        };
    }

    redirect("/");
}
