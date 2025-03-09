// components/ui/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Import icons from a library like lucide-react
import {
    Layers,
    FileText,
    Menu,
    Grid,
    User,
    File,
    Users
} from 'lucide-react';

type SidebarItemProps = {
    icon: React.ReactNode;
    label: string;
    href: string;
    isActive?: boolean;
};

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center w-full border-b border-gray-200 justify-center p-4 text-xs text-gray-500 hover:text-gray-900 transition-colors",
                isActive && "text-blue-600 border-l-[5px] border-l-blue-600"
            )}
        >
            <div className="mb-1">
                {icon}
            </div>
            <span>{label}</span>
        </Link>
    );
};

type SidebarProps = {
    className?: string;
    activeItem?: string;
};

export function Sidebar({ className, activeItem = 'dashboards' }: SidebarProps) {
    const items = [
        { icon: <Layers size={20} />, label: 'Dashboards', href: '/dashboards', id: 'dashboards' },
        { icon: <FileText size={20} />, label: 'Pages', href: '/pages', id: 'pages' },
        { icon: <Grid size={20} />, label: 'Applications', href: '/applications', id: 'applications' },
        { icon: <User size={20} />, label: 'UI', href: '/ui', id: 'ui' },
        { icon: <Menu size={20} />, label: 'Menu', href: '/menu', id: 'menu' },
        { icon: <File size={20} />, label: 'Blank Page', href: '/blank', id: 'blank' },
        { icon: <Users size={20} />, label: 'Docs', href: '/docs', id: 'docs' },
    ];

    return (
        <div className={cn("w-24 bg-white fixed h-100vh left-0 bottom-0 top-16 z-10 shadow-lg h-screen flex flex-col items-center", className)}>
            {items.map((item) => (
                <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    href={item.href}
                    isActive={activeItem === item.id}
                />
            ))}
        </div>
    );
}

export default Sidebar;