import { WebSocketServer, WebSocket } from 'ws'

let wss: WebSocketServer | null = null

export function getWebSocketServer(): WebSocketServer {
    if (!wss) {
        wss = new WebSocketServer({ noServer: true })

        wss.on('connection', (ws: WebSocket) => {
            console.log('Client connected')

            ws.on('close', () => {
                console.log('Client disconnected')
            })

            ws.on('error', (error) => {
                console.error('WebSocket error:', error)
            })
        })
    }

    return wss
}

export function broadcastMessage(message: string) {
    const server = getWebSocketServer()

    server.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message)
        }
    })

    console.log(`Broadcasted message to ${server.clients.size} clients: ${message}`)
}
