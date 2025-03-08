// components/ui/Header.tsx
import React from 'react';
import { Search, BellDot, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type HeaderProps = {
    className?: string;
    user?: {
        name: string;
        image?: string;
    };
};

export function Header({ className, user }: HeaderProps) {
    return (
        <div className={cn("w-full h-16 fixed top-0 z-10 shadow-lg px-6 flex items-center justify-between bg-white", className)}>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 h-9 w-60 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                        placeholder="Search..."
                    />
                </div>
            </div>

            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-gray-500">
                    <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-500 relative">
                    <BellDot className="h-5 w-5" />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-gray-700">{user?.name || 'Sarah Knowles'}</span>
                </div>
            </div>
        </div>
    );
}

export default Header;