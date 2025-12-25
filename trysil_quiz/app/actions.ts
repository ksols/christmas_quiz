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

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: name,
            } as any,
        })
    }

    redirect(`/waiting?userId=${user.id}`)
}
