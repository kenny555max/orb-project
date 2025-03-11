'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { FileItem } from '@/app/media-library/page';
import { FileMusic, FileVideo, File, X, Download, Share, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface FileViewModalProps {
    file: FileItem;
    onClose: () => void;
}

export function FileViewModal({ file, onClose }: FileViewModalProps) {
    // Choose the appropriate icon based on file type
    const getFileIcon = () => {
        switch (file.type) {
            case 'audio':
                return <FileMusic className="h-16 w-16 text-blue-600" />;
            case 'video':
                return <FileVideo className="h-16 w-16 text-purple-600" />;
            case 'image':
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                            className="lucide lucide-image">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>;
            default:
                return <File className="h-16 w-16 text-gray-600"/>;
        }
    };

    // Format the date for display
    const formattedDate = formatDistanceToNow(new Date(file.dateModified), {addSuffix: true});

    // Get file extension
    const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';

    // Animation variants for different components
    //const overlayVariants = {
    //    hidden: { opacity: 0 },
    //    visible: { opacity: 1, transition: { duration: 0.2 } }
    //};

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.98,
            transition: {
                duration: 0.15
            }
        }
    };

    const previewVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1,
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const infoVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.2,
                duration: 0.4,
                ease: "easeOut"
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3 + (custom * 0.1),
                duration: 0.3,
                ease: "easeOut"
            }
        }),
        hover: {
            scale: 1.05,
            transition: {
                duration: 0.2,
                ease: "easeInOut"
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const fileIconAnimation = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.15
            }
        }
    };

    return (
        <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
            {!!file && (
                <DialogContent>
                    <motion.div
                        className="sm:max-w-3xl max-h-[90vh] overflow-auto"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={modalVariants}
                    >
                        <DialogHeader className="flex flex-row items-center justify-between">
                            <motion.div
                                className="flex items-center space-x-3"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: 1,
                                    x: 0,
                                    transition: { delay: 0.1, duration: 0.3 }
                                }}
                            >
                                {file.type === 'image' ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round" className="lucide lucide-image">
                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                        <circle cx="9" cy="9" r="2"/>
                                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                                    </svg> :
                                    file.type === 'audio' ?
                                        <FileMusic className="h-5 w-5 text-blue-600"/> :
                                        file.type === 'video' ?
                                            <FileVideo className="h-5 w-5 text-purple-600"/> :
                                            <File className="h-5 w-5 text-gray-600" />
                                }
                                <DialogTitle className="text-xl truncate max-w-md">{file.name}</DialogTitle>
                            </motion.div>
                            <DialogClose asChild>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{
                                        opacity: 1,
                                        transition: { delay: 0.2, duration: 0.3 }
                                    }}
                                >
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                        <X className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            </DialogClose>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* File preview section */}
                            <motion.div
                                className="bg-gray-100 p-8 rounded-lg flex items-center justify-center"
                                variants={previewVariants}
                            >
                                {file.type === 'image' && file.thumbnailUrl ? (
                                    <div className="flex flex-col items-center">
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{
                                                scale: 1,
                                                opacity: 1,
                                                transition: {
                                                    delay: 0.2,
                                                    duration: 0.5,
                                                    ease: "easeOut"
                                                }
                                            }}
                                            whileHover={{
                                                scale: 1.02,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            <Image
                                                width={100}
                                                height={100}
                                                src={file.thumbnailUrl}
                                                alt={file.name}
                                                className="max-h-96 object-contain rounded-md shadow-md"
                                            />
                                        </motion.div>
                                    </div>
                                ) : file.type === 'audio' ? (
                                    <div className="w-full max-w-md">
                                        <motion.div
                                            className="flex justify-center mb-6 p-8 bg-blue-50 rounded-full mx-auto w-32 h-32 items-center"
                                            variants={fileIconAnimation}
                                        >
                                            {getFileIcon()}
                                        </motion.div>
                                        <motion.div
                                            className="text-center mb-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.3, duration: 0.3 }
                                            }}
                                        >
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {fileExtension}
                                            </span>
                                        </motion.div>
                                        <motion.div
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.4, duration: 0.4 }
                                            }}
                                        >
                                            <audio controls className="w-full rounded-md shadow-sm">
                                                <source src={`/api/placeholder/audio`} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        </motion.div>
                                    </div>
                                ) : file.type === 'video' ? (
                                    <div className="w-full">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{
                                                opacity: 1,
                                                scale: 1,
                                                transition: { delay: 0.2, duration: 0.5 }
                                            }}
                                        >
                                            <video controls className="max-h-96 w-full rounded-md shadow-md">
                                                <source src={`/api/placeholder/video`} type="video/mp4" />
                                                Your browser does not support the video element.
                                            </video>
                                        </motion.div>
                                        <motion.div
                                            className="text-center mt-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.3, duration: 0.3 }
                                            }}
                                        >
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {fileExtension}
                                            </span>
                                        </motion.div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <motion.div
                                            className="p-8 bg-gray-200 rounded-full mb-4"
                                            variants={fileIconAnimation}
                                        >
                                            {getFileIcon()}
                                        </motion.div>
                                        <motion.span
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 mb-2"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                transition: { delay: 0.3, duration: 0.3 }
                                            }}
                                        >
                                            {fileExtension}
                                        </motion.span>
                                        <motion.span
                                            className="text-gray-500"
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                opacity: 1,
                                                transition: { delay: 0.4, duration: 0.3 }
                                            }}
                                        >
                                            Preview not available
                                        </motion.span>
                                    </div>
                                )}
                            </motion.div>

                            {/* File information section */}
                            <motion.div
                                className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg border"
                                variants={infoVariants}
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.25, duration: 0.3 }
                                    }}
                                >
                                    <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                                    <p className="text-base">{file.name}</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.3, duration: 0.3 }
                                    }}
                                >
                                    <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                                    <p className="text-base capitalize">{file.type}</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.35, duration: 0.3 }
                                    }}
                                >
                                    <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                                    <p className="text-base">{file.size || 'Unknown'}</p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.4, duration: 0.3 }
                                    }}
                                >
                                    <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
                                    <p className="text-base">{formattedDate}</p>
                                </motion.div>
                                <motion.div
                                    className="col-span-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: { delay: 0.45, duration: 0.3 }
                                    }}
                                >
                                    <h3 className="text-sm font-medium text-gray-500">File Path</h3>
                                    <p className="text-base font-mono text-sm text-gray-700">{file.path || '/'}</p>
                                </motion.div>
                                {file.description && (
                                    <motion.div
                                        className="col-span-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            transition: { delay: 0.5, duration: 0.3 }
                                        }}
                                    >
                                        <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                        <p className="text-base">{file.description}</p>
                                    </motion.div>
                                )}
                            </motion.div>

                            {/* Actions */}
                            <motion.div
                                className="flex justify-end space-x-3"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    hidden: {},
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                <motion.div
                                    variants={buttonVariants}
                                    custom={0}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <Download className="h-4 w-4" />
                                        Download
                                    </Button>
                                </motion.div>
                                <motion.div
                                    variants={buttonVariants}
                                    custom={1}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button variant="outline" className="text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </Button>
                                </motion.div>
                                <motion.div
                                    variants={buttonVariants}
                                    custom={2}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button className="flex items-center gap-2">
                                        <Share className="h-4 w-4" />
                                        Share
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                </DialogContent>
            )}
        </Dialog>
    );
}