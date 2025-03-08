// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// File size formatter
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Function to get file type from file extension
export function getFileTypeFromExtension(filename: string): 'image' | 'audio' | 'video' | 'document' | 'other' {
    const extension = filename.split('.').pop()?.toLowerCase() || '';

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac'];
    const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'];

    if (imageExtensions.includes(extension)) return 'image';
    if (audioExtensions.includes(extension)) return 'audio';
    if (videoExtensions.includes(extension)) return 'video';
    if (documentExtensions.includes(extension)) return 'document';

    return 'other';
}

// Function to convert date to string format "dd.MM.yyyy HH:mm"
export function formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
}