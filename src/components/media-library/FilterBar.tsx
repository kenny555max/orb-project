import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Search, ChevronDown, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FileItem } from '@/app/media-library/page'; // Importing FileItem type from the main page

type FilterBarProps = {
    onSearch: (query: string) => void;
    onFilter: (filter: string) => void;
    currentFilter: string;
    searchValue: string;
    className?: string;
    availableFiles: FileItem[]; // New prop to receive all files in current folder
};

export function FilterBar({
  onSearch,
  onFilter,
  currentFilter,
  searchValue,
  className,
  availableFiles = []
}: FilterBarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
    };

    // Dynamically determine which file types are present in the current folder
    const availableFileTypes = useMemo(() => {
        const types = new Set<string>();

        // Always include 'all' option
        types.add('all');

        // Add file types that exist in the current folder
        availableFiles.forEach(file => {
            if (file.type) {
                types.add(file.type);
            }
        });

        return Array.from(types);
    }, [availableFiles]);

    // Get the display name for a filter type
    const getFilterDisplayName = (filterType: string) => {
        if (filterType === 'all') return 'All Files';
        return filterType.charAt(0).toUpperCase() + filterType.slice(1);
    };

    // Count the number of files of each type
    const fileTypeCounts = useMemo(() => {
        const counts: Record<string, number> = { all: availableFiles.length };
        availableFiles.forEach(file => {
            if (file.type) {
                counts[file.type] = (counts[file.type] || 0) + 1;
            }
        });
        return counts;
    }, [availableFiles]);

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    className="pl-10 h-10 w-full bg-white"
                    placeholder="Search files and folders..."
                    onChange={handleSearchChange}
                    value={searchValue}
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>
                            {getFilterDisplayName(currentFilter)}
                        </span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {availableFileTypes.map(fileType => (
                        <DropdownMenuItem
                            key={fileType}
                            onClick={() => onFilter(fileType)}
                            disabled={fileTypeCounts[fileType] === 0}
                            className={currentFilter === fileType ? "bg-gray-100" : ""}
                        >
                            {getFilterDisplayName(fileType)}
                            <span className="ml-2 text-gray-500 text-xs">
                                {fileTypeCounts[fileType] || 0}
                            </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}