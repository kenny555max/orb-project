/**
 * @fileoverview Modal component for creating new folders in the media library
 * @module FolderCreationModal
 * @requires react
 * @requires lucide-react
 * @requires @/components/ui/button
 * @requires @/components/ui/input
 * @requires @/components/ui/dialog
 * @requires @/components/ui/label
 */

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


/**
 * Props for the FolderCreationModal component
 *
 * @typedef {Object} FolderCreationModalProps
 * @property {boolean} isOpen - Whether the modal is currently open
 * @property {Function} onClose - Function to call when closing the modal
 * @property {Function} onCreateFolder - Function to call when a folder is created with name and optional description
 */
type FolderCreationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onCreateFolder: (folderName: string, description?: string) => void;
};

/**
 * Modal component for creating new folders in the media library
 *
 * Provides a form interface for users to enter a folder name and optional
 * description when creating a new folder. Includes validation to ensure
 * a folder name is provided.
 *
 * @component
 * @param {FolderCreationModalProps} props - Component props
 * @returns {React.ReactElement} The rendered modal component
 */
export function FolderCreationModal({
                                        isOpen,
                                        onClose,
                                        onCreateFolder,
                                    }: FolderCreationModalProps) {
    /**
     * State for the folder name input
     * @type {[string, Function]} folderName state and setter
     */
    const [folderName, setFolderName] = useState('');

    /**
     * State for the folder description input
     * @type {[string, Function]} description state and setter
     */
    const [description, setDescription] = useState('');

    /**
     * State for validation error messages
     * @type {[string, Function]} error state and setter
     */
    const [error, setError] = useState('');

    /**
     * Handles form submission for folder creation
     *
     * Validates that a folder name is provided, then calls the onCreateFolder
     * callback with the name and description (if any). Resets the form and
     * closes the modal on successful submission.
     *
     * @param {React.FormEvent} e - Form submission event
     */
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
                        {/* Folder name input field */}
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
                            {/* Error message for validation */}
                            {error && <p className="text-red-500 text-sm col-start-2 col-span-3">{error}</p>}
                        </div>

                        {/* Optional folder description input field */}
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

                    {/* Form action buttons */}
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