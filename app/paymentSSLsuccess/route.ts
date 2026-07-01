import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
    const transactionId = request.nextUrl.searchParams.get("tran_id");
    const orderId = request.nextUrl.searchParams.get("order_id");

    return NextResponse.redirect(`${process.env.CLIENT_URL}/paymentSuccess?tran_id=${transactionId}&order_id=${orderId}`);
}
export async function GET(request: NextRequest) {
    const transactionId = request.nextUrl.searchParams.get("tran_id");
    const orderId = request.nextUrl.searchParams.get("order_id");

    return NextResponse.redirect(`${process.env.CLIENT_URL}/paymentSuccess?tran_id=${transactionId}&order_id=${orderId}`);

}