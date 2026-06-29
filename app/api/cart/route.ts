import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, quantity = 1 } = body;

  if (!productId || typeof productId !== "number") {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.cart.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    const item = await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
      include: { product: true },
    });
    return NextResponse.json({ item });
  }

  const item = await prisma.cart.create({
    data: { userId: user.id, productId, quantity },
    include: { product: true },
  });

  return NextResponse.json({ item }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, quantity } = body;

  if (!id || quantity == null) {
    return NextResponse.json({ error: "id and quantity are required" }, { status: 400 });
  }

  const cartItem = await prisma.cart.findUnique({ where: { id } });

  if (!cartItem || cartItem.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  if (quantity < 1) {
    await prisma.cart.delete({ where: { id } });
    return NextResponse.json({ message: "Item removed" });
  }

  const item = await prisma.cart.update({
    where: { id },
    data: { quantity },
    include: { product: true },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "id query parameter is required" }, { status: 400 });
  }

  const cartItem = await prisma.cart.findUnique({ where: { id } });

  if (!cartItem || cartItem.userId !== user.id) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cart.delete({ where: { id } });

  return NextResponse.json({ message: "Item removed" });
}
