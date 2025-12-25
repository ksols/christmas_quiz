'use client'

import { prisma } from '@/lib/prisma'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface User {
    id: string
    name: string | null
    createdAt: Date
    answers: any[]
}

interface DashboardClientProps {
    users: User[]
}

export default function DashboardClient({ users: initialUsers }: DashboardClientProps) {
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState('')
    const [users, setUsers] = useState(initialUsers)
    const [lastUpdate, setLastUpdate] = useState<string | null>(null)
    const router = useRouter()

    // Update users when initialUsers changes
    useEffect(() => {
        setUsers(initialUsers)
    }, [initialUsers])

    // Group answers by round/question number
    const getGroupedAnswers = () => {
        const answersByRound: { [key: number]: { userId: string; userName: string; text: string; createdAt: Date }[] } = {}
        
        users.forEach(user => {
            user.answers.forEach((answer, index) => {
                const roundNumber = index + 1
                if (!answersByRound[roundNumber]) {
                    answersByRound[roundNumber] = []
                }
                answersByRound[roundNumber].push({
                    userId: user.id,
                    userName: user.name || 'N/A',
                    text: answer.text,
                    createdAt: answer.createdAt
                })
            })
        })
        
        return answersByRound
    }

    const groupedAnswers = getGroupedAnswers()
    const maxRounds = Math.max(0, ...Object.keys(groupedAnswers).map(Number))

    // Poll for updates every 3 seconds (works reliably on Vercel)
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                router.refresh()
            }
        }, 3000)

        return () => {
            clearInterval(interval)
        }
    }, [router])

    // Update timestamp when data changes
    useEffect(() => {
        if (users.length > 0) {
            setLastUpdate(`Last updated: ${new Date().toLocaleTimeString('nb-NO')}`)
        }
    }, [users])

    const handleStartGame = async () => {
        setIsSending(true)
        setMessage('')

        try {
            const response = await fetch('/api/broadcast', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    message: JSON.stringify({ 
                        type: 'START_GAME',
                        timestamp: new Date().toISOString()
                    }) 
                }),
            })

            if (response.ok) {
                setMessage('✅ Game started! All clients redirected.')
            } else {
                setMessage('❌ Failed to start game')
            }
        } catch (error) {
            console.error('Error starting game:', error)
            setMessage('❌ Error sending signal')
        } finally {
            setIsSending(false)
        }
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                        Admin Dashboard
                    </h1>

                    <button
                        onClick={handleStartGame}
                        disabled={isSending}
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isSending ? '🚀 Starting...' : '🎮 Start Game'}
                    </button>
                </div>

                {message && (
                    <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-md border-l-4 border-green-500">
                        <p className="text-gray-900 dark:text-gray-100 font-medium">{message}</p>
                    </div>
                )}

                {lastUpdate && (
                    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md border-l-4 border-blue-500">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            <p className="text-blue-900 dark:text-blue-100 font-medium">
                                🔴 Live Update: {lastUpdate}
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            All Users ({users.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Answers
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {user.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                {user.id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleString('nb-NO', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.answers.length}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{users.length}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Answers</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {users.reduce((acc, user) => acc + user.answers.length, 0)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest User</h3>
                            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                                {users[0]?.name || 'N/A'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Answers Grouped by Round/Question */}
                {maxRounds > 0 && (
                    <div className="mt-8 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Answers by Question
                        </h2>
                        
                        {Array.from({ length: maxRounds }, (_, i) => i + 1).map(roundNumber => {
                            const answers = groupedAnswers[roundNumber] || []
                            if (answers.length === 0) return null
                            
                            return (
                                <div key={roundNumber} className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
                                    <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-indigo-600">
                                        <h3 className="text-xl font-bold text-white">
                                            Question {roundNumber} ({answers.length} {answers.length === 1 ? 'answer' : 'answers'})
                                        </h3>
                                    </div>
                                    
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/4">
                                                        User
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                        Answer
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-1/6">
                                                        Submitted At
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                                                {answers.map((answer, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {answer.userName}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                                                            {answer.text}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                            {new Date(answer.createdAt).toLocaleString('nb-NO', {
                                                                dateStyle: 'short',
                                                                timeStyle: 'short',
                                                            })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
