import { prisma } from '@/lib/prisma'

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

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <main className="flex flex-col items-center justify-center p-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
                    Venter på sjæfen...
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Hei {userName}! Ta en øl og len dere tilbake.
                </p>
            </main>
        </div>
    )
}

