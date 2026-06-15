"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
    href: string;
    children: ReactNode;
}

const DesktopNavigation = () => {
    const pathname = usePathname();

    // Check if the current route matches the link's href
    const isActive = pathname === href;
    return (
        <div className="hidden md:flex items-center space-x-8">

        </div>
    )
}

export default DesktopNavigation;