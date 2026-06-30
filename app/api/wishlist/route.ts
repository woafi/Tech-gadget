import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.wishlist.findMany({
    where: { userId: user.id },
    include: { product: { include: { category: true } } },
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
  const { productId } = body;

  if (!productId || typeof productId !== "number") {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    // Already in wishlist — remove it (toggle behavior)
    await prisma.wishlist.delete({
      where: { id: existing.id },
    });
    return NextResponse.json({ message: "Removed from wishlist", action: "removed" });
  }

  const item = await prisma.wishlist.create({
    data: { userId: user.id, productId },
    include: { product: { include: { category: true } } },
  });

  return NextResponse.json({ item, action: "added" }, { status: 201 });
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

  const wishlistItem = await prisma.wishlist.findUnique({ where: { id } });

  if (!wishlistItem || wishlistItem.userId !== user.id) {
    return NextResponse.json({ error: "Wishlist item not found" }, { status: 404 });
  }

  await prisma.wishlist.delete({ where: { id } });

  return NextResponse.json({ message: "Item removed from wishlist" });
}
