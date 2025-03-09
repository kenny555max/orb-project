// components/media-library/FileUploadModal.tsx
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, File, Music, Video, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

type FileUploadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onUploadFiles: (files: File[]) => void;
    existingFiles?: {
        id: string;
        name: string;
        type: string;
        thumbnailUrl?: string;
        size: string;
    }[];
};

type FileWithPreview = {
    file: File;
    id: string;
    preview: string | null;
    progress: number;
    error?: string;
};

export function FileUploadModal({
    isOpen,
    onClose,
    onUploadFiles,
    existingFiles = [],
}: FileUploadModalProps) {
    const [selectedTab, setSelectedTab] = useState('upload');
    const [dragActive, setDragActive] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<FileWithPreview[]>([]);
    const [selectedExistingFiles, setSelectedExistingFiles] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // File type icon mapping
    const getFileIcon = (type: string) => {
        switch (type) {
            case 'image':
                return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            className="lucide lucide-image">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                </svg>;
            case 'audio':
                return <Music className="h-5 w-5 text-green-500"/>;
            case 'video':
                return <Video className="h-5 w-5 text-purple-500"/>;
            default:
                return <FileText className="h-5 w-5 text-gray-500"/>;
        }
    };

    // Handle drag events
    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    // Handle drop event
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    };

    // Process selected files
    const handleFiles = (fileList: FileList) => {
        const newFiles = Array.from(fileList).map(file => {
            // Create preview URL for images
            let preview: string | null = null;
            if (file.type.startsWith('image/')) {
                preview = URL.createObjectURL(file);
            }

            return {
                file,
                id: `upload-${Date.now()}-${file.name}`,
                preview,
                progress: 0,
            };
        });

        setFilesToUpload(prev => [...prev, ...newFiles]);
    };

    // Remove file from upload queue
    const removeFile = (id: string) => {
        setFilesToUpload(prev => {
            const updatedFiles = prev.filter(file => file.id !== id);

            // Revoke object URLs to prevent memory leaks
            const fileToRemove = prev.find(file => file.id === id);
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
            }

            return updatedFiles;
        });
    };

    // Toggle selection of existing file
    const toggleExistingFileSelection = (id: string) => {
        setSelectedExistingFiles(prev => {
            if (prev.includes(id)) {
                return prev.filter(fileId => fileId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    // Simulate file upload process
    const uploadFiles = () => {
        // Start progress animation for each file
        const fileUpdates = setInterval(() => {
            setFilesToUpload(prev => {
                const allComplete = prev.every(file => file.progress >= 100);

                if (allComplete) {
                    clearInterval(fileUpdates);
                    // Prepare files for the callback
                    const files = prev.map(item => item.file);
                    onUploadFiles(files);
                    return prev;
                }

                return prev.map(file => {
                    if (file.progress < 100) {
                        return {
                            ...file,
                            progress: Math.min(file.progress + 10, 100),
                        };
                    }
                    return file;
                });
            });
        }, 200);
    };

    // Handle form submission
    const handleSubmit = () => {
        if (selectedTab === 'upload' && filesToUpload.length > 0) {
            uploadFiles();
        } else if (selectedTab === 'existing' && selectedExistingFiles.length > 0) {
            // Here you would handle using existing files
            console.log('Selected existing files:', selectedExistingFiles);
        }

        // Wait a bit before closing to show upload completion
        setTimeout(() => {
            onClose();
            // Reset state
            setFilesToUpload([]);
            setSelectedExistingFiles([]);
        }, 1500);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Upload Media Files</DialogTitle>
                    <DialogDescription>
                        Add new files to your media library or select from existing ones.
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    defaultValue="upload"
                    value={selectedTab}
                    onValueChange={setSelectedTab}
                    className="flex-1 min-h-[300px] flex flex-col"
                >
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="upload">Upload New Files</TabsTrigger>
                        <TabsTrigger value="existing">Select Existing Files</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="flex-1 flex flex-col data-[state=active]:flex-1">
                        {filesToUpload.length === 0 ? (
                            <div
                                className={cn(
                                    "border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-10 h-64 transition-colors",
                                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                                )}
                                onDragEnter={handleDrag}
                                onDragOver={handleDrag}
                                onDragLeave={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    {dragActive ? "Drop files here" : "Drag and drop files here"}
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        fileInputRef.current?.click();
                                    }}
                                >
                                    Browse Files
                                </Button>
                            </div>
                        ) : (
                            <ScrollArea className="flex-1">
                                <div className="space-y-4">
                                    {filesToUpload.map((fileItem) => (
                                        <div
                                            key={fileItem.id}
                                            className="border rounded-lg p-4 flex items-start gap-4"
                                        >
                                            <div className="h-14 w-14 shrink-0">
                                                {fileItem.preview ? (
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        src={fileItem.preview}
                                                        alt={fileItem.file.name}
                                                        className="h-full w-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-100 rounded flex items-center justify-center">
                                                        <File className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-medium text-sm truncate">{fileItem.file.name}</h4>
                                                        <p className="text-xs text-gray-500">
                                                            {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => removeFile(fileItem.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                </div>

                                                <div className="mt-2">
                                                    <Progress value={fileItem.progress} className="h-2" />
                                                    <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {fileItem.progress}%
                            </span>
                                                        {fileItem.progress === 100 && (
                                                            <span className="text-xs text-green-500 flex items-center">
                                <Check className="h-3 w-3 mr-1" /> Complete
                              </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </TabsContent>

                    <TabsContent value="existing" className="flex-1 data-[state=active]:flex-1">
                        <ScrollArea className="h-[300px]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {existingFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className={cn(
                                            "border rounded-lg p-3 cursor-pointer transition-colors",
                                            selectedExistingFiles.includes(file.id)
                                                ? "border-blue-500 bg-blue-50"
                                                : "hover:bg-gray-50"
                                        )}
                                        onClick={() => toggleExistingFileSelection(file.id)}
                                    >
                                        <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center relative">
                                            {file.thumbnailUrl ? (
                                                <Image
                                                    src={file.thumbnailUrl}
                                                    alt={file.name}
                                                    width={100}
                                                    height={100}
                                                    className="h-full w-full object-cover rounded-md"
                                                />
                                            ) : (
                                                getFileIcon(file.type)
                                            )}

                                            {selectedExistingFiles.includes(file.id) && (
                                                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                                                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                        <Check className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-medium text-sm truncate">{file.name}</h4>
                                        <p className="text-xs text-gray-500">{file.size}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={handleSubmit}
                        disabled={(selectedTab === 'upload' && filesToUpload.length === 0) ||
                            (selectedTab === 'existing' && selectedExistingFiles.length === 0)}
                    >
                        {selectedTab === 'upload' ? 'Upload Files' : 'Select Files'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default FileUploadModal;