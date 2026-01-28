'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Project, ProjectSection } from '@/config/projects';
import ProjectForm from '@/components/admin/ProjectForm';
import SectionEditor from '@/components/admin/SectionEditor';
import { v4 as uuidv4 } from 'uuid';

type ViewMode = 'list' | 'create' | 'edit' | 'sections';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [saving, setSaving] = useState(false);

    // Fetch projects
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/projects');
            if (!res.ok) throw new Error('Failed to fetch projects');
            const data = await res.json();
            setProjects(data.projects);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Create project
    const handleCreate = async (data: Partial<Project>) => {
        setSaving(true);
        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create project');
            await fetchProjects();
            setViewMode('list');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create');
        } finally {
            setSaving(false);
        }
    };

    // Update project
    const handleUpdate = async (data: Partial<Project>) => {
        if (!selectedProject) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update project');
            await fetchProjects();
            setViewMode('list');
            setSelectedProject(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update');
        } finally {
            setSaving(false);
        }
    };

    // Delete project
    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this project?')) return;
        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete project');
            await fetchProjects();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    // Section management
    const handleSectionChange = (index: number, section: ProjectSection) => {
        if (!selectedProject) return;
        const newSections = [...selectedProject.sections];
        newSections[index] = section;
        setSelectedProject({ ...selectedProject, sections: newSections });
    };

    const handleSectionDelete = (index: number) => {
        if (!selectedProject) return;
        const newSections = selectedProject.sections.filter((_, i) => i !== index);
        setSelectedProject({ ...selectedProject, sections: newSections });
    };

    const handleSectionMove = (index: number, direction: 'up' | 'down') => {
        if (!selectedProject) return;
        const newSections = [...selectedProject.sections];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newSections.length) return;
        [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
        setSelectedProject({ ...selectedProject, sections: newSections });
    };

    const handleAddSection = () => {
        if (!selectedProject) return;
        const newSection: ProjectSection = {
            type: 'text',
            id: `section-${uuidv4().slice(0, 8)}`,
            content: '',
        } as ProjectSection;
        setSelectedProject({
            ...selectedProject,
            sections: [...selectedProject.sections, newSection],
        });
    };

    const handleSaveSections = async () => {
        if (!selectedProject) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/projects/${selectedProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sections: selectedProject.sections }),
            });
            if (!res.ok) throw new Error('Failed to save sections');
            await fetchProjects();
            setViewMode('list');
            setSelectedProject(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save sections');
        } finally {
            setSaving(false);
        }
    };

    // Get project folder name
    const getProjectFolder = (project: Project) => `${project.id}-${project.title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-white/50 hover:text-white transition-colors">
                            ← Back
                        </Link>
                        <h1 className="text-xl font-bold">Projects Admin</h1>
                    </div>
                    {viewMode === 'list' && (
                        <button
                            onClick={() => setViewMode('create')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
                        >
                            + New Project
                        </button>
                    )}
                </div>
            </header>

            <div className="container mx-auto px-6 py-8">
                {/* Error message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                        {error}
                        <button onClick={() => setError(null)} className="ml-4 text-red-300 hover:text-white">
                            ✕
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && viewMode === 'list' && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                )}

                {/* Projects List */}
                {viewMode === 'list' && !loading && (
                    <div className="grid gap-4">
                        {projects.length === 0 ? (
                            <div className="text-center py-20 text-white/40">
                                <p className="text-lg mb-4">No projects yet</p>
                                <button
                                    onClick={() => setViewMode('create')}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Create your first project →
                                </button>
                            </div>
                        ) : (
                            projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg"
                                            style={{ backgroundColor: project.bgcolor || '#1e293b' }}
                                        >
                                            {project.id}
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{project.title}</h3>
                                            <p className="text-sm text-white/50">
                                                {project.subtitle} • {project.sections.length} sections
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/project/${project.id}`}
                                            className="px-3 py-1.5 text-sm text-white/50 hover:text-white transition-colors"
                                            target="_blank"
                                        >
                                            Preview
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setViewMode('sections');
                                            }}
                                            className="px-3 py-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                        >
                                            Sections
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedProject(project);
                                                setViewMode('edit');
                                            }}
                                            className="px-3 py-1.5 text-sm text-white/70 hover:text-white transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="px-3 py-1.5 text-sm text-red-400/70 hover:text-red-400 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Create Form */}
                {viewMode === 'create' && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Create New Project</h2>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <ProjectForm
                                onSave={handleCreate}
                                onCancel={() => setViewMode('list')}
                            />
                        </div>
                    </div>
                )}

                {/* Edit Form */}
                {viewMode === 'edit' && selectedProject && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Edit Project: {selectedProject.title}</h2>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                            <ProjectForm
                                project={selectedProject}
                                onSave={handleUpdate}
                                onCancel={() => {
                                    setViewMode('list');
                                    setSelectedProject(null);
                                }}
                            />
                        </div>
                    </div>
                )}

                {/* Sections Editor */}
                {viewMode === 'sections' && selectedProject && (
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold">
                                Sections: {selectedProject.title}
                            </h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setViewMode('list');
                                        setSelectedProject(null);
                                    }}
                                    className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveSections}
                                    disabled={saving}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Sections'}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {selectedProject.sections.map((section, index) => (
                                <SectionEditor
                                    key={`${section.id}-${index}`}
                                    section={section}
                                    projectFolder={getProjectFolder(selectedProject)}
                                    onChange={(s) => handleSectionChange(index, s)}
                                    onDelete={() => handleSectionDelete(index)}
                                    onMoveUp={() => handleSectionMove(index, 'up')}
                                    onMoveDown={() => handleSectionMove(index, 'down')}
                                    isFirst={index === 0}
                                    isLast={index === selectedProject.sections.length - 1}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleAddSection}
                            className="w-full mt-4 py-4 border-2 border-dashed border-white/20 rounded-lg text-white/50 hover:text-white hover:border-white/40 transition-colors"
                        >
                            + Add Section
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}
