import prisma from "@/utils/prisma"
import { Prisma } from "@prisma/client"

export type ProductSort = "newest" | "price-asc" | "price-desc" | "name-asc"

export interface ShopFilters {
    category?: string
    brand?: string
    minPrice?: string
    maxPrice?: string
    q?: string
    sort?: ProductSort
}

const VALID_SORTS: ProductSort[] = ["newest", "price-asc", "price-desc", "name-asc"]

export function parseSort(sort?: string): ProductSort {
    if (sort && VALID_SORTS.includes(sort as ProductSort)) {
        return sort as ProductSort
    }
    return "newest"
}

export function buildProductWhereClause(filters: ShopFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {}

    if (filters.category) {
        where.category = { name: filters.category }
    }

    if (filters.brand) {
        where.brand = filters.brand
    }

    const rawMin = filters.minPrice ? Number(filters.minPrice) : undefined
    const rawMax = filters.maxPrice ? Number(filters.maxPrice) : undefined

    const validMin =
        rawMin !== undefined && !Number.isNaN(rawMin) && rawMin >= 0 ? rawMin : undefined
    const validMax =
        rawMax !== undefined && !Number.isNaN(rawMax) && rawMax > 0 ? rawMax : undefined

    if (validMin !== undefined || validMax !== undefined) {
        let gte = validMin
        let lte = validMax

        if (gte !== undefined && lte !== undefined && gte > lte) {
            ;[gte, lte] = [lte, gte]
        }

        where.price = {}
        if (gte !== undefined) where.price.gte = gte
        if (lte !== undefined) where.price.lte = lte
    }

    const query = filters.q?.trim()
    if (query) {
        where.OR = [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
        ]
    }

    return where
}

function getOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput {
    switch (sort) {
        case "price-asc":
            return { price: "asc" }
        case "price-desc":
            return { price: "desc" }
        case "name-asc":
            return { name: "asc" }
        case "newest":
        default:
            return { createdAt: "desc" }
    }
}

function normalizeWhere(where: Prisma.ProductWhereInput) {
    return Object.keys(where).length > 0 ? where : undefined
}

export async function getSomeProducts() {
    return prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
        take: 6,
    })
}

export async function getAllProducts(
    page: number,
    itemsPerPage: number,
    whereClause: Prisma.ProductWhereInput,
    sort: ProductSort = "newest"
) {
    return prisma.product.findMany({
        where: normalizeWhere(whereClause),
        include: { category: true },
        orderBy: getOrderBy(sort),
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
    })
}

export async function getShopProducts(page: number, itemsPerPage: number, filters: ShopFilters) {
    const where = buildProductWhereClause(filters)
    const whereArg = normalizeWhere(where)
    const sort = parseSort(filters.sort)

    const [totalProducts, brands, priceRange, categories] = await Promise.all([
        prisma.product.count({ where: whereArg }),
        getAllBrands(filters.category ?? ""),
        getPriceRange(),
        getAllCategories(),
    ])

    const totalPages = Math.max(1, Math.ceil(totalProducts / itemsPerPage))
    const safePage = Math.min(Math.max(1, page), totalPages)

    const products = await prisma.product.findMany({
        where: whereArg,
        include: { category: true },
        orderBy: getOrderBy(sort),
        skip: (safePage - 1) * itemsPerPage,
        take: itemsPerPage,
    })

    return { products, totalProducts, totalPages, safePage, brands, priceRange, categories }
}

export async function getProductById(id: number) {
    return prisma.product.findUnique({
        where: { id },
        include: { category: true },
    })
}

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    })
}

export async function getAllBrands(categoryName: string) {
    const where: Prisma.ProductWhereInput | undefined = categoryName
        ? { category: { name: categoryName } }
        : undefined

    const products = await prisma.product.findMany({
        where,
        select: { brand: true },
        distinct: ["brand"],
        orderBy: { brand: "asc" },
    })

    return products.map((b) => b.brand)
}

export async function getPriceRange() {
    const aggregation = await prisma.product.aggregate({
        _min: { price: true },
        _max: { price: true },
    })

    return {
        minPrice: aggregation._min.price ?? 0,
        maxPrice: aggregation._max.price ?? 1000,
    }
}
