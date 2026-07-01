import type { Prisma } from "@prisma/client";
import prisma from "@/utils/prisma";

type CartItemWithProduct = Prisma.CartGetPayload<{
    include: { product: true };
}>;

type OrderWithItems = Prisma.OrderGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

export interface SslCommerzInitData {
    total_amount: string;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url: string;
    shipping_method: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_city: string;
    cus_state: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;
    num_of_item: number;
    ship_name: string;
    ship_add1: string;
    ship_city: string;
    ship_postcode: string;
    ship_country: string;
}

interface SslCommerzInitResponse {
    GatewayPageURL?: string;
    failedreason?: string;
    status?: string;
}

export function getPaymentBaseUrl() {
    return (
        process.env.BACKEND_API_URL ??
        process.env.NEXT_PUBLIC_APP_URL ??
        process.env.CLIENT_URL ??
        "https://tech-gadget-live.vercel.app"
    ).replace(/\/$/, "");
}

export function getClientBaseUrl() {
    return (process.env.CLIENT_URL ?? getPaymentBaseUrl()).replace(/\/$/, "");
}

export function getPaymentTotal(cartItems: CartItemWithProduct[]) {
    const subtotal = cartItems.reduce((sum, item) => {
        return sum + item.product.price * item.quantity;
    }, 0);
    const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 9.99;
    const tax = subtotal * 0.08;

    return Number((subtotal + shipping + tax).toFixed(2));
}

export async function initPayment(data: SslCommerzInitData) {
    const storeId = process.env.SSL_STORE_ID;
    const storePassword = process.env.SSL_STORE_PASSWORD;

    if (!storeId || !storePassword) {
        throw new Error("SSLCommerz credentials are not configured");
    }

    const isLive = process.env.SSL_IS_LIVE === "true";
    const apiUrl = isLive
        ? "https://securepay.sslcommerz.com/gwprocess/v4/api.php"
        : "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            ...Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, String(value)]),
            ),
            store_id: storeId,
            store_passwd: storePassword,
            product_amount: data.total_amount,
            vat: "0",
            discount_amount: "0",
            convenience_fee: "0",
            format: "json",
        }),
    });

    const apiResponse = (await response.json()) as SslCommerzInitResponse;

    if (!response.ok || !apiResponse.GatewayPageURL) {
        throw new Error(
            apiResponse.failedreason ??
                apiResponse.status ??
                "SSLCommerz payment initialization failed",
        );
    }

    return apiResponse;
}

export async function completePaidOrder(order: { id: number; userId: number }) {
    // Update order status to completed
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: {
            status: "completed",
            paymentStatus: "paid",
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    // Clear user's cart
    await prisma.cart.deleteMany({
        where: { userId: updatedOrder.userId },
    });

    return updatedOrder;
}

export function buildSslCommerzData(
    order: OrderWithItems,
    transactionId: string,
): SslCommerzInitData {
    const backendUrl = getPaymentBaseUrl();

    return {
        total_amount: Number(order.total).toFixed(2),
        currency: "BDT",
        tran_id: transactionId,
        success_url: `${backendUrl}/paymentSSLsuccess?tran_id=${transactionId}&order_id=${order.id}`,
        fail_url: `${backendUrl}/api/payment/failed?tran_id=${transactionId}&order_id=${order.id}`,
        cancel_url: `${backendUrl}/api/payment/cancel?tran_id=${transactionId}&order_id=${order.id}`,
        ipn_url: `${backendUrl}/api/payment/ipn`,
        shipping_method: "Courier",
        product_name: `Order #${order.id}`,
        product_category: "Electronics",
        product_profile: "general",
        cus_name: order.fullName,
        cus_email: order.email,
        cus_add1: order.address,
        cus_city: order.city,
        cus_state: order.city,
        cus_postcode: order.zipCode,
        cus_country: "Bangladesh",
        cus_phone: order.phone,
        num_of_item: order.items.length,
        ship_name: order.fullName,
        ship_add1: order.address,
        ship_city: order.city,
        ship_postcode: order.zipCode,
        ship_country: "Bangladesh",
    };
}
