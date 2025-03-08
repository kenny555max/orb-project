// components/media-library/FolderCreationModal.tsx
import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

type FolderCreationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string, description?: string) => void;
};

export function FolderCreationModal({
                                        isOpen,
                                        onClose,
                                        onCreateFolder,
                                    }: FolderCreationModalProps) {
    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!folderName.trim()) {
            setError('Folder name is required');
            return;
        }

        // Clear any previous errors
        setError('');

        // Call the create folder function
        onCreateFolder(folderName, description);

        // Reset the form
        setFolderName('');
        setDescription('');

        // Close the modal
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Folder className="h-5 w-5 text-blue-500" />
                        Create New Folder
                    </DialogTitle>
                    <DialogDescription>
                        Create a new folder to organize your media files.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="folderName" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="folderName"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="My Folder"
                                className="col-span-3"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-sm col-start-2 col-span-3">{error}</p>}
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional description"
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Create Folder
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default FolderCreationModal;