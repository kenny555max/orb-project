import React from 'react';
import { cn } from '@/lib/utils';
import { Upload } from 'lucide-react';
import { FileItem } from '@/app/media-library/page';
import { FileCard } from './FileCard';
import { AnimatePresence, motion } from 'framer-motion';

type FileGridProps = {
    files?: FileItem[];
    selectedFiles?: string[];
    onSelectFile?: (id: string, selected: boolean) => void;
    onOpenFolder?: (folderId: string) => void;
    onOpenFile?: (fileId: string) => void;
    onNavigateToFolder?: (folderId: string | null, folderName?: string) => void;
    isLoading?: boolean;
    className?: string;
};

export function FileGrid({
                             files,
                             selectedFiles = [],
                             onSelectFile,
                             onOpenFolder,
                             onOpenFile,
                             onNavigateToFolder,
                             isLoading = false,
                             className
                         }: FileGridProps) {
    // Handle empty state
    if (files?.length === 0 && !isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg p-12 text-center"
            >
                <motion.div
                    className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20
                    }}
                >
                    <Upload className="h-8 w-8 text-gray-400" />
                </motion.div>
                <motion.h3
                    className="text-lg font-medium text-gray-900 mb-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Drag files to upload
                </motion.h3>
                <motion.p
                    className="text-sm text-gray-500 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    or click the Add New button
                </motion.p>
            </motion.div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, index) => (
                    <motion.div
                        key={index}
                        className="border rounded-md p-3 h-48 animate-pulse"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.3,
                            delay: index * 0.05
                        }}
                    >
                        <div className="bg-gray-200 h-32 rounded mb-2"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                        <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                    </motion.div>
                ))}
            </div>
        );
    }

    // Item animations for the grid
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <motion.div
            className={cn(
                "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4",
                className
            )}
            variants={container}
            initial="hidden"
            animate="show"
        >
            <AnimatePresence>
                {files?.map((file) => (
                    <FileCard
                        key={file.id}
                        file={file}
                        isSelected={selectedFiles.includes(file.id)}
                        onSelect={onSelectFile}
                        onOpenFolder={onOpenFolder}
                        onOpenFile={onOpenFile}
                        onNavigateToFolder={onNavigateToFolder}
                        //index={index}
                    />
                ))}
            </AnimatePresence>
        </motion.div>
    );
}