import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'portfolio-assets';

export async function POST(request: NextRequest) {
    try {
        if (!connectionString || connectionString === 'your-connection-string-here') {
            return NextResponse.json(
                { error: 'Azure Storage connection string not configured. Please update .env.local' },
                { status: 500 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const projectFolder = formData.get('projectFolder') as string || 'uploads';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Allowed: jpg, png, webp, gif, mp4, webm' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const ext = file.name.split('.').pop();
        const filename = `${uuidv4()}.${ext}`;
        const blobPath = `${projectFolder}/${filename}`;

        // Upload to Azure Blob Storage
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: {
                blobContentType: file.type,
            },
        });

        // Return the path (without base URL, as it will be prefixed by getImg)
        const relativePath = `/${blobPath}`;
        const fullUrl = `${process.env.NEXT_PUBLIC_AZURE_STORAGE_URL}${relativePath}`;

        return NextResponse.json({
            success: true,
            path: relativePath,
            url: fullUrl,
            filename: file.name,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}
