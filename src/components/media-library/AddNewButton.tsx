import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { FolderCreationModal } from './FolderCreationModal';
import { FileUploadModal } from './FileUploadModal';
import { FileItem } from '@/app/media-library/page';

type AddNewButtonProps = {
    onUploadFile: (files: File[]) => void;
    onCreateFolder: (name: string, description?: string) => void;
    existingFiles: FileItem[];
    className?: string;
};

export function AddNewButton({
                                 onUploadFile,
                                 onCreateFolder,
                                 existingFiles = [],
                                 className
                             }: AddNewButtonProps) {
    const [folderModalOpen, setFolderModalOpen] = useState(false);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const handleCreateFolder = (name: string, description?: string) => {
        onCreateFolder(name, description);
        setFolderModalOpen(false);
    };

    const handleUploadFiles = (files: File[]) => {
        onUploadFile(files);
        setUploadModalOpen(false);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className={cn("bg-blue-600 hover:bg-blue-700 text-white", className)}>
                        <span>ADD NEW</span>
                        <Plus className="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setUploadModalOpen(true)}>
                        Upload File
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFolderModalOpen(true)}>
                        Create Folder
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <FolderCreationModal
                isOpen={folderModalOpen}
                onClose={() => setFolderModalOpen(false)}
                onCreateFolder={handleCreateFolder}
            />

            <FileUploadModal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                onUploadFiles={handleUploadFiles}
                existingFiles={existingFiles}
            />
        </>
    );
}