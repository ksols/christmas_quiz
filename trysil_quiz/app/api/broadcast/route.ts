import { NextRequest, NextResponse } from 'next/server'
import { sseManager } from '@/lib/sse-manager'

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json()

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Broadcast to all connected SSE clients
        const clientCount = sseManager.broadcast(message)

        return NextResponse.json({
            success: true,
            clientCount
        })
    } catch (error) {
        console.error('Broadcast error:', error)
        return NextResponse.json(
            { error: 'Failed to broadcast message' },
            { status: 500 }
        )
    }
}
