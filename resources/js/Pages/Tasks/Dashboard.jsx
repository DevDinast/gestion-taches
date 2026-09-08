import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Dashboard({ tasks })
{
    const { auth, flash } = usePage().props;
    const [statusFilter, setStatusFilter] = useState(null);
    const [dueFilter, setDueFilter] = useState(null);
    const [visibleMessage, setVisibleMessage] = useState(flash.message);

    useEffect(() => {
        if (flash.message) {
            const timer = setTimeout(() => setVisibleMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.message]);

    const filters = [
        { key: 'all', label: 'Toutes' },
        { key: 'done', label: 'Terminées' },
        { key: 'pending', label: 'En cours' },
    ];

    const dueFilters = [
        { key: 'all', label: 'Toutes' },
        { key: 'overdue', label: 'En retard' },
        { key: 'due-today', label: "Aujourd'hui" },
        { key: 'upcoming', label: 'À venir' },
    ];

    function getDueStatus(task) {
        if (!task.due_date) return 'no-date';

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() < today.getTime()) return 'overdue';
        if (dueDate.getTime() === today.getTime()) return 'due-today';
        return 'upcoming';
    }

    const totalCount = tasks.length;
    const doneCount = tasks.filter((t) => t.is_done).length;
    const overdueCount = tasks.filter((t) => getDueStatus(t) === 'overdue').length;
    const dueTodayCount = tasks.filter((t) => getDueStatus(t) === 'due-today').length;

    const completionRate = totalCount === 0 ? 0 : Math.round((doneCount / totalCount) * 100);
    const overdueRate = totalCount === 0 ? 0 : Math.round((overdueCount / totalCount) * 100);

    let performanceLabel = 'Peu de données';
    let performanceColor = 'text-slate-400';
    if (totalCount > 0) {
        if (completionRate >= 70 && overdueRate <= 10) {
            performanceLabel = 'Très performant';
            performanceColor = 'text-emerald-600';
        } else if (completionRate >= 40) {
            performanceLabel = 'Performance correcte';
            performanceColor = 'text-amber-600';
        } else {
            performanceLabel = 'À améliorer';
            performanceColor = 'text-red-500';
        }
    }

    const topUrgent = [...tasks]
        .filter((t) => !t.is_done && t.due_date)
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    const topRecent = [...tasks]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    const topOverdue = [...tasks]
        .filter((t) => getDueStatus(t) === 'overdue')
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        .slice(0, 5);

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === null || statusFilter === 'all' ||
            (statusFilter === 'done' && task.is_done) ||
            (statusFilter === 'pending' && !task.is_done);

        const matchesDue =
            dueFilter === null || dueFilter === 'all' || getDueStatus(task) === dueFilter;

        return matchesStatus && matchesDue;
    });

    const hasActiveFilter = statusFilter !== null || dueFilter !== null;

    return (
        <div className="min-h-screen bg-[#F7F7F5] flex">
            <Head title="Dashboard" />

            {/* Sidebar */}
            <aside className="w-60 shrink-0 bg-slate-800 text-slate-100 flex flex-col">
                <div className="px-6 py-6 border-b border-slate-700/60">
                    <p className="text-lg font-semibold tracking-tight">TaskFlow</p>
                    <p className="text-xs text-slate-400 mt-0.5">Gestion de tâches</p>
                </div>

                <nav className="flex-1 px-3 py-5 space-y-1">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 rounded-lg bg-slate-700/70 px-3 py-2 text-sm font-medium text-white"
                    >
                        Tableau de bord
                    </Link>
                    
                </nav>

                <div className="px-6 py-4 border-t border-slate-700/60">
                    <p className="text-sm font-medium text-white">{auth.user.name}</p>
                    <Link
                        href="/profile"
                        className="text-xs text-slate-400 hover:text-slate-200"
                    >
                        Mon profil
                    </Link>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 px-8 py-8 max-w-5xl">

                {visibleMessage && (
                    <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
                        {visibleMessage}
                    </div>
                )}

                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-semibold text-slate-900">Mes tâches</h1>
                    <Link
                        href="/tasks/create"
                        className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 transition"
                    >
                        + Nouvelle tâche
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

    <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-2xl font-semibold text-slate-900">{totalCount}</p>
        <p className="text-xs text-slate-400 mt-1">Tâches</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-2xl font-semibold text-emerald-600">{doneCount}</p>
        <p className="text-xs text-slate-400 mt-1">Terminées</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-2xl font-semibold text-red-500">{overdueCount}</p>
        <p className="text-xs text-slate-400 mt-1">En retard</p>
    </div>

    <div className="bg-white border border-slate-200 rounded-xl p-4">
        <p className="text-2xl font-semibold text-amber-600">{dueTodayCount}</p>
        <p className="text-xs text-slate-400 mt-1">Aujourd'hui</p>
    </div>

</div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">

                    {/* Colonne principale : performance */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-slate-700">Rapport de performance</h2>
                            <span className={`text-sm font-semibold ${performanceColor}`}>
                                {performanceLabel}
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-3xl font-semibold text-slate-900">{completionRate}%</p>
                                <p className="text-xs text-slate-400 mt-0.5">Complétion</p>
                            </div>
                            <div>
                                <p className="text-3xl font-semibold text-slate-900">{doneCount}/{totalCount}</p>
                                <p className="text-xs text-slate-400 mt-0.5">Terminées</p>
                            </div>
                            <div>
                                <p className="text-3xl font-semibold text-slate-900">{overdueRate}%</p>
                                <p className="text-xs text-slate-400 mt-0.5">Taux de retard</p>
                            </div>
                        </div>
                    </div>

                    {/* Colonne latérale : top urgentes */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">Les plus urgentes</h2>
                        {topUrgent.length > 0 ? (
                            <ul className="space-y-2.5">
                                {topUrgent.map((task) => (
                                    <li key={task.id} className="flex justify-between text-sm gap-2">
                                        <Link href={`/tasks/${task.id}`} className="text-slate-700 hover:text-emerald-700 truncate">
                                            {task.title}
                                        </Link>
                                        <span className="text-slate-400 shrink-0">{task.due_date}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400">Rien d'urgent pour l'instant.</p>
                        )}
                    </div>

                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">Récemment créées</h2>
                        {topRecent.length > 0 ? (
                            <ul className="space-y-2.5">
                                {topRecent.map((task) => (
                                    <li key={task.id} className="flex justify-between text-sm gap-2">
                                        <Link href={`/tasks/${task.id}`} className="text-slate-700 hover:text-emerald-700 truncate">
                                            {task.title}
                                        </Link>
                                        <span className="text-slate-400 shrink-0">
                                            {new Date(task.created_at).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400">Aucune tâche pour le moment.</p>
                        )}
                    </div>

                    <div className="bg-white border border-red-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-red-600 mb-3">En retard</h2>
                        {topOverdue.length > 0 ? (
                            <ul className="space-y-2.5">
                                {topOverdue.map((task) => (
                                    <li key={task.id} className="flex justify-between text-sm gap-2">
                                        <Link href={`/tasks/${task.id}`} className="text-slate-700 hover:text-red-600 truncate">
                                            {task.title}
                                        </Link>
                                        <span className="text-red-400 shrink-0">{task.due_date}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400">Aucune tâche en retard.</p>
                        )}
                    </div>

                </div>

                {/* Filtres */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-medium text-slate-400 mr-1">Statut</span>
                    {filters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setStatusFilter(statusFilter === filter.key ? null : filter.key)}
                            className={
                                statusFilter === filter.key
                                    ? "rounded-full bg-slate-800 text-white text-sm font-medium px-4 py-1.5"
                                    : "rounded-full bg-white border border-slate-300 text-slate-600 text-sm font-medium px-4 py-1.5 hover:border-slate-400 transition"
                            }
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-xs font-medium text-slate-400 mr-1">Échéance</span>
                    {dueFilters.map((filter) => (
                        <button
                            key={filter.key}
                            onClick={() => setDueFilter(dueFilter === filter.key ? null : filter.key)}
                            className={
                                dueFilter === filter.key
                                    ? "rounded-full bg-slate-800 text-white text-sm font-medium px-4 py-1.5"
                                    : "rounded-full bg-white border border-slate-300 text-slate-600 text-sm font-medium px-4 py-1.5 hover:border-slate-400 transition"
                            }
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {hasActiveFilter && (
                    <div className="space-y-3">
                        {filteredTasks.length > 0 ? (
                            filteredTasks.map((task) => {
                                const dueStatus = getDueStatus(task);
                                return (
                                    <div
                                        key={task.id}
                                        className={
                                            dueStatus === 'overdue'
                                                ? "bg-white border-l-4 border-red-400 border-y border-r border-slate-200 rounded-xl p-5"
                                                : dueStatus === 'due-today'
                                                ? "bg-white border-l-4 border-amber-400 border-y border-r border-slate-200 rounded-xl p-5"
                                                : "bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition"
                                        }
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h2 className="text-base font-semibold text-slate-900">{task.title}</h2>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {task.description || 'Aucune description'}
                                                </p>
                                                <p className="text-xs text-slate-400 mt-2">
                                                    {task.due_date ? `Échéance : ${task.due_date}` : 'Aucune échéance'}
                                                </p>
                                            </div>
                                            <span
                                                className={
                                                    task.is_done
                                                        ? "shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                                                        : "shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700"
                                                }
                                            >
                                                {task.is_done ? 'Terminée' : 'En cours'}
                                            </span>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <Link
                                                href={`/tasks/${task.id}`}
                                                className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                            >
                                                Voir la tâche →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center bg-white border border-dashed border-slate-300 rounded-xl py-10">
                                <p className="text-slate-400">Aucune tâche pour ce filtre.</p>
                            </div>
                        )}
                    </div>
                )}

            </main>
        </div>
    );
}