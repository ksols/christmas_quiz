import GameClient from './GameClient'

export default async function GamePage({
    searchParams,
}: {
    searchParams: Promise<{ userId?: string }>
}) {
    const { userId } = await searchParams

    if (!userId) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                <p className="text-white text-xl">User ID is missing</p>
            </div>
        )
    }

    return <GameClient userId={userId} />
}

