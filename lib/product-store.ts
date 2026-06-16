import prisma from "@/utils/prisma"

export async function getSomeProducts() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 6,
    })
    return products;
}

export async function getAllProducts(safeCurrentPage: number, ITEMS_PER_PAGE: number) {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        skip: (safeCurrentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    })
    return products;
}