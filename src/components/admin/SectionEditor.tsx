'use client';

import { useState } from 'react';
import { ProjectSection, SectionType } from '@/config/projects';
import MediaUploader from './MediaUploader';

interface SectionEditorProps {
    section: ProjectSection;
    projectFolder: string;
    onChange: (section: ProjectSection) => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

const SECTION_TYPES: Array<{ value: SectionType; label: string; icon: string }> = [
    { value: 'intro', label: 'Intro', icon: '🎬' },
    { value: 'image-full', label: 'Image (Full)', icon: '🖼️' },
    { value: 'image-wide', label: 'Image (Wide)', icon: '📐' },
    { value: 'image-tall', label: 'Image (Tall)', icon: '📱' },
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'text-quote', label: 'Quote', icon: '💬' },
    { value: 'video', label: 'Video', icon: '🎥' },
    { value: 'separator', label: 'Separator', icon: '➖' },
    { value: 'bridge', label: 'Bridge', icon: '🌉' },
];

export default function SectionEditor({
    section,
    projectFolder,
    onChange,
    onDelete,
    onMoveUp,
    onMoveDown,
    isFirst,
    isLast,
}: SectionEditorProps) {
    const [expanded, setExpanded] = useState(false);

    const sectionInfo = SECTION_TYPES.find((t) => t.value === section.type);

    const handleTypeChange = (newType: SectionType) => {
        const baseSection = { type: newType, id: section.id };

        // Add default properties based on type
        switch (newType) {
            case 'image-full':
            case 'image-wide':
            case 'image-tall':
                onChange({ ...baseSection, type: newType, src: '' } as ProjectSection);
                break;
            case 'text':
            case 'text-quote':
                onChange({ ...baseSection, type: newType, content: '' } as ProjectSection);
                break;
            case 'video':
                onChange({ ...baseSection, type: newType, src: '' } as ProjectSection);
                break;
            case 'separator':
                onChange({ ...baseSection, type: newType, label: '' } as ProjectSection);
                break;
            default:
                onChange(baseSection as ProjectSection);
        }
    };

    const handleFieldChange = (field: string, value: string) => {
        onChange({ ...section, [field]: value } as ProjectSection);
    };

    const handleMediaUpload = (path: string) => {
        if ('src' in section) {
            onChange({ ...section, src: path } as ProjectSection);
        }
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            {/* Header */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-3">
                    <span className="text-lg">{sectionInfo?.icon || '📦'}</span>
                    <div>
                        <span className="text-sm font-medium text-white">
                            {sectionInfo?.label || section.type}
                        </span>
                        <span className="text-xs text-white/40 ml-2">#{section.id}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Move buttons */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                        disabled={isFirst}
                        className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ↑
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMoveDown(); }}
                        disabled={isLast}
                        className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        ↓
                    </button>

                    {/* Delete */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                        className="p-1.5 text-red-400/60 hover:text-red-400 transition-colors"
                    >
                        ✕
                    </button>

                    {/* Expand indicator */}
                    <span className={`text-white/40 transition-transform ${expanded ? 'rotate-180' : ''}`}>
                        ▼
                    </span>
                </div>
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="px-4 py-4 border-t border-white/10 space-y-4">
                    {/* Section Type */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Section Type
                        </label>
                        <select
                            value={section.type}
                            onChange={(e) => handleTypeChange(e.target.value as SectionType)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        >
                            {SECTION_TYPES.map((t) => (
                                <option key={t.value} value={t.value} className="bg-neutral-900">
                                    {t.icon} {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Section ID */}
                    <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">
                            Section ID
                        </label>
                        <input
                            type="text"
                            value={section.id}
                            onChange={(e) => handleFieldChange('id', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Type-specific fields */}
                    {(section.type === 'image-full' || section.type === 'image-wide' || section.type === 'image-tall') && (
                        <>
                            <MediaUploader
                                projectFolder={projectFolder}
                                onUploadComplete={handleMediaUpload}
                                accept="image/*"
                                label="Image"
                            />
                            {'src' in section && section.src && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/70">Current Image Path</label>
                                    <input
                                        type="text"
                                        value={section.src}
                                        onChange={(e) => handleFieldChange('src', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                                    />
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_AZURE_STORAGE_URL}${section.src}`}
                                        alt="Preview"
                                        className="max-h-40 rounded-lg"
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Alt Text</label>
                                <input
                                    type="text"
                                    value={'alt' in section ? section.alt || '' : ''}
                                    onChange={(e) => handleFieldChange('alt', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Describe the image..."
                                />
                            </div>
                        </>
                    )}

                    {section.type === 'video' && (
                        <>
                            <MediaUploader
                                projectFolder={projectFolder}
                                onUploadComplete={handleMediaUpload}
                                accept="video/*"
                                label="Video"
                            />
                            {'src' in section && section.src && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white/70">Video Path</label>
                                    <input
                                        type="text"
                                        value={section.src}
                                        onChange={(e) => handleFieldChange('src', e.target.value)}
                                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {(section.type === 'text' || section.type === 'text-quote') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Title (optional)</label>
                                <input
                                    type="text"
                                    value={'title' in section ? section.title || '' : ''}
                                    onChange={(e) => handleFieldChange('title', e.target.value)}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">Content</label>
                                <textarea
                                    value={'content' in section ? section.content || '' : ''}
                                    onChange={(e) => handleFieldChange('content', e.target.value)}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>
                        </>
                    )}

                    {section.type === 'separator' && (
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Label</label>
                            <input
                                type="text"
                                value={'label' in section ? section.label || '' : ''}
                                onChange={(e) => handleFieldChange('label', e.target.value)}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                                placeholder="e.g., THE CHALLENGE"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
