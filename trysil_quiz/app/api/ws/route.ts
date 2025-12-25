import { NextRequest } from 'next/server'
import { getWebSocketServer } from '@/lib/websocket-server'

export async function GET(req: NextRequest) {
    const upgradeHeader = req.headers.get('upgrade')

    if (upgradeHeader !== 'websocket') {
        return new Response('Expected WebSocket', { status: 426 })
    }

    // Get the WebSocket server instance
    const wss = getWebSocketServer()

    // In Next.js, we need to handle WebSocket upgrades differently
    // This endpoint serves as a marker for WebSocket connections
    return new Response('WebSocket endpoint', {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    })
}
