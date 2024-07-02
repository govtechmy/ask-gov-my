import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic' // defaults to auto

const webhook_secret = "plane_wh_05c192b6694f4b2ebd83af18e42a8c34"

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // if (webhook_secret != body.webhook_id) {
        //     return new Response('Forbidden', { status: 403 });
        // }
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
