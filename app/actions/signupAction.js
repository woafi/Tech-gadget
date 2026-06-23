"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { generateAccessToken, hashPassword, setAuthCookies } from "@/lib/auth";
import prisma from "@/lib/prisma";

const signupSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(80, "Name is too long"),
        email: z
            .string()
            .trim()
            .toLowerCase()
            .email("Enter a valid email address"),
        password: z
            .string()
            .min(1, "Password is required")
            .min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export async function signupAction(prevState, formData) {
    const raw = Object.fromEntries(formData);
    const result = signupSchema.safeParse(raw);

    const values = {
        name: typeof raw.name === "string" ? raw.name : "",
        email: typeof raw.email === "string" ? raw.email : "",
        password: "",
        confirmPassword: "",
    };

    if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;

        return {
            message: "Please fill the highlighted fields.",
            fieldErrors: {
                name: fieldErrors.name?.[0] || "",
                email: fieldErrors.email?.[0] || "",
                password: fieldErrors.password?.[0] || "",
                confirmPassword: fieldErrors.confirmPassword?.[0] || "",
            },
            values,
        };
    }

    const { name, email, password } = result.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return {
                message: "An account already exists with this email.",
                fieldErrors: {
                    name: "",
                    email: "Email is already registered",
                    password: "",
                    confirmPassword: "",
                },
                values,
            };
        }

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const accessToken = await generateAccessToken(user);
        await setAuthCookies(accessToken);
    } catch (error) {
        console.error(error);

        return {
            message: "Server error. Please try again.",
            fieldErrors: {
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            },
            values,
        };
    }

    redirect("/");
}
