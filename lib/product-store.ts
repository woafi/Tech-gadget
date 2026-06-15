import prisma from "@/utils/prisma"

export async function getSomeProducts() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        take: 6,
    })
    console.log(products)
    return products;
}