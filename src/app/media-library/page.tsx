'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { FilterBar } from '@/components/media-library/FilterBar';
import { FileGrid } from '@/components/media-library/FileGrid';
import { Pagination } from '@/components/ui/Pagination';
import { AddNewButton } from '@/components/media-library/AddNewButton';
import { v4 as uuidv4 } from 'uuid';
import { FileViewModal } from '@/components/media-library/FileViewModal';
import { FolderViewModal } from '@/components/media-library/FolderViewModal';

// Extended FileItem type to handle parent folders and file paths
export interface FileItem {
    id: string;
    name: string;
    type: string;
    dateModified: Date;
    size?: string;
    thumbnailUrl?: string;
    description?: string;
    parentId?: string | null; // ID of the parent folder
    path?: string; // Full path of the file/folder
}

export default function MediaLibraryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folderHistory, setFolderHistory] = useState<{id: string | null, name: string, href?: string}[]>([
        { id: uuidv4(), name: 'Root', href: '/media-library' }
    ]);
    const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
    const [selectedFolder, setSelectedFolder] = useState<FileItem | null>(null);

    // Pagination settings
    const itemsPerPage = 10;

    // Generate a large sample dataset with 40+ files
    const generateSampleFiles = useCallback(() => {
        const rootFiles: FileItem[] = [
            {
                id: '1',
                name: 'Cakes',
                type: 'folder',
                dateModified: new Date('2023-04-15'),
                parentId: null,
                path: '/Cakes',
                description: 'Collection of cake photos for the bakery website'
            },
            {
                id: '2',
                name: 'Desserts',
                type: 'folder',
                dateModified: new Date('2023-11-03'),
                parentId: null,
                path: '/Desserts',
                description: 'Various dessert images for menu cards'
            },
            {
                id: '3',
                name: 'Music',
                type: 'folder',
                dateModified: new Date('2023-10-20'),
                parentId: null,
                path: '/Music',
                description: 'Background music tracks for the store'
            },
            {
                id: '4',
                name: 'Videos',
                type: 'folder',
                dateModified: new Date('2023-09-05'),
                parentId: null,
                path: '/Videos',
                description: 'Promotional videos and tutorials'
            }
        ];

        // Files for Cakes folder - 12 files
        const cakesFiles: FileItem[] = Array.from({ length: 12 }, (_, i) => ({
            id: uuidv4(),
            name: `cake-photo-${i + 1}.jpg`,
            type: 'image',
            dateModified: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
            thumbnailUrl: `/placeholder-images/cake-${(i % 5) + 1}.jpg`,
            parentId: '1',
            path: `/Cakes/cake-photo-${i + 1}.jpg`
        }));

        // Files for Desserts folder - now 10 files
        const dessertsFiles: FileItem[] = Array.from({ length: 10 }, (_, i) => ({
            id: uuidv4(),
            name: `dessert-photo-${i + 1}.jpg`,
            type: 'image',
            dateModified: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            size: `${(Math.random() * 3 + 0.8).toFixed(1)} MB`,
            thumbnailUrl: `/placeholder-images/dessert-${(i % 5) + 1}.jpg`,
            parentId: '2',
            path: `/Desserts/dessert-photo-${i + 1}.jpg`
        }));

        // Files for Music folder - increase to 12 files
        const musicFiles: FileItem[] = Array.from({ length: 12 }, (_, i) => ({
            id: uuidv4(),
            name: `track-${i + 1}.mp3`,
            type: 'audio',
            dateModified: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            size: `${(Math.random() * 8 + 2).toFixed(1)} MB`,
            parentId: '3',
            path: `/Music/track-${i + 1}.mp3`,
            description: i % 3 === 0 ? `Background track for ${i % 2 === 0 ? 'morning' : 'evening'} ambiance` : undefined
        }));

        // Files for Videos folder - increase to 10 files
        const videoFiles: FileItem[] = Array.from({ length: 10 }, (_, i) => ({
            id: uuidv4(),
            name: `video-${i + 1}.mp4`,
            type: 'video',
            dateModified: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            size: `${(Math.random() * 50 + 20).toFixed(1)} MB`,
            parentId: '4',
            path: `/Videos/video-${i + 1}.mp4`,
            description: i % 3 === 0 ? `Promotional video for ${i % 2 === 0 ? 'social media' : 'website'}` : undefined
        }));

        return [...rootFiles, ...cakesFiles, ...dessertsFiles, ...musicFiles, ...videoFiles];
    }, []);

    const [files, setFiles] = useState<FileItem[]>(generateSampleFiles());

    // Function to create a new folder
    const handleCreateFolder = useCallback((folderName: string, description?: string) => {
        const newFolder: FileItem = {
            id: uuidv4(),
            name: folderName,
            type: 'folder',
            dateModified: new Date(),
            description,
            parentId: currentFolderId,
            path: currentFolderId
                ? `${folderHistory[folderHistory.length - 1].name}/${folderName}`
                : `/${folderName}`
        };

        setFiles(prevFiles => [newFolder, ...prevFiles]);
    }, [currentFolderId, folderHistory]);

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
                    thumbnailUrl,
                    parentId: currentFolderId,
                    path: currentFolderId
                        ? `${folderHistory[folderHistory.length - 1].name}/${file.name}`
                        : `/${file.name}`
                };
            });

            setFiles(prevFiles => [...newFiles, ...prevFiles]);
            setIsLoading(false);
        }, 1500);
    }, [currentFolderId, folderHistory]);

    // Handle selecting and deselecting files
    const handleSelectFile = (id: string, selected: boolean) => {
        if (selected) {
            setSelectedFiles([...selectedFiles, id]);
        } else {
            setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
        }
    };

    // Handle opening a folder from the main grid
    const handleOpenFolder = (folderId: string) => {
        const folder = files.find(file => file.id === folderId);
        if (folder) {
            // Check if we should navigate to folder or open the folder modal
            if (folder.type === 'folder') {
                setSelectedFolder(folder);
            }
        }
    };

    // Handle navigating to a folder (changing the current directory)
    const handleNavigateToFolder = useCallback((folderId: string | null, folderName?: string) => {
        if (folderId === currentFolderId) return;

        // Update URL with the folder ID
        const params = new URLSearchParams(searchParams.toString());

        if (folderId === null) {
            // Navigate to root - remove the folder parameter
            params.delete('folder');
            router.push(`/media-library?${params.toString()}`);

            // Reset folder history
            setFolderHistory([{ id: null, name: 'Root', href: '/media-library' }]);
            setCurrentFolderId(null);
        } else {
            // Navigate to specific folder
            params.set('folder', folderName ?? folderId);
            router.push(`/media-library?${params.toString()}`);

            const folder = files.find(file => file.id === folderId);
            if (folder) {
                setCurrentFolderId(folderId);

                // If we're navigating from the breadcrumb
                if (folderName) {
                    const index = folderHistory.findIndex(item => item.id === folderId);
                    if (index >= 0) {
                        setFolderHistory(folderHistory.slice(0, index + 1));
                    }
                } else {
                    setFolderHistory(prev => [...prev, { id: folderId, name: folder.name }]);
                }
            }
        }

        setCurrentPage(1); // Reset to first page when changing folders
        setSelectedFolder(null); // Close folder modal if open
    }, [currentFolderId, folderHistory, files, router, searchParams]);

    // Handle navigating to a previous folder via breadcrumb
    const handleBreadcrumbNavigation = (index: number) => {
        const newHistory = folderHistory.slice(0, index + 1);
        setFolderHistory(newHistory);
        setCurrentFolderId(newHistory[newHistory.length - 1].id);
        setCurrentPage(1); // Reset to first page
    };

    // Handle opening a file
    const handleOpenFile = (fileId: string) => {
        const file = files.find(file => file.id === fileId);
        if (file && file.type !== 'folder') {
            setSelectedFile(file);
        } else if (file && file.type === 'folder') {
            setSelectedFolder(file);
        }
    };

    // Filter and search files
    const filteredFiles = files.filter(file => {
        // Filter by parent folder
        const inCurrentFolder = file.parentId === currentFolderId;

        // Apply search filter
        const matchesSearch = searchQuery === '' ||
            file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Apply type filter
        let matchesType = true;
        if (filter !== 'all') {
            matchesType = file.type === filter;
        }

        return inCurrentFolder && matchesSearch && matchesType;
    });

    // Paginated files
    const paginatedFiles = filteredFiles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Convert folder history to breadcrumb items
    const breadcrumbItems = folderHistory.map((folder, index) => ({
        label: folder.name,
        href: folder.href,
        onClick: () => handleBreadcrumbNavigation(index)
    }));

    // Reset page when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filter]);

    // Add an effect to initialize the current folder from URL on page load
    useEffect(() => {
        const folderIdFromUrl = searchParams.get('folder');

        if (folderIdFromUrl) {
            // Find the folder in our files array
            const folder = files.find(file => file.id === folderIdFromUrl);

            if (folder && folder.type === 'folder') {
                // Build the folder history by following parent IDs
                const buildFolderPath = (folderId: string): {id: string | null, name: string}[] => {
                    const result: {id: string | null, name: string}[] = [{ id: null, name: 'Root' }];
                    let currentFolder = files.find(f => f.id === folderId);

                    const folderPath: {id: string, name: string}[] = [];
                    while (currentFolder) {
                        folderPath.unshift({ id: currentFolder.id, name: currentFolder.name });

                        if (currentFolder.parentId) {
                            currentFolder = files.find(f => f.id === currentFolder?.parentId);
                        } else {
                            break;
                        }
                    }

                    return [...result, ...folderPath];
                };

                // Set the current folder and history
                setCurrentFolderId(folderIdFromUrl);
                setFolderHistory(buildFolderPath(folderIdFromUrl));
            }
        }
    }, [searchParams, files]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header user={{ name: 'Sarah Knowles', image: '/placeholder-avatar.jpg' }} />

            <div className="flex-1 flex">
                <Sidebar activeItem="applications" />

                <div className="flex-1 p-6 ml-24 mt-16">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Media Library</h1>
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <AddNewButton
                            onUploadFile={handleUploadFiles}
                            onCreateFolder={handleCreateFolder}
                            existingFiles={files.filter(file => file.type !== 'folder')}
                        />
                    </div>

                    <div className="mb-6">
                        <FilterBar
                            onSearch={setSearchQuery}
                            onFilter={setFilter}
                            currentFilter={filter}
                            searchValue={searchQuery}
                        />
                    </div>

                    <div className="mb-6">
                        <FileGrid
                            files={paginatedFiles}
                            selectedFiles={selectedFiles}
                            onSelectFile={handleSelectFile}
                            onOpenFolder={handleOpenFolder}
                            onOpenFile={handleOpenFile}
                            isLoading={isLoading}
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-500 order-2 md:order-1">
                            {filteredFiles.length > 0 ? (
                                <>
                                    Displaying {(currentPage - 1) * itemsPerPage + 1}-
                                    {Math.min(currentPage * itemsPerPage, filteredFiles.length)} of {filteredFiles.length} items
                                </>
                            ) : (
                                'No items to display'
                            )}
                        </div>
                        <div className="order-1 md:order-2 w-full md:w-auto">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.max(1, Math.ceil(filteredFiles.length / itemsPerPage))}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* File View Modal */}
            {selectedFile && (
                <FileViewModal
                    file={selectedFile}
                    onClose={() => setSelectedFile(null)}
                />
            )}

            {/* Folder View Modal */}
            {selectedFolder && (
                <FolderViewModal
                    folder={selectedFolder}
                    files={files}
                    onClose={() => setSelectedFolder(null)}
                    onOpenFile={handleOpenFile}
                    onOpenFolder={handleOpenFolder}
                    onNavigateToFolder={handleNavigateToFolder} // Add this line
                />
            )}
        </div>
    );
}