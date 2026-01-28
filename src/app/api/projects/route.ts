import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const PROJECTS_FILE = path.join(process.cwd(), 'src/config/projects.json');

// Helper to read projects from JSON
async function readProjects() {
    const content = await fs.readFile(PROJECTS_FILE, 'utf-8');
    return JSON.parse(content);
}

// Helper to write projects to JSON
async function writeProjects(projects: unknown[]) {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
}

// GET - List all projects
export async function GET() {
    try {
        const projects = await readProjects();
        return NextResponse.json({ projects });
    } catch (error) {
        console.error('Error reading projects:', error);
        return NextResponse.json(
            { error: 'Failed to read projects' },
            { status: 500 }
        );
    }
}

// POST - Create a new project
export async function POST(request: NextRequest) {
    try {
        const newProject = await request.json();
        const projects = await readProjects();

        // Generate new ID
        const maxId = Math.max(0, ...projects.map((p: { id: string }) => parseInt(p.id) || 0));
        newProject.id = String(maxId + 1).padStart(2, '0');

        // Ensure sections array exists
        if (!newProject.sections) {
            newProject.sections = [{ type: 'intro', id: 'intro' }];
        }

        projects.push(newProject);
        await writeProjects(projects);

        return NextResponse.json({ project: newProject, success: true });
    } catch (error) {
        console.error('Error creating project:', error);
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        );
    }
}
