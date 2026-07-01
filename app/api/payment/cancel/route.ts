import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getClientBaseUrl } from "../_lib/payment";

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

async function handleCancelRoute(request: NextRequest) {
    try {
        const { transactionId, orderId } = await getPaymentParams(request);
        void transactionId;

        if (orderId) {
            // Update order status to failed/cancelled
            await prisma.order.update({
                where: { id: Number(orderId) },
                data: {
                    status: "failed",
                    paymentStatus: "cancelled",
                },
            });
        }

        return NextResponse.redirect(new URL("/paymentFaild", getClientBaseUrl()), 303);
    } catch (error) {
        console.error("Error handling payment cancel route:", error);
        // Still redirect even if update fails
        return NextResponse.redirect(new URL("/paymentFaild", getClientBaseUrl()), 303);
    }
}

export async function GET(request: NextRequest) {
    return handleCancelRoute(request);
}

export async function POST(request: NextRequest) {
    return handleCancelRoute(request);
}
