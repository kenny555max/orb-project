// components/media-library/FileCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Folder, File, Music, Video } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import Image from "next/image";

export type FileType = 'folder' | 'image' | 'audio' | 'video' | 'document' | 'other';

export type FileItem = {
    id: string;
    name: string;
    type: FileType | string;
    dateModified: Date;
    size?: string;
    thumbnailUrl?: string;
    description?: string;
};

type FileCardProps = {
    file: FileItem;
    isSelected?: boolean;
    onSelect?: (id: string, selected: boolean) => void;
    className?: string;
};

export function FileCard({ file, isSelected = false, onSelect, className }: FileCardProps) {
    const handleSelect = (checked: boolean) => {
        if (onSelect) {
            onSelect(file.id, checked);
        }
    };

    // Function to determine the icon based on file type
    const renderFileIcon = () => {
        switch (file.type) {
            case 'folder':
                return <Folder className="h-12 w-12 text-blue-500" />;
            case 'audio':
                return <Music className="h-12 w-12 text-purple-500" />;
            case 'video':
                return <Video className="h-12 w-12 text-red-500" />;
            case 'image':
                return null; // No icon for images as we'll show the thumbnail
            default:
                return <File className="h-12 w-12 text-gray-500" />;
        }
    };

    // Format the date to display
    const formattedDate = format(file.dateModified, 'dd.MM.yyyy HH:mm');

    return (
        <div
            className={cn(
                "group relative border rounded-md p-3 hover:border-blue-500 transition-colors",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
                className
            )}
        >
            <div className="absolute top-2 right-2 z-10">
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={handleSelect}
                    className="h-4 w-4 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
            </div>

            <div className="flex items-center justify-center h-32 mb-2 bg-gray-50 rounded overflow-hidden">
                {file.type === 'image' && file.thumbnailUrl ? (
                    <Image
                        src={file.thumbnailUrl}
                        alt={file.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    renderFileIcon()
                )}
            </div>

            <div className="mt-2">
                <h3 className="text-sm font-medium text-gray-900 truncate">{file.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
            </div>
        </div>
    );
}

export default FileCard;