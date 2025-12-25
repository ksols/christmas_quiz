import { prisma } from '@/lib/prisma'

export default async function GamePage({
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
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
            <div className="flex min-h-screen items-center justify-center p-8">
                <main className="max-w-4xl w-full">
                    <div className="text-center mb-12">
                        <h1 className="text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in">
                            🎮 La oss spille!
                        </h1>
                        <p className="text-2xl text-blue-200">
                            Velkommen til spillet, {userName}!
                        </p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                        <div className="text-center">
                            <div className="inline-block p-6 bg-green-500/20 rounded-full mb-6">
                                <svg
                                    className="w-16 h-16 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-3xl font-bold text-white mb-4">
                                Du er klar!
                            </h2>

                            <p className="text-lg text-blue-200 mb-8">
                                Spillet starter snart. Hold deg klar for den første utfordringen!
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <h3 className="text-white font-semibold mb-1">Poeng</h3>
                                    <p className="text-blue-200 text-sm">Samle poeng ved å svare riktig</p>
                                </div>

                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="text-4xl mb-2">⚡</div>
                                    <h3 className="text-white font-semibold mb-1">Hastighet</h3>
                                    <p className="text-blue-200 text-sm">Raskere svar gir bonuspoeng</p>
                                </div>

                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="text-4xl mb-2">🎯</div>
                                    <h3 className="text-white font-semibold mb-1">Presisjon</h3>
                                    <p className="text-blue-200 text-sm">Nøyaktighet er nøkkelen</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="inline-flex items-center space-x-2 text-white/60">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            <span className="text-sm">Venter på neste runde...</span>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
