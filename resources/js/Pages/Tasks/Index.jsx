import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { getDueStatus, formatDate } from '@/Utils/tasks';
import AppLayout from '@/Layouts/AppLayout';

const ITEMS_PER_PAGE = 5;

function Index({ tasks }) {
    const { flash } = usePage().props;
    const [visibleMessage, setVisibleMessage] = useState(flash.message);
    const [statusFilter, setStatusFilter] = useState(null);
    const [dueFilter, setDueFilter] = useState(null);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (flash.message) {
            setVisibleMessage(flash.message);
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

    const filteredTasks = tasks.filter((task) => {
        const matchesStatus =
            statusFilter === null || statusFilter === 'all' ||
            (statusFilter === 'done' && task.is_done) ||
            (statusFilter === 'pending' && !task.is_done);

        const matchesDue =
            dueFilter === null || dueFilter === 'all' || getDueStatus(task) === dueFilter;

        return matchesStatus && matchesDue;
    });

    const totalPages = Math.max(1, Math.ceil(filteredTasks.length / ITEMS_PER_PAGE));

    // Remet la page à 1 dès que les filtres changent, pour ne jamais rester
    // bloqué sur une page qui n'existe plus après filtrage.
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, dueFilter]);

    // Sécurité : si jamais currentPage dépasse le nombre de pages disponibles
    // (ex: une tâche supprimée réduit le total), on la ramène à la dernière page valide.
    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    function toggleDone(task) {
        router.patch(`/tasks/${task.id}`, {
            title: task.title,
            description: task.description,
            due_date: task.due_date,
            is_done: !task.is_done,
        }, { preserveScroll: true, preserveState: false });
    }

    function handleDeleteConfirmed() {
        router.delete(`/tasks/${taskToDelete.id}`);
        setTaskToDelete(null);
    }

    return (
        <div className="px-8 py-8 max-w-5xl">
            <Head title="Toutes les tâches" />

            {visibleMessage && (
                <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium">
                    {visibleMessage}
                </div>
            )}

            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-semibold text-slate-900">Mes tâches</h1>
                <Link
                    href="/tasks/create"
                    className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-4 py-2 transition"
                >
                    + Nouvelle tâche
                </Link>
            </div>

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

            <div className="space-y-3">
                {paginatedTasks.length > 0 ? (
                    paginatedTasks.map((task) => {
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
                                            {task.due_date ? `Échéance : ${formatDate(task.due_date)}` : 'Aucune échéance'}
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

                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={`/tasks/${task.id}`}
                                        className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
                                    >
                                        Voir la tâche →
                                    </Link>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleDone(task)}
                                            className="rounded-lg border border-slate-300 text-slate-600 text-xs font-medium px-3 py-1.5 hover:border-slate-400 transition"
                                        >
                                            {task.is_done ? 'Marquer non terminée' : 'Marquer terminée'}
                                        </button>
                                        <button
                                            onClick={() => setTaskToDelete(task)}
                                            className="rounded-lg bg-red-50 text-red-600 text-xs font-medium px-3 py-1.5 hover:bg-red-100 transition"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
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

            {filteredTasks.length > ITEMS_PER_PAGE && (
                <div className="flex items-center justify-between mt-6">
                    <p className="text-xs text-slate-400">
                        Page {currentPage} sur {totalPages} ({filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''})
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="rounded-lg border border-slate-300 text-slate-600 text-sm font-medium px-3 py-1.5 hover:border-slate-400 disabled:opacity-40 disabled:hover:border-slate-300 transition"
                        >
                            ← Précédent
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={
                                    currentPage === page
                                        ? "rounded-lg bg-slate-800 text-white text-sm font-medium px-3 py-1.5"
                                        : "rounded-lg border border-slate-300 text-slate-600 text-sm font-medium px-3 py-1.5 hover:border-slate-400 transition"
                                }
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="rounded-lg border border-slate-300 text-slate-600 text-sm font-medium px-3 py-1.5 hover:border-slate-400 disabled:opacity-40 disabled:hover:border-slate-300 transition"
                        >
                            Suivant →
                        </button>
                    </div>
                </div>
            )}

            {taskToDelete && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <p className="text-gray-800 mb-5">
                            Supprimer la tâche « {taskToDelete.title} » ?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setTaskToDelete(null)}
                                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleDeleteConfirmed}
                                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium"
                            >
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} />;

export default Index;