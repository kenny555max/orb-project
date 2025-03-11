/**
 * @fileoverview Modal component for creating new folders in the media library with animations
 * @module FolderCreationModal
 * @requires react
 * @requires lucide-react
 * @requires @/components/ui/button
 * @requires @/components/ui/input
 * @requires @/components/ui/dialog
 * @requires @/components/ui/label
 * @requires framer-motion
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
import { motion, AnimatePresence } from 'framer-motion';

// Animated components
const MotionDiv = motion.div;
const MotionForm = motion.form;
const MotionInput = motion(Input);
const MotionButton = motion(Button);

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
 * Modal component for creating new folders in the media library with animations
 *
 * Provides an animated form interface for users to enter a folder name and optional
 * description when creating a new folder. Includes validation to ensure
 * a folder name is provided and smooth animations for a professional feel.
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

    // Animation variants for staggered children animations
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <MotionDiv
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 15 }}
                    >
                        <DialogTitle className="flex items-center gap-2">
                            <MotionDiv
                                initial={{ rotate: -20, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            >
                                <Folder className="h-5 w-5 text-blue-500" />
                            </MotionDiv>
                            Create New Folder
                        </DialogTitle>
                    </MotionDiv>
                    <MotionDiv
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <DialogDescription>
                            Create a new folder to organize your media files.
                        </DialogDescription>
                    </MotionDiv>
                </DialogHeader>

                <MotionForm
                    onSubmit={handleSubmit}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    <div className="grid gap-4 py-4">
                        {/* Folder name input field */}
                        <MotionDiv
                            className="grid grid-cols-4 items-center gap-4"
                            variants={itemVariants}
                        >
                            <Label htmlFor="folderName" className="text-right">
                                Name
                            </Label>
                            <MotionInput
                                id="folderName"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                placeholder="My Folder"
                                className="col-span-3"
                                autoFocus
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            />
                            {/* Error message for validation */}
                            <AnimatePresence>
                                {error && (
                                    <MotionDiv
                                        className="text-red-500 text-sm col-start-2 col-span-3"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {error}
                                    </MotionDiv>
                                )}
                            </AnimatePresence>
                        </MotionDiv>

                        {/* Optional folder description input field */}
                        <MotionDiv
                            className="grid grid-cols-4 items-center gap-4"
                            variants={itemVariants}
                        >
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <MotionInput
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Optional description"
                                className="col-span-3"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.3)" }}
                                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                            />
                        </MotionDiv>
                    </div>

                    {/* Form action buttons */}
                    <DialogFooter>
                        <MotionDiv
                            className="flex flex-row gap-2"
                            variants={itemVariants}
                        >
                            <MotionButton
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                Cancel
                            </MotionButton>
                            <MotionButton
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                whileHover={{ scale: 1.03, backgroundColor: "#2563eb" }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 400 }}
                            >
                                Create Folder
                            </MotionButton>
                        </MotionDiv>
                    </DialogFooter>
                </MotionForm>
            </DialogContent>
        </Dialog>
    );
}

export default FolderCreationModal;