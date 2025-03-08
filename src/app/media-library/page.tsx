'use client';
import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FilterBar } from '@/components/media-library/FilterBar';
import { FileGrid } from '@/components/media-library/FileGrid';
import { Pagination } from '@/components/ui/Pagination';
import { AddNewButton } from '@/components/media-library/AddNewButton';
import { FileItem } from '@/components/media-library/FileCard';
import { v4 as uuidv4 } from 'uuid'; // You might need to install this package

export default function MediaLibraryPage() {
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    // Sample data - in a real app, this would come from an API
    const [files, setFiles] = useState<FileItem[]>([
        {
            id: '1',
            name: 'Cakes',
            type: 'folder',
            dateModified: new Date('2023-04-15'),
        },
        {
            id: '2',
            name: 'Desserts',
            type: 'folder',
            dateModified: new Date('2023-11-03'),
        },
        {
            id: '3',
            name: 'commercial-back.mp3',
            type: 'audio',
            dateModified: new Date('2023-02-10'),
            size: '5.2 MB',
        },
        {
            id: '4',
            name: 'ambulance.mp3',
            type: 'audio',
            dateModified: new Date('2022-12-15'),
            size: '2.1 MB',
        },
        {
            id: '5',
            name: 'big-buck-bunny.mp4',
            type: 'video',
            dateModified: new Date('2022-06-04'),
            size: '45.8 MB',
        },
        {
            id: '6',
            name: 'tedlava-thumb.jpg',
            type: 'image',
            dateModified: new Date('2020-03-04'),
            size: '0.8 MB',
            thumbnailUrl: '/placeholder-images/tedlava-thumb.jpg',
        },
        {
            id: '7',
            name: 'chocolate-thumb.jpg',
            type: 'image',
            dateModified: new Date('2018-05-28'),
            size: '1.6 MB',
            thumbnailUrl: '/placeholder-images/chocolate-thumb.jpg',
        },
        {
            id: '8',
            name: 'chocolate-cake-thumb.jpg',
            type: 'image',
            dateModified: new Date('2018-08-30'),
            size: '1.6 MB',
            thumbnailUrl: '/placeholder-images/chocolate-cake-thumb.jpg',
        },
        {
            id: '9',
            name: 'coconut-cake.jpg',
            type: 'image',
            dateModified: new Date('2018-08-28'),
            size: '1.5 MB',
            thumbnailUrl: '/placeholder-images/coconut-cake.jpg',
        },
        {
            id: '10',
            name: 'cremeschnitte-thumb.png',
            type: 'image',
            dateModified: new Date('2018-05-20'),
            size: '1.8 MB',
            thumbnailUrl: '/placeholder-images/cremeschnitte-thumb.png',
        },
        {
            id: '11',
            name: 'fat-rascal-thumb.jpg',
            type: 'image',
            dateModified: new Date('2019-08-30'),
            size: '1.9 MB',
            thumbnailUrl: '/placeholder-images/fat-rascal-thumb.jpg',
        },
        {
            id: '12',
            name: 'financier-thumb.png',
            type: 'image',
            dateModified: new Date('2018-08-25'),
            size: '2.1 MB',
            thumbnailUrl: '/placeholder-images/financier-thumb.png',
        },
    ]);

    // Function to create a new folder
    const handleCreateFolder = useCallback((folderName: string, description?: string) => {
        const newFolder: FileItem = {
            id: uuidv4(), // Generate unique ID
            name: folderName,
            type: 'folder',
            dateModified: new Date(),
            description // Store the optional description
        };

        setFiles(prevFiles => [newFolder, ...prevFiles]);
    }, []);

    // Function to upload files
    const handleUploadFiles = useCallback((uploadedFiles: File[]) => {
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const newFiles: FileItem[] = uploadedFiles.map(file => {
                // Create a FileItem from the File object
                let fileType = 'document';
                if (file.type.startsWith('image/')) fileType = 'image';
                else if (file.type.startsWith('audio/')) fileType = 'audio';
                else if (file.type.startsWith('video/')) fileType = 'video';

                let thumbnailUrl;
                // For images, we could create a thumbnail URL, but in this example we'll use a placeholder
                if (fileType === 'image') {
                    thumbnailUrl = '/placeholder-images/new-image-thumb.jpg';
                }

                return {
                    id: uuidv4(),
                    name: file.name,
                    type: fileType,
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    dateModified: new Date(),
                    thumbnailUrl
                };
            });

            setFiles(prevFiles => [...newFiles, ...prevFiles]);
            setIsLoading(false);
        }, 1500);
    }, []);

    // Handle selecting and deselecting files
    const handleSelectFile = (id: string, selected: boolean) => {
        if (selected) {
            setSelectedFiles([...selectedFiles, id]);
        } else {
            setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
        }
    };

    // Filter and search files
    const filteredFiles = files.filter(file => {
        // Apply search filter
        const matchesSearch = searchQuery === '' || file.name.toLowerCase().includes(searchQuery.toLowerCase());

        // Apply type filter
        let matchesType = true;
        if (filter !== 'all') {
            matchesType = file.type === filter;
        }

        return matchesSearch && matchesType;
    });

    // Format existing files for the FileUploadModal
    const existingFilesForModal = files
        .filter(file => file.type !== 'folder')
        .map(file => ({
            id: file.id,
            name: file.name,
            type: file.type,
            thumbnailUrl: file.thumbnailUrl,
            size: file.size || '0 KB'
        }));

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Library', href: '/media-library' },
        { label: 'Data', href: '/media-library/data' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header user={{ name: 'Sarah Knowles', image: '/placeholder-avatar.jpg' }} />

            <div className="flex-1 flex flex-co">
                <Sidebar activeItem="applications" />

                <div className="flex-1 p-6 ml-24 mt-16">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Library</h1>
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <AddNewButton
                            onUploadFile={handleUploadFiles}
                            onCreateFolder={handleCreateFolder}
                            existingFiles={existingFilesForModal}
                        />
                    </div>

                    <div className="mb-6">
                        <FilterBar
                            onSearch={setSearchQuery}
                            onFilter={setFilter}
                        />
                    </div>

                    <div className="mb-6">
                        <FileGrid
                            files={filteredFiles}
                            selectedFiles={selectedFiles}
                            onSelectFile={handleSelectFile}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Displaying {filteredFiles.length > 0 ? 1 : 0}-{Math.min(12, filteredFiles.length)} of {filteredFiles.length} items
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(filteredFiles.length / 12)}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}