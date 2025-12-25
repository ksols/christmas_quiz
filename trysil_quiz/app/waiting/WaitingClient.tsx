'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface WaitingClientProps {
    userName: string
    userId: string | undefined
}

export default function WaitingClient({ userName, userId }: WaitingClientProps) {
    const router = useRouter()
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

    useEffect(() => {
        let ws: WebSocket | null = null
        let reconnectTimeout: NodeJS.Timeout

        const connect = () => {
            try {
                // Connect to WebSocket on port 3001
                ws = new WebSocket(`ws://${window.location.hostname}:3001`)

                ws.onopen = () => {
                    console.log('Connected to WebSocket')
                    setConnectionStatus('connected')
                }

                ws.onmessage = (event) => {
                    console.log('Received message:', event.data)

                    if (event.data === 'START_GAME') {
                        console.log('Redirecting to game...')
                        router.push(`/game?userId=${userId}`)
                    }
                }

                ws.onerror = (error) => {
                    // WebSocket errors are often non-critical and followed by onclose
                    // Only log in development, don't change connection status here
                    if (process.env.NODE_ENV === 'development') {
                        console.warn('WebSocket error event (may be non-critical):', error)
                    }
                    // Let onclose handle the connection status change
                }

                ws.onclose = () => {
                    console.log('Disconnected from WebSocket')
                    setConnectionStatus('disconnected')

                    // Attempt to reconnect after 3 seconds
                    reconnectTimeout = setTimeout(() => {
                        console.log('Attempting to reconnect...')
                        connect()
                    }, 3000)
                }
            } catch (error) {
                console.error('Failed to create WebSocket:', error)
                setConnectionStatus('disconnected')
            }
        }

        connect()

        return () => {
            if (ws) {
                ws.close()
            }
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout)
            }
        }
    }, [router, userId])

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <main className="flex flex-col items-center justify-center p-24 text-center">
                <div className="mb-8">
                    <div className={`inline-block w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                        connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                            'bg-red-500'
                        }`} />
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        {connectionStatus === 'connected' ? 'Tilkoblet' :
                            connectionStatus === 'connecting' ? 'Kobler til...' :
                                'Frakoblet - prøver igjen...'}
                    </span>
                </div>

                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
                    Venter på sjæfen...
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Hei {userName}! Ta en øl og len dere tilbake.
                </p>

                <div className="mt-12">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </main>
        </div>
    )
}
