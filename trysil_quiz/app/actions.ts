'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createUser(formData: FormData) {
    const name = formData.get('name') as string

    if (!name || name.trim() === '') {
        throw new Error('Name is required')
    }

    // Find existing user or create new one
    let user = await prisma.user.findFirst({
        where: {
            name: name,
        },
    })

    let isNewUser = false
    if (!user) {
        user = await prisma.user.create({
            data: {
                name: name,
            } as any,
        })
        isNewUser = true
    }

    // Broadcast user creation event to dashboard (fire and forget)
    if (isNewUser) {
        const baseUrl = process.env.VERCEL_URL 
            ? `https://${process.env.VERCEL_URL}` 
            : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
        
        fetch(`${baseUrl}/api/broadcast`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: JSON.stringify({ 
                    type: 'USER_CREATED', 
                    userId: user.id,
                    userName: user.name,
                    timestamp: new Date().toISOString()
                }) 
            }),
            cache: 'no-store'
        }).catch(error => console.error('Failed to broadcast user creation:', error))
    }

    redirect(`/waiting?userId=${user.id}`)
}

export async function submitAnswer(userId: string, answerText: string, questionNumber: number) {
    if (!userId || !answerText.trim()) {
        throw new Error('User ID and answer text are required')
    }

    // Verify this is the current active question
    const gameState = await getGameState()
    if (!gameState?.currentQuestionNumber || gameState.currentQuestionNumber !== questionNumber) {
        throw new Error('Cannot submit answer for inactive question')
    }

    // Check if user already answered this question
    const existingAnswer = await prisma.answer.findFirst({
        where: {
            userId: userId,
            questionNumber: questionNumber,
        },
    })

    if (existingAnswer) {
        throw new Error('You have already answered this question')
    }

    const answer = await prisma.answer.create({
        data: {
            userId: userId,
            text: answerText,
            questionNumber: questionNumber,
        } as any,
    })

    // Broadcast the new answer event to dashboard (fire and forget)
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    
    fetch(`${baseUrl}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: JSON.stringify({ 
                type: 'ANSWER_SUBMITTED', 
                answerId: answer.id,
                userId: userId,
                timestamp: new Date().toISOString()
            }) 
        }),
        cache: 'no-store'
    }).catch(error => console.error('Failed to broadcast answer submission:', error))

    return answer.id
}

export async function updateAnswer(answerId: number, answerText: string) {
    if (!answerId || !answerText.trim()) {
        throw new Error('Answer ID and answer text are required')
    }

    const answer = await prisma.answer.update({
        where: { id: answerId },
        data: { text: answerText } as any,
    })

    // Broadcast the answer update event to dashboard (fire and forget)
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    
    fetch(`${baseUrl}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: JSON.stringify({ 
                type: 'ANSWER_UPDATED', 
                answerId: answer.id,
                userId: answer.userId,
                timestamp: new Date().toISOString()
            }) 
        }),
        cache: 'no-store'
    }).catch(error => console.error('Failed to broadcast answer update:', error))
}

export async function setAnswerPoints(answerId: number, points: number) {
    if (points < 0 || points > 3) {
        throw new Error('Points must be between 0 and 3')
    }

    const answer = await prisma.answer.update({
        where: { id: answerId },
        data: { points } as any,
    })

    return answer
}

export async function getGameState() {
    let gameState = await prisma.gameState.findFirst()
    
    if (!gameState) {
        // Create initial game state if it doesn't exist
        gameState = await prisma.gameState.create({
            data: {
                status: 'WAITING',
                currentQuestionNumber: null,
            } as any,
        })
    }
    
    return gameState
}

export async function setActiveQuestion(questionNumber: number) {
    let gameState = await getGameState()
    
    // Update game state
    gameState = await prisma.gameState.update({
        where: { id: gameState.id },
        data: {
            currentQuestionNumber: questionNumber,
            status: 'ACTIVE',
        } as any,
    })
    
    // Broadcast the new question to all clients
    const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000')
    
    fetch(`${baseUrl}/api/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            message: JSON.stringify({ 
                type: 'SHOW_QUESTION', 
                questionNumber: questionNumber,
                timestamp: new Date().toISOString()
            }) 
        }),
        cache: 'no-store'
    }).catch(error => console.error('Failed to broadcast question:', error))
    
    return gameState
}
