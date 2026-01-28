import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PROJECTS_FILE = path.join(process.cwd(), 'src/config/projects.json');

// Helper functions
async function readProjects() {
    const content = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(content);
}

async function writeProjects(projects: unknown[]) {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

interface RouteParams {
    params: Promise<{ id: string }>;
}

// GET - Get single project
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const projects = await readProjects();
        const project = projects.find((p: { id: string }) => p.id === id);

        if (!project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error('Error reading project:', error);
        return NextResponse.json({ error: 'Failed to read project' }, { status: 500 });
    }
}

// PUT - Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const updates = await request.json();
        const projects = await readProjects();

        const index = projects.findIndex((p: { id: string }) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Merge updates, keeping the id
        projects[index] = { ...projects[index], ...updates, id };
        await writeProjects(projects);

        return NextResponse.json({ project: projects[index], success: true });
    } catch (error) {
        console.error('Error updating project:', error);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
}

// DELETE - Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        const projects = await readProjects();

        const index = projects.findIndex((p: { id: string }) => p.id === id);
        if (index === -1) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        projects.splice(index, 1);
        await writeProjects(projects);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting project:', error);
        return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
    }
}
