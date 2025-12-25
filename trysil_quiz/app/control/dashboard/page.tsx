import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            answers: true,
        },
    })

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-8">
                    Admin Dashboard
                </h1>

                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            All Users ({users.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created At
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Answers
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {user.name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">
                                                {user.id.substring(0, 8)}...
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(user.createdAt).toLocaleString('nb-NO', {
                                                    dateStyle: 'short',
                                                    timeStyle: 'short',
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {user.answers.length}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {users.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{users.length}</p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Answers</h3>
                            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                                {users.reduce((acc, user) => acc + user.answers.length, 0)}
                            </p>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Latest User</h3>
                            <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">
                                {users[0]?.name || 'N/A'}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
