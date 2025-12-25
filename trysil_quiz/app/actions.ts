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

    // Broadcast user creation event to dashboard
    if (isNewUser) {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/broadcast`, {
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
            })
        } catch (error) {
            console.error('Failed to broadcast user creation:', error)
        }
    }

    redirect(`/waiting?userId=${user.id}`)
}

export async function submitAnswer(userId: string, answerText: string) {
    if (!userId || !answerText.trim()) {
        throw new Error('User ID and answer text are required')
    }

    const answer = await prisma.answer.create({
        data: {
            userId: userId,
            text: answerText,
        } as any,
    })

    // Broadcast the new answer event to dashboard
    try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/broadcast`, {
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
        })
    } catch (error) {
        console.error('Failed to broadcast answer submission:', error)
    }

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

    // Broadcast the answer update event to dashboard
    try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/broadcast`, {
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
        })
    } catch (error) {
        console.error('Failed to broadcast answer update:', error)
    }
}
