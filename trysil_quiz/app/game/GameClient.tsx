'use client'

import { useState } from 'react'
import { submitAnswer, updateAnswer } from '../actions'

export default function GameClient({ userId }: { userId: string }) {
    const [answer, setAnswer] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [answerId, setAnswerId] = useState<number | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (answer.trim()) {
            try {
                const newAnswerId = await submitAnswer(userId, answer)
                setAnswerId(newAnswerId)
                setIsSubmitted(true)
            } catch (error) {
                console.error('Failed to submit answer:', error)
            }
        }
    }

    const handleEdit = () => {
        setIsSubmitted(false)
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (answer.trim() && answerId) {
            try {
                await updateAnswer(answerId, answer)
                setIsSubmitted(true)
            } catch (error) {
                console.error('Failed to update answer:', error)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="flex min-h-screen items-center justify-center p-8">
                <main className="max-w-2xl w-full">
                    <div className="p-8">
                        {!isSubmitted ? (
                            <form onSubmit={answerId ? handleUpdate : handleSubmit} className="space-y-6">
                                <div>
                                    <input
                                        type="text"
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                        placeholder="Skriv ditt svar her..."
                                        className="w-full px-6 py-4 text-lg rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:bg-white/10 focus:border-white/20"
                                    />
                                </div>
                                
                                <button
                                    type="submit"
                                    className="w-full py-4 px-6 text-lg font-semibold text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-purple-900"
                                >
                                    Svaret er avgitt
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative">
                                    <div className="w-full px-6 py-4 text-lg rounded-lg bg-white/5 border border-white/10 text-white">
                                        {answer}
                                    </div>
                                    <button
                                        onClick={handleEdit}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200"
                                    >
                                        Rediger
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
