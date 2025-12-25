import { NextRequest } from 'next/server'
import { sseManager } from '@/lib/sse-manager'

export async function GET(request: NextRequest) {
    const clientId = crypto.randomUUID()

    const stream = new ReadableStream({
        start(controller) {
            // Add this client to the SSE manager
            sseManager.addClient(clientId, controller)

            // Send initial connection message
            const encoder = new TextEncoder()
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`))

            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                sseManager.removeClient(clientId)
                controller.close()
            })
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no', // Disable buffering in nginx
        },
    })
}
