"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "@/components/Pagination";

interface ShopPaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function ShopPagination({ currentPage, totalPages }: ShopPaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const nextPage = Math.max(1, Math.min(page, totalPages));
        const params = new URLSearchParams(searchParams.toString());

        if (nextPage === 1) {
            params.delete("page");
        } else {
            params.set("page", String(nextPage));
        }

        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    };

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
}
