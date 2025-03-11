// components/media-library/FileCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Folder, File, Music, Video, FolderOpen } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

/**
 * Represents the types of files supported in the media library
 * @typedef {'folder' | 'image' | 'audio' | 'video' | 'document' | 'other'} FileType
 */
export type FileType = 'folder' | 'image' | 'audio' | 'video' | 'document' | 'other';

/**
 * Represents a file or folder item in the media library
 * @typedef {Object} FileItem
 * @property {string} id - Unique identifier for the file or folder
 * @property {string} name - Name of the file or folder
 * @property {FileType | string} type - Type of the file or folder
 * @property {Date} dateModified - Date when the file was last modified
 * @property {string} [size] - Size of the file (optional)
 * @property {string} [thumbnailUrl] - URL to the thumbnail image (optional)
 * @property {string} [description] - Description of the file (optional)
 */
export type FileItem = {
    id: string;
    name: string;
    type: FileType | string;
    dateModified: Date;
    size?: string;
    thumbnailUrl?: string;
    description?: string;
};

/**
 * Props for the FileCard component
 * @typedef {Object} FileCardProps
 * @property {FileItem} file - The file or folder to display
 * @property {boolean} [isSelected] - Whether the file is selected
 * @property {(folderId: string) => void} [onOpenFolder] - Callback when a folder is opened
 * @property {(id: string, selected: boolean) => void} [onSelect] - Callback when selection state changes
 * @property {string} [className] - Additional CSS classes
 * @property {(fileId: string) => void} [onOpenFile] - Callback when a file is opened
 * @property {(folderId: string | null, folderName?: string) => void} [onNavigateToFolder] - Callback when navigating to a folder
 */
type FileCardProps = {
    file: FileItem;
    isSelected?: boolean;
    onOpenFolder?: (folderId: string) => void;
    onSelect?: (id: string, selected: boolean) => void;
    className?: string;
    onOpenFile?: (fileId: string) => void;
    onNavigateToFolder?: (folderId: string | null, folderName?: string) => void;
};

/**
 * FileCard Component
 *
 * Displays a file or folder as a card with thumbnail, name, metadata and actions.
 * Supports selection, navigation, and opening files.
 * Includes animations for hover states, selection, and interactions.
 *
 * @param {FileCardProps} props - Component props
 * @returns {JSX.Element} Rendered FileCard component
 */
export function FileCard({
                             onOpenFolder,
                             onOpenFile,
                             onNavigateToFolder,
                             file,
                             isSelected = false,
                             onSelect,
                             className
                         }: FileCardProps) {
    // Animation variants for the card
    const cardVariants = {
        initial: {
            scale: 0.97,
            opacity: 0,
            y: 10
        },
        animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 350,
                damping: 25,
                duration: 0.3
            }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 20
            }
        },
        tap: {
            scale: 0.98,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 17
            }
        }
    };

    // Animation variants for icons
    const iconVariants = {
        initial: {
            scale: 0.8,
            opacity: 0,
            rotate: -5
        },
        animate: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1
            }
        },
        hover: {
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    // Animation variants for the image thumbnail
    const imageVariants = {
        initial: {
            scale: 0.9,
            opacity: 0
        },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
                delay: 0.1
            }
        },
        hover: {
            scale: 1.04,
            transition: {
                duration: 0.3
            }
        }
    };

    // Animation variants for text elements
    const textVariants = {
        initial: {
            opacity: 0,
            y: 5
        },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                delay: 0.2
            }
        }
    };

    // Animation variants for the button
    const buttonVariants = {
        initial: {
            opacity: 0,
            y: 10
        },
        animate: {
            opacity: 0,
            y: 10
        },
        hover: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.2
            }
        }
    };

    /**
     * Handles the checkbox selection change
     * @param {boolean} checked - New checked state
     */
    const handleSelect = (checked: boolean) => {
        if (onSelect) {
            onSelect(file.id, checked);
        }
    };

    /**
     * Handles click on the card
     */
    const handleClick = () => {
        if (file.type === 'folder' && onOpenFolder) {
            onOpenFolder(file.id);
        } else if (onOpenFile) {
            onOpenFile(file.id);
        }
    };

    /**
     * Handles double click on the card
     */
    const handleDoubleClick = () => {
        if (file.type === 'folder' && onNavigateToFolder) {
            onNavigateToFolder(file.id, file.name);
        } else if (onOpenFile) {
            onOpenFile(file.id);
        }
    };

    /**
     * Renders the appropriate icon based on file type
     * @returns {JSX.Element|null} The icon element or null for images
     */
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
        <motion.div
            className={cn(
                "group relative border rounded-md p-3 hover:border-blue-500 transition-colors",
                isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white",
                className
            )}
            onDoubleClick={handleDoubleClick}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            layoutId={`file-card-${file.id}`}
        >
            {onSelect && (
                <motion.div
                    className="absolute top-2 right-2 transition-opacity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isSelected ? 1 : 0 }}
                    whileHover={{ opacity: 1 }}
                >
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={handleSelect}
                        className="border-2 border-gray-300 bg-white"
                    />
                </motion.div>
            )}

            <motion.div
                className="flex flex-col items-center justify-center p-3"
                onClick={handleClick}
                whileHover="hover"
            >
                {file.type === 'image' && file.thumbnailUrl ? (
                    <motion.div
                        className="w-full h-32 relative overflow-hidden rounded-md"
                        variants={imageVariants}
                    >
                        <Image
                            src={file.thumbnailUrl}
                            alt={file.name}
                            width={100}
                            height={100}
                            className="absolute inset-0 w-full h-full object-cover rounded-md"
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        className="h-32 flex items-center justify-center"
                        variants={iconVariants}
                    >
                        {renderFileIcon()}
                    </motion.div>
                )}
            </motion.div>

            <motion.div
                onClick={handleClick}
                variants={textVariants}
            >
                <motion.h3
                    className="font-medium text-gray-900 truncate mb-1"
                >
                    {file.name}
                </motion.h3>
                <motion.div
                    className="flex justify-between items-center text-xs text-gray-500"
                >
                    <span>{file.type === 'folder' ? 'Folder' : file.type.charAt(0).toUpperCase() + file.type.slice(1)}</span>
                    {file.size && <span>{file.size}</span>}
                </motion.div>
                <motion.p
                    className="text-xs text-gray-500 mt-1"
                >
                    {formattedDate}
                </motion.p>
            </motion.div>

            {file.type === 'folder' && onNavigateToFolder && (
                <motion.div
                    className="mt-2 pt-2 border-t border-gray-100"
                    variants={buttonVariants}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-xs flex items-center justify-center text-blue-600"
                        onClick={() => onNavigateToFolder(file.id, file.name)}
                    >
                        <motion.div
                            initial={{ x: -5, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <FolderOpen className="h-3 w-3 mr-1" />
                        </motion.div>
                        Open in Library
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
}

export default FileCard;