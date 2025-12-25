const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { WebSocketServer } = require('ws')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 3000
const wsPort = 3001

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    // HTTP server for Next.js
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url, true)
            await handle(req, res, parsedUrl)
        } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
        }
    })

    // Separate HTTP server for WebSocket
    const wsServer = createServer()
    const wss = new WebSocketServer({ server: wsServer })

    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket')

        ws.on('message', (message) => {
            console.log('Received:', message.toString())
        })

        ws.on('close', () => {
            console.log('Client disconnected from WebSocket')
        })

        ws.on('error', (error) => {
            console.error('WebSocket error:', error)
        })
    })

    // Store wss globally so we can access it from API routes
    global.wss = wss

    server.listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname}:${port}`)
    })

    wsServer.listen(wsPort, (err) => {
        if (err) throw err
        console.log(`> WebSocket server ready on ws://${hostname}:${wsPort}`)
    })
})

