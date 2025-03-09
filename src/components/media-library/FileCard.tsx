// components/media-library/FileCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Folder, File, Music, Video, FolderOpen } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';

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
    onOpenFolder?: (folderId: string) => void;
    onSelect?: (id: string, selected: boolean) => void;
    className?: string;
    onOpenFile?: (fileId: string) => void;
    onNavigateToFolder?: (folderId: string | null, folderName?: string) => void;
};

export function FileCard({
                             onOpenFolder,
                             onOpenFile,
                             onNavigateToFolder,
                             file,
                             isSelected = false,
                             onSelect,
                             className
                         }: FileCardProps) {
    const handleSelect = (checked: boolean) => {
        if (onSelect) {
            onSelect(file.id, checked);
        }
    };

    const handleClick = () => {
        if (file.type === 'folder' && onOpenFolder) {
            onOpenFolder(file.id);
        } else if (onOpenFile) {
            onOpenFile(file.id);
        }
    };

    const handleDoubleClick = () => {
        if (file.type === 'folder' && onNavigateToFolder) {
            onNavigateToFolder(file.id, file.name);
        } else if (onOpenFile) {
            onOpenFile(file.id);
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
            onDoubleClick={handleDoubleClick}
        >
            {onSelect && (
                <div
                    className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleSelect}
                        className="border-2 border-gray-300 bg-white"
                    />
                </div>
            )}

            <div
                className="flex flex-col items-center justify-center p-3"
                onClick={handleClick}
            >
                {file.type === 'image' && file.thumbnailUrl ? (
                    <div className="w-full h-32 relative">
                        <Image
                            src={file.thumbnailUrl}
                            alt={file.name}
                            width={100}
                            height={100}
                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                        />
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center">
                        {renderFileIcon()}
                    </div>
                )}
            </div>

            <div onClick={handleClick}>
                <h3 className="font-medium text-gray-900 truncate mb-1">{file.name}</h3>
                <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{file.type === 'folder' ? 'Folder' : file.type.charAt(0).toUpperCase() + file.type.slice(1)}</span>
                    {file.size && <span>{file.size}</span>}
                </div>
                <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
            </div>

            {file.type === 'folder' && onNavigateToFolder && (
                <div className="mt-2 pt-2 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs flex items-center justify-center text-blue-600"
                        onClick={() => onNavigateToFolder(file.id, file.name)}
                    >
                        <FolderOpen className="h-3 w-3 mr-1" />
                        Open in Library
                    </Button>
                </div>
            )}
        </div>
    );
}

export default FileCard;