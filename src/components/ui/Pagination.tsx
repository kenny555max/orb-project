// components/ui/Pagination.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
    itemsPerPage?: number;
    totalItems?: number;
};

export function Pagination({
   currentPage,
   totalPages,
   onPageChange,
   className,
   itemsPerPage = 10,
   totalItems = 0
}: PaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            // If we have 7 or fewer pages, show all of them
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // If current page is among the first 3 pages
            if (currentPage <= 3) {
                pages.push(2, 3, 4, '...', totalPages);
            }
            // If current page is among the last 3 pages
            else if (currentPage >= totalPages - 2) {
                pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
            // If current page is somewhere in the middle
            else {
                pages.push('...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }

        return pages;
    };

    // Calculate item range being displayed
    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

    return (
        <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
            {totalItems > 0 && (
                <div className="text-sm text-gray-500 order-2 sm:order-1">
                    Showing <span className="font-medium">{startItem}</span> to{" "}
                    <span className="font-medium">{endItem}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> results
                </div>
            )}

            <div className="flex items-center justify-center space-x-1 order-1 sm:order-2">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {typeof page === 'number' ? (
                            <Button
                                variant={page === currentPage ? "default" : "outline"}
                                className={cn(
                                    "h-8 w-8",
                                    page === currentPage ? "bg-blue-600 text-white" : "text-gray-600"
                                )}
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </Button>
                        ) : (
                            <span className="h-8 w-8 flex items-center justify-center text-gray-400">
                                {page}
                            </span>
                        )}
                    </React.Fragment>
                ))}

                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default Pagination;