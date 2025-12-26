'use client'

import { useState, useEffect } from 'react'
import { submitAnswer, updateAnswer } from '../actions'

interface QuestionEvent {
    type: string
    questionNumber: number
    timestamp: string
}

export default function GameClient({ userId }: { userId: string }) {
    const [answer, setAnswer] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [answerId, setAnswerId] = useState<number | null>(null)
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number | null>(null)
    const [answerHistory, setAnswerHistory] = useState<{[key: number]: {text: string, id: number}}>({})

    // Connect to SSE for question updates
    useEffect(() => {
        const eventSource = new EventSource('/api/events')
        
        eventSource.onmessage = (event) => {
            try {
                const data: QuestionEvent = JSON.parse(event.data)
                
                if (data.type === 'SHOW_QUESTION') {
                    // Save current answer if exists
                    if (currentQuestionNumber && answer && answerId) {
                        setAnswerHistory(prev => ({
                            ...prev,
                            [currentQuestionNumber]: { text: answer, id: answerId }
                        }))
                    }
                    
                    // Switch to new question
                    setCurrentQuestionNumber(data.questionNumber)
                    
                    // Check if we already answered this question
                    const previousAnswer = answerHistory[data.questionNumber]
                    if (previousAnswer) {
                        setAnswer(previousAnswer.text)
                        setAnswerId(previousAnswer.id)
                        setIsSubmitted(true)
                    } else {
                        setAnswer('')
                        setAnswerId(null)
                        setIsSubmitted(false)
                    }
                }
            } catch (error) {
                console.error('Failed to parse SSE message:', error)
            }
        }
        
        return () => {
            eventSource.close()
        }
    }, [currentQuestionNumber, answer, answerId, answerHistory])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (answer.trim() && currentQuestionNumber) {
            try {
                const newAnswerId = await submitAnswer(userId, answer, currentQuestionNumber)
                setAnswerId(newAnswerId)
                setIsSubmitted(true)
                setAnswerHistory(prev => ({
                    ...prev,
                    [currentQuestionNumber]: { text: answer, id: newAnswerId }
                }))
            } catch (error) {
                console.error('Failed to submit answer:', error)
                alert(error instanceof Error ? error.message : 'Failed to submit answer')
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
                if (currentQuestionNumber) {
                    setAnswerHistory(prev => ({
                        ...prev,
                        [currentQuestionNumber]: { text: answer, id: answerId }
                    }))
                }
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
                        {currentQuestionNumber === null ? (
                            <div className="text-center text-white/70 text-xl">
                                Venter på spørsmål...
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold text-white mb-8 text-center">
                                    Spørsmål {currentQuestionNumber}
                                </h2>
                                
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
                                        <div className="text-center text-white/50 text-sm">
                                            Svar innsendt ✓
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
