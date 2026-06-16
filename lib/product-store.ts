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

export async function getAllProducts(safeCurrentPage: number, ITEMS_PER_PAGE: number, whereClause: any) {

    const products = await prisma.product.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        include: {
            category: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip: (safeCurrentPage - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    })
    return products;
}

export async function getAllBrands() {
    const brands = await prisma.product.findMany({
        select: {
            brand: true,
        },
        distinct: ['brand'],
        orderBy: {
            brand: 'asc',
        },
    })
    return brands.map(b => b.brand);
}

export async function getPriceRange() {
    const aggregation = await prisma.product.aggregate({
        _min: {
            price: true,
        },
        _max: {
            price: true,
        },
    })
    return {
        minPrice: aggregation._min.price ?? 0,
        maxPrice: aggregation._max.price ?? 1000,
    }
}