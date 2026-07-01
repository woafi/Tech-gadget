import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function POST(request: NextRequest) {
    try {
        const orderId = request.nextUrl.searchParams.get("order_id");

        if (orderId) {
            // Update order status to failed
            await prisma.order.update({
                where: { id: Number(orderId) },
                data: {
                    status: "failed",
                    paymentStatus: "failed",
                },
            });
        }

        return NextResponse.json({
            success: false,
            message: "Payment failed",
        });
    } catch (error) {
        console.error("Error handling payment failure:", error);
        return NextResponse.json(
            { error: "An error occurred while processing payment failure" },
            { status: 500 },
        );
    }
}
