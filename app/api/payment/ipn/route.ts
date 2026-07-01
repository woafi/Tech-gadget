import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { completePaidOrder } from "../_lib/payment";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const transactionId = formData.get("tran_id")?.toString();
        const orderId = formData.get("order_id")?.toString();
        const status = formData.get("status")?.toString();

        if (!transactionId || !orderId) {
            return NextResponse.json(
                { error: "Missing required parameters: tran_id and order_id" },
                { status: 400 },
            );
        }

        const order = await prisma.order.findUnique({
            where: { id: Number(orderId) },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (order.transactionId !== transactionId) {
            return NextResponse.json(
                { error: "Transaction ID mismatch" },
                { status: 400 },
            );
        }

        const isValidPayment =
            status === "VALID" ||
            status === "VALIDATED" ||
            status === "SUCCESS" ||
            status === "COMPLETED";

        if (isValidPayment) {
            const updatedOrder = await completePaidOrder(order);

            return NextResponse.json({
                success: true,
                message: "Payment IPN processed successfully",
                order: updatedOrder,
            });
        }

        await prisma.order.update({
            where: { id: order.id },
            data: {
                status: "failed",
                paymentStatus: status === "CANCELLED" ? "cancelled" : "failed",
            },
        });

        return NextResponse.json({
            success: false,
            message: "Payment IPN marked as failed",
        });
    } catch (error) {
        console.error("Error handling payment IPN:", error);
        return NextResponse.json(
            { error: "An error occurred while processing payment IPN" },
            { status: 500 },
        );
    }
}
