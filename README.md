# Media Library

A modern, responsive media library application built with Next.js and React, designed to manage and organize various media assets including images, audio, videos, and documents.

## Overview

The Media Library provides a user-friendly interface for browsing, organizing, and managing media files. It features a hierarchical folder structure, detailed file previews, and comprehensive filtering capabilities.

## Features

- **Intuitive File Management**: Browse, organize, and manage media files with an intuitive UI
- **Hierarchical Folder Structure**: Organize files in nested folders with breadcrumb navigation
- **Direct URL Access**: Access specific folders directly via URL parameters
- **Rich Media Preview**: View detailed information and previews of media files
- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Advanced Filtering**: Filter files by type, search by name or description
- **Pagination**: Navigate through large collections of files with ease
- **File Selection**: Select multiple files for batch operations
- **Folder Navigation**: Two ways to navigate - preview mode or direct navigation to folder contents

## Technical Architecture

The application is built with Next.js and React, utilizing a component-based architecture for maintainability and reusability.

### Key Components

- **MediaLibraryPage**: Main container component managing state and file operations
- **FileGrid**: Displays files and folders in a responsive grid layout
- **FileCard**: Card component for individual files and folders
- **FilterBar**: Handles search and filtering operations
- **Breadcrumb**: Shows current location in folder hierarchy
- **FileViewModal**: Modal for detailed file preview
- **FolderViewModal**: Modal for folder preview with quick access to contents
- **AddNewButton**: Interface for adding new files and folders

### File Structure

```
/components
  /ui
    - Sidebar.tsx
    - Header.tsx
    - Breadcrumb.tsx
    - Pagination.tsx
  /media-library
    - FileGrid.tsx
    - FileCard.tsx
    - FilterBar.tsx
    - AddNewButton.tsx
    - FileViewModal.tsx
    - FolderViewModal.tsx
/app
  /media-library
    - page.tsx
```

## Data Model

### FileItem Interface

```typescript
interface FileItem {
    id: string;
    name: string;
    type: string;
    dateModified: Date;
    size?: string;
    thumbnailUrl?: string;
    description?: string;
    parentId?: string | null;
    path?: string;
}
```

## Navigation System

The library uses a dual-navigation approach:

1. **Preview Mode**: Click on a folder to preview its contents in a modal
2. **Direct Navigation**: Double-click or use "Open in Library" to navigate into the folder, updating the current view and URL

### URL-based Navigation

The application supports direct folder access via URL parameters:
- `/media-library?folder=123` will navigate directly to the folder with ID 123
- `/media-library` (no parameters) will show the root folder

## Usage Examples

### Navigating Folders

Users can navigate folders in multiple ways:
- Click on a folder to preview its contents
- Double-click a folder to navigate into it
- Click the "Open in Library" button that appears when hovering over a folder
- Use the breadcrumb navigation to move up the folder hierarchy

### Filtering and Searching

- Use the search bar to find files by name or description
- Filter files by type (images, audio, video, documents)
- Results update instantly and maintain the current folder context

### File Operations

- View detailed file information by clicking on a file
- Select multiple files using checkboxes for batch operations
- Add new files using the upload functionality
- Create new folders to organize content

## Future Enhancements

Potential enhancements for future releases:

- Drag and drop functionality for organizing files
- File sharing capabilities with permission settings
- Version history for files
- Enhanced search with metadata filtering
- Batch editing of file metadata
- Integration with cloud storage services

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the application at `http://localhost:3000/media-library`

## Dependencies

- Next.js
- React
- Tailwind CSS
- date-fns (for date formatting)
- uuid (for generating unique IDs)
- Lucide React (for icons)
- framer-motion (for animations)
