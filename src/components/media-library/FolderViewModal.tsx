/**
 * @fileoverview Modal component for viewing folder details and contents
 * @module FolderViewModal
 * @requires react
 * @requires lucide-react
 * @requires date-fns
 * @requires @/components/ui/dialog
 * @requires @/components/ui/button
 * @requires @/app/media-library/page
 * @requires ./FileGrid
 */

'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileItem } from '@/app/media-library/page';
import { Folder, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { FileGrid } from './FileGrid';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Props for the FolderViewModal component
 *
 * @typedef {Object} FolderViewModalProps
 * @property {FileItem} folder - The folder to display details for
 * @property {FileItem[]} files - Array of all files in the media library
 * @property {Function} onClose - Function to call when closing the modal
 * @property {Function} onOpenFile - Function to call when a file is selected
 * @property {Function} onOpenFolder - Function to call when a folder is selected
 * @property {Function} onNavigateToFolder - Function to navigate to a folder in the main view
 */

interface FolderViewModalProps {
    folder: FileItem;
    files: FileItem[];
    onClose: () => void;
    onOpenFile: (fileId: string) => void;
    onOpenFolder: (folderId: string) => void;
    onNavigateToFolder: (folderId: string | null, folderName?: string) => void;
}

/**
 * Modal component for viewing folder details and browsing folder contents
 *
 * Displays comprehensive information about a folder, including its metadata
 * and contents. Users can view files within the folder, navigate to subfolders,
 * and perform actions on the folder.
 *
 * @component
 * @param {FolderViewModalProps} props - Component props
 * @returns {React.ReactElement} The rendered modal component
 */
export function FolderViewModal({
    folder,
    files,
    onClose,
    onOpenFile,
    onOpenFolder,
    onNavigateToFolder
}: FolderViewModalProps) {
    /**
     * Format the folder's modification date as a relative time string
     * @type {string}
     */
    const formattedDate = formatDistanceToNow(new Date(folder.dateModified), { addSuffix: true });

    /**
     * Filter the files that belong to this folder (based on parentId)
     * @type {FileItem[]}
     */
    const folderContents = files.filter(file => file.parentId === folder.id);

    /**
     * Handles file selection within the folder view
     *
     * When a file is selected, it opens the file details view.
     * When a folder is selected, it opens the folder details view.
     *
     * @param {string} id - ID of the selected file or folder
     * @param {boolean} selected - Whether the item is being selected or deselected
     */
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

    // Animation variants
    const modalContentVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 25
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.98,
            transition: { duration: 0.2 }
        }
    };

    const staggerItems = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    return (
        <Dialog open={!!folder} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-auto p-0">
                <AnimatePresence>
                    <motion.div
                        variants={modalContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="p-6"
                    >
                        {/* Dialog header with folder name and close button */}
                        <DialogHeader className="flex flex-row items-center justify-between mb-6">
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Folder className="h-6 w-6 text-amber-500" />
                                <DialogTitle className="text-xl">{folder.name}</DialogTitle>
                            </motion.div>
                            <DialogClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </DialogHeader>

                        <motion.div
                            className="space-y-6"
                            variants={staggerItems}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Folder information */}
                            <motion.div
                                className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border"
                                variants={itemVariants}
                            >
                                {/* Folder name */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Folder Name</h3>
                                    <p className="text-base">{folder.name}</p>
                                </div>

                                {/* Last modified date */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
                                    <p className="text-base">{formattedDate}</p>
                                </div>

                                {/* Folder path */}
                                <div className="col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Folder Path</h3>
                                    <p className="text-base font-mono text-sm text-gray-700">{folder.path || '/'}</p>
                                </div>

                                {/* Item count */}
                                <div className="col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Items</h3>
                                    <p className="text-base">{folderContents.length} items</p>
                                </div>

                                {/* Optional folder description */}
                                {folder.description && (
                                    <div className="col-span-2">
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="text-base">{folder.description}</p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Folder contents section */}
                            <motion.div variants={itemVariants}>
                                <h3 className="text-sm font-medium text-gray-500 mb-3">Folder Contents</h3>
                                {folderContents.length === 0 ? (
                                    <motion.div
                                        className="text-center py-8 bg-gray-50 rounded-lg border border-dashed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <p className="text-gray-500">This folder is empty</p>
                                    </motion.div>
                                ) : (
                                    <FileGrid
                                        files={folderContents}
                                        onSelectFile={handleSelectFile}
                                    />
                                )}
                            </motion.div>

                            {/* Action buttons */}
                            <motion.div
                                className="flex justify-end space-x-3"
                                variants={itemVariants}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Button
                                    variant="secondary"
                                    onClick={() => onNavigateToFolder(folder.id)}
                                >
                                    Open in Library
                                </Button>
                                <Button variant="outline">Download All</Button>
                                <Button variant="outline" className="text-red-600 hover:bg-red-50">Delete Folder</Button>
                                <Button>Share Folder</Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}