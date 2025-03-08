// components/media-library/FilterBar.tsx
import React from 'react';
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

type FilterBarProps = {
    onSearch?: (query: string) => void;
    onFilter?: (filter: string) => void;
    className?: string;
};

export function FilterBar({ onSearch, onFilter, className }: FilterBarProps) {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    className="pl-10 h-10 w-full bg-white"
                    placeholder="Search..."
                    onChange={handleSearchChange}
                />
            </div>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Filter By</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onFilter && onFilter('all')}>
                        All Files
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilter && onFilter('images')}>
                        Images
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilter && onFilter('documents')}>
                        Documents
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilter && onFilter('audio')}>
                        Audio
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFilter && onFilter('video')}>
                        Video
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}

export default FilterBar;