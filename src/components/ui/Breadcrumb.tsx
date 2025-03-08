// components/ui/Breadcrumb.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
    label: string;
    href: string;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
    className?: string;
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav className={cn("flex items-center space-x-1 text-sm", className)}>
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <React.Fragment key={item.href}>
                        <Link
                            href={item.href}
                            className={cn(
                                "hover:text-blue-600 transition-colors",
                                isLast ? "font-medium text-gray-900" : "text-gray-500"
                            )}
                        >
                            {item.label}
                        </Link>

                        {!isLast && (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        )}
                    </React.Fragment>
                );
            })}
        </nav>
    );
}

export default Breadcrumb;