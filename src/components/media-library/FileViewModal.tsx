'use client';
import React from 'react';
import Image from 'next/image';
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

    return (
        <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-3">
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
                    </div>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <X className="h-4 w-4" />
                        </Button>
                    </DialogClose>
                </DialogHeader>

                <div className="space-y-6">
                    {/* File preview section */}
                    <div className="bg-gray-100 p-8 rounded-lg flex items-center justify-center">
                        {file.type === 'image' && file.thumbnailUrl ? (
                            <div className="flex flex-col items-center">
                                <Image
                                    width={100}
                                    height={100}
                                    src={file.thumbnailUrl}
                                    alt={file.name}
                                    className="max-h-96 object-contain rounded-md shadow-md"
                                />
                            </div>
                        ) : file.type === 'audio' ? (
                            <div className="w-full max-w-md">
                                <div className="flex justify-center mb-6 p-8 bg-blue-50 rounded-full mx-auto w-32 h-32 items-center">
                                    {getFileIcon()}
                                </div>
                                <div className="text-center mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {fileExtension}
                                    </span>
                                </div>
                                <audio controls className="w-full rounded-md shadow-sm">
                                    <source src={`/api/placeholder/audio`} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        ) : file.type === 'video' ? (
                            <div className="w-full">
                                <video controls className="max-h-96 w-full rounded-md shadow-md">
                                    <source src={`/api/placeholder/video`} type="video/mp4" />
                                    Your browser does not support the video element.
                                </video>
                                <div className="text-center mt-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        {fileExtension}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="p-8 bg-gray-200 rounded-full mb-4">
                                    {getFileIcon()}
                                </div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800 mb-2">
                                    {fileExtension}
                                </span>
                                <span className="text-gray-500">Preview not available</span>
                            </div>
                        )}
                    </div>

                    {/* File information section */}
                    <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-lg border">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                            <p className="text-base">{file.name}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                            <p className="text-base capitalize">{file.type}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                            <p className="text-base">{file.size || 'Unknown'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Last Modified</h3>
                            <p className="text-base">{formattedDate}</p>
                        </div>
                        <div className="col-span-2">
                            <h3 className="text-sm font-medium text-gray-500">File Path</h3>
                            <p className="text-base font-mono text-sm text-gray-700">{file.path || '/'}</p>
                        </div>
                        {file.description && (
                            <div className="col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="text-base">{file.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            Download
                        </Button>
                        <Button variant="outline" className="text-red-600 hover:bg-red-50 flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                        <Button className="flex items-center gap-2">
                            <Share className="h-4 w-4" />
                            Share
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}