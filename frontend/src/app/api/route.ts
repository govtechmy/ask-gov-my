import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('Received POST request:', body);
        return NextResponse.json(body);
    } catch (error) {
        console.error('Error processing POST request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}

export async function GET() {
    console.log('This is a GET request');
    return new Response('GET request received');
}

export async function DELETE(req: Request) {
    console.log('Received DELETE request:', req);
    return NextResponse.json({ message: 'Delete request received' });
}
