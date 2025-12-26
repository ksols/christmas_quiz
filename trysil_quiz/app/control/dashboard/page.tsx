import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'
import { getGameState } from '@/app/actions'

// Disable caching to always fetch fresh data
export const revalidate = 0

export default async function DashboardPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            answers: {
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    })

    const gameState = await getGameState()

    // Serialize the data to avoid Date serialization issues
    const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt,
        answers: user.answers,
    }))

    return <DashboardClient users={serializedUsers} gameState={gameState} />
}
