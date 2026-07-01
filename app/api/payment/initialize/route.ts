import { NextRequest, NextResponse } from "next/server";
import { checkoutSchema } from "@/utils/vaildationCheckoutSchema";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/utils/prisma";
import {
    buildSslCommerzData,
    getPaymentTotal,
    initPayment,
} from "../_lib/payment";

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const parsed = checkoutSchema.safeParse(await request.json());

        if (!parsed.success) {
            return NextResponse.json(
                {
                    error: "Invalid checkout data",
                    issues: parsed.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const { fullName, email, address, city, zipCode, phone } = parsed.data;
        const userId = user.id;

        // Validate required fields
        if (!fullName || !email || !address || !city || !zipCode || !phone) {
            return NextResponse.json(
                { error: "All shipping information fields are required" },
                { status: 400 },
            );
        }

        // Get cart items
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                product: true,
            },
        });

        if (cartItems.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Calculate total
        const total = getPaymentTotal(cartItems);

        // Check if a pending order already exists for this user
        let order = await prisma.order.findFirst({
            where: {
                userId,
                status: "pending",
                paymentStatus: "pending",
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (order) {
            // Update existing order with new cart items and shipping information
            // First, delete existing order items
            await prisma.orderItem.deleteMany({
                where: { orderId: order.id },
            });

            // Update order with new data
            order = await prisma.order.update({
                where: { id: order.id },
                data: {
                    total,
                    fullName,
                    email,
                    address,
                    city,
                    zipCode,
                    phone,
                    paymentMethod: "sslcommerz",
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        } else {
            // Create new order with pending status
            order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    status: "pending",
                    paymentStatus: "pending",
                    fullName,
                    email,
                    address,
                    city,
                    zipCode,
                    phone,
                    paymentMethod: "sslcommerz",
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }

        // Prepare SSLCommerz payment data
        const transactionId = `TXN_${order.id}_${Date.now()}`;
        const data = buildSslCommerzData(order, transactionId);

        // Initialize payment with SSLCommerz (custom init: url-encoded + format=json)
        const apiResponse = await initPayment(data);

        // Update order with transaction ID
        await prisma.order.update({
            where: { id: order.id },
            data: { transactionId },
        });

        // Return the payment gateway URL
        return NextResponse.json({
            success: true,
            gatewayUrl: apiResponse.GatewayPageURL,
            orderId: order.id,
            transactionId,
        });
    } catch (error) {
        console.error("Error initializing payment:", error);
        return NextResponse.json(
            { error: "An error occurred while initializing payment" },
            { status: 500 },
        );
    }
}
