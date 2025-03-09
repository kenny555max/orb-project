'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/app/media-library/page';
import { Folder, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FileGrid } from './FileGrid';

interface FolderViewModalProps {
    folder: FileItem;
    files: FileItem[];
    onClose: () => void;
    onOpenFile: (fileId: string) => void;
    onOpenFolder: (folderId: string) => void;
    onNavigateToFolder: (folderId: string | null, folderName?: string) => void;
}

export function FolderViewModal({
    folder,
    files,
    onClose,
    onOpenFile,
    onOpenFolder,
    onNavigateToFolder
}: FolderViewModalProps) {
    //const [isLoading, setIsLoading] = useState(false);
    //const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    // Format the date for display
    const formattedDate = formatDistanceToNow(new Date(folder.dateModified), { addSuffix: true });

    // Filter files that belong to this folder
    const folderContents = files.filter(file => file.parentId === folder.id);

    // Handle selecting files
    const handleSelectFile = (id: string, selected: boolean) => {
        // This is a simplified implementation since we're just viewing
        if (selected) {
            const selectedFile = folderContents.find(file => file.id === id);
            if (selectedFile?.type === 'folder') {
                onOpenFolder(id);
            } else if (selectedFile) {
                onOpenFile(id);
            }
        }
    };

    return (
        <Dialog open={!!folder} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Folder className="h-6 w-6 text-amber-500" />
                        <DialogTitle className="text-xl">{folder.name}</DialogTitle>
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Folder information */}
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Folder Name</h3>
                            <p className="text-base">{folder.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
                            <p className="text-base">{formattedDate}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Folder Path</h3>
                            <p className="text-base font-mono text-sm text-gray-700">{folder.path || '/'}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">Items</h3>
                            <p className="text-base">{folderContents.length} items</p>
                        </div>
                        {folder.description && (
                            <div className="col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="text-base">{folder.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Folder contents section */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">Folder Contents</h3>
                        {folderContents.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                                <p className="text-gray-500">This folder is empty</p>
                            </div>
                        ) : (
                            <FileGrid
                                files={folderContents}
                                onSelectFile={handleSelectFile}
                            />
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => onNavigateToFolder(folder.id)}
                        >
                            Open in Library
                        </Button>
                        <Button variant="outline">Download All</Button>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50">Delete Folder</Button>
                        <Button>Share Folder</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}