// Simple in-memory event manager for SSE
type SSEClient = {
    id: string
    controller: ReadableStreamDefaultController
}

class SSEManager {
    private clients: Map<string, SSEClient> = new Map()

    addClient(id: string, controller: ReadableStreamDefaultController) {
        this.clients.set(id, { id, controller })
        console.log(`SSE client connected: ${id}. Total clients: ${this.clients.size}`)
    }

    removeClient(id: string) {
        this.clients.delete(id)
        console.log(`SSE client disconnected: ${id}. Total clients: ${this.clients.size}`)
    }

    broadcast(message: string) {
        const encoder = new TextEncoder()
        const data = `data: ${message}\n\n`
        let successCount = 0

        this.clients.forEach((client) => {
            try {
                client.controller.enqueue(encoder.encode(data))
                successCount++
            } catch (error) {
                console.error(`Failed to send to client ${client.id}:`, error)
                this.removeClient(client.id)
            }
        })

        console.log(`Broadcasted "${message}" to ${successCount}/${this.clients.size} clients`)
        return successCount
    }

    getClientCount() {
        return this.clients.size
    }
}

// Global singleton instance
export const sseManager = new SSEManager()
