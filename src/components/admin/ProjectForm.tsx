'use client';

import { useState, useEffect } from 'react';
import { Project, SectionType } from '@/config/projects';

interface ProjectFormProps {
    project?: Project | null;
    onSave: (data: Partial<Project>) => Promise<void>;
    onCancel: () => void;
}

const OVERLAY_OPTIONS: Array<{ value: string; label: string }> = [
    { value: '', label: 'None' },
    { value: 'leaf', label: 'Leaf (Nature)' },
    { value: 'tech', label: 'Tech (Digital)' },
];

export default function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        tech: '',
        desc: '',
        bgcolor: '#0f172a',
        overlay: '' as string,
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                subtitle: project.subtitle,
                tech: project.tech,
                desc: project.desc,
                bgcolor: project.bgcolor || '#0f172a',
                overlay: project.overlay || '',
            });
        }
    }, [project]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave({
                ...formData,
                overlay: formData.overlay as 'leaf' | 'tech' | undefined || undefined,
            });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Project Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g., Road Damage Detection"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Subtitle / Category *
                    </label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g., COMPUTER VISION"
                    />
                </div>

                {/* Tech Stack */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Tech Stack *
                    </label>
                    <input
                        type="text"
                        name="tech"
                        value={formData.tech}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="e.g., YOLOv8 / Python / FastAPI"
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Description *
                    </label>
                    <textarea
                        name="desc"
                        value={formData.desc}
                        onChange={handleChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Brief description of the project..."
                    />
                </div>

                {/* Background Color */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Background Color
                    </label>
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            name="bgcolor"
                            value={formData.bgcolor}
                            onChange={handleChange}
                            className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        />
                        <input
                            type="text"
                            value={formData.bgcolor}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, bgcolor: e.target.value }))
                            }
                            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                {/* Overlay */}
                <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                        Background Overlay
                    </label>
                    <select
                        name="overlay"
                        value={formData.overlay}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                        {OVERLAY_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-neutral-900">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-white/70 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
                </button>
            </div>
        </form>
    );
}
