import { NextRequest, NextResponse } from 'next/server'
import { WebSocket } from 'ws'

export async function POST(req: NextRequest) {
    try {
        const { message } = await req.json()

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Access the global WebSocket server
        const wss = (global as any).wss

        if (!wss) {
            return NextResponse.json(
                { error: 'WebSocket server not initialized' },
                { status: 503 }
            )
        }

        // Broadcast to all connected clients
        let clientCount = 0
        wss.clients.forEach((client: WebSocket) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message)
                clientCount++
            }
        })

        console.log(`Broadcasted "${message}" to ${clientCount} clients`)

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
