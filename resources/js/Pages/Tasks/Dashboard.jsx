import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from '@/Components/Sidebar';
import { getDueStatus, formatDate } from '@/Utils/tasks';

export default function Dashboard({ tasks }) {
    const { flash } = usePage().props;
    const [visibleMessage, setVisibleMessage] = useState(flash.message);

    useEffect(() => {
        if (flash.message) {
            setVisibleMessage(flash.message);
            const timer = setTimeout(() => setVisibleMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.message]);

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

    return (
        <div className="min-h-screen bg-[#F7F7F5] flex">
            <Head title="Dashboard" />

            <Sidebar />

            <main className="flex-1 px-8 py-8 max-w-5xl">
                {visibleMessage && (
                    <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
                        {visibleMessage}
                    </div>
                )}

                <div className="flex items-center justify-between mb-1">
                    <h1 className="text-2xl font-semibold text-slate-900">Tableau de bord</h1>
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

                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">Les plus urgentes</h2>
                        {topUrgent.length > 0 ? (
                            <ul className="space-y-2.5">
                                {topUrgent.map((task) => (
                                    <li key={task.id} className="flex justify-between text-sm gap-2">
                                        <Link href={`/tasks/${task.id}`} className="text-slate-700 hover:text-emerald-700 truncate">
                                            {task.title}
                                        </Link>
                                        <span className="text-slate-400 shrink-0">{formatDate(task.due_date)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400">Rien d'urgent pour l'instant.</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                        <h2 className="text-sm font-semibold text-slate-700 mb-3">Récemment créées</h2>
                        {topRecent.length > 0 ? (
                            <ul className="space-y-2.5">
                                {topRecent.map((task) => (
                                    <li key={task.id} className="flex justify-between text-sm gap-2">
                                        <Link href={`/tasks/${task.id}`} className="text-slate-700 hover:text-emerald-700 truncate">
                                            {task.title}
                                        </Link>
                                        <span className="text-slate-400 shrink-0">{formatDate(task.created_at)}</span>
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
                                        <span className="text-red-400 shrink-0">{formatDate(task.due_date)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-slate-400">Aucune tâche en retard.</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}