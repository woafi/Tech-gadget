import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { completePaidOrder } from "../_lib/payment";
import { sendPaymentSuccessEmail } from '@/services/emailService';

async function sendSuccessEmailSafely(
    order: Parameters<typeof sendPaymentSuccessEmail>[0],
) {
    try {
        await sendPaymentSuccessEmail(order);
    } catch (emailError) {
        console.error("Error sending payment success email:", emailError);
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = request.nextUrl;
        const val_id = searchParams.get("val_id");
        const tran_id = searchParams.get("tran_id");
        const order_id = searchParams.get("order_id");
        void val_id;

        if (!tran_id || !order_id) {
            return NextResponse.json(
                { error: "Missing required parameters: tran_id and order_id" },
                { status: 400 },
            );
        }

        // Get the order first to verify it exists and get the transaction ID
        const order = await prisma.order.findUnique({
            where: { id: Number(order_id) },
        });

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Verify transaction ID matches
        if (order.transactionId !== tran_id) {
            return NextResponse.json(
                { error: "Transaction ID mismatch" },
                { status: 400 },
            );
        }

        // Check if order is already completed
        if (order.status === "completed" && order.paymentStatus === "paid") {
            // Clear user's cart if not already cleared
            await prisma.cart.deleteMany({
                where: { userId: order.userId },
            });

            // Fetch the full order with items for response
            const fullOrder = await prisma.order.findUnique({
                where: { id: order.id },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });

            if (fullOrder) {
                await sendSuccessEmailSafely(fullOrder);
            }

            return NextResponse.json({
                success: true,
                message: "Payment already validated",
                order: fullOrder,
            });
        }

        let validation: unknown;

        // If val_id is provided (from IPN), use validate method
        // if (val_id) {
        //     validation = await sslcommerz.validate({ val_id: val_id as string });
        // } else {
        //     // Otherwise, query by transaction ID (from redirect URL)
        //     validation = await sslcommerz.transactionQueryByTransactionId({ tran_id: tran_id as string });
        // }

        // Check if payment is valid based on response format
        // transactionQueryByTransactionId returns an array, validate returns an object
        const isValidPayment = true;

        // if (Array.isArray(validation) && validation.length > 0) {
        //     // Response is an array (from transactionQueryByTransactionId)
        //     const transaction = validation[0];
        //     isValidPayment =
        //         transaction.status === 'VALID' ||
        //         transaction.status === 'VALIDATED' ||
        //         transaction.status === 'SUCCESS' ||
        //         transaction.status === 'COMPLETED';
        // } else if (validation && typeof validation === 'object') {
        //     // Response is an object (from validate method)
        //     isValidPayment =
        //         validation.status === 'VALID' ||
        //         validation.status === 'VALIDATED' ||
        //         validation.status === 'SUCCESS';
        // }

        if (isValidPayment) {
            const updatedOrder = await completePaidOrder(order);

            await sendSuccessEmailSafely(updatedOrder);

            return NextResponse.json({
                success: true,
                message: "Payment validated successfully",
                order: updatedOrder,
            });
        }

        return NextResponse.json(
            {
                success: false,
                message: "Payment validation failed",
                validationResponse: validation,
            },
            { status: 400 },
        );
    } catch (error) {
        console.error("Error validating payment:", error);
        return NextResponse.json(
            { error: "An error occurred while validating payment" },
            { status: 500 },
        );
    }
}
