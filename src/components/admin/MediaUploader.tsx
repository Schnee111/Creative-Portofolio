'use client';

import { useState, useRef, useCallback } from 'react';

interface MediaUploaderProps {
    projectFolder: string;
    onUploadComplete: (path: string, url: string) => void;
    accept?: string;
    label?: string;
}

export default function MediaUploader({
    projectFolder,
    onUploadComplete,
    accept = 'image/*,video/*',
    label = 'Upload Media',
}: MediaUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // Show preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => setPreview(e.target?.result as string);
                reader.readAsDataURL(file);
            }

            setUploading(true);
            setProgress(0);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('projectFolder', projectFolder);

            try {
                // Simulated progress
                const progressInterval = setInterval(() => {
                    setProgress((p) => Math.min(p + 10, 90));
                }, 200);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                clearInterval(progressInterval);

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Upload failed');
                }

                const data = await response.json();
                setProgress(100);
                onUploadComplete(data.path, data.url);

                // Reset after short delay
                setTimeout(() => {
                    setProgress(0);
                    setPreview(null);
                    if (inputRef.current) inputRef.current.value = '';
                }, 1000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload failed');
            } finally {
                setUploading(false);
            }
        },
        [projectFolder, onUploadComplete]
    );

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-white/70">{label}</label>

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${uploading
                        ? 'border-blue-500/50 bg-blue-500/10'
                        : 'border-white/20 hover:border-white/40 bg-white/5'
                    }`}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />

                {preview ? (
                    <img src={preview} alt="Preview" className="max-h-32 mx-auto rounded" />
                ) : (
                    <div className="space-y-2">
                        <svg
                            className="mx-auto h-10 w-10 text-white/40"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <p className="text-sm text-white/50">
                            Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-white/30">PNG, JPG, WebP, MP4, WebM</p>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <div className="w-3/4">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-white/70 mt-2">{progress}%</p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-sm text-red-400 bg-red-500/10 px-3 py-2 rounded">
                    {error}
                </p>
            )}
        </div>
    );
}
