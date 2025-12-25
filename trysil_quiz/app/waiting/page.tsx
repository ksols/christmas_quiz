import { prisma } from '@/lib/prisma'
import WaitingClient from './WaitingClient'

export default async function WaitingPage({
    searchParams,
}: {
    searchParams: Promise<{ userId?: string }>
}) {
    const { userId } = await searchParams

    let userName = 'Guest'
    if (userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId } as any,
        })
        userName = user?.name || 'Guest'
    }

    return <WaitingClient userName={userName} userId={userId} />
}
