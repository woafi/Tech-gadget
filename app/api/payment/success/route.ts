import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { completePaidOrder, getClientBaseUrl } from "../_lib/payment";

async function getPaymentParams(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    let transactionId = params.get("tran_id");
    let orderId = params.get("order_id");

    if ((!transactionId || !orderId) && request.method === "POST") {
        const formData = await request.formData();
        transactionId = transactionId ?? formData.get("tran_id")?.toString() ?? null;
        orderId = orderId ?? formData.get("order_id")?.toString() ?? null;
    }

    return { transactionId, orderId };
}

async function handleSuccessRoute(request: NextRequest) {
    const { transactionId, orderId } = await getPaymentParams(request);
    const redirectUrl = new URL("/paymentSuccess", getClientBaseUrl());

    if (transactionId) {
        redirectUrl.searchParams.set("tran_id", transactionId);
    }

    if (orderId) {
        redirectUrl.searchParams.set("order_id", orderId);
    }

    if (!transactionId || !orderId) {
        return NextResponse.redirect(redirectUrl, 303);
    }

    try {
        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
        });

        if (!order || order.transactionId !== transactionId) {
            return NextResponse.redirect(redirectUrl, 303);
        }

        if (order.status !== "completed" || order.paymentStatus !== "paid") {
            await completePaidOrder(order);
        }
    } catch (error) {
        console.error("Error handling payment success route:", error);
    }

    return NextResponse.redirect(redirectUrl, 303);
}

export async function POST(request: NextRequest) {
    return handleSuccessRoute(request);
}

export async function GET(request: NextRequest) {
    return handleSuccessRoute(request);
}
