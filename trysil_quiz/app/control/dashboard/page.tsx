import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'

export default async function DashboardPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            answers: true,
        },
    })

    // Serialize the data to avoid Date serialization issues
    const serializedUsers = users.map(user => ({
        ...user,
        createdAt: user.createdAt,
        answers: user.answers,
    }))

    return <DashboardClient users={serializedUsers} />
}
