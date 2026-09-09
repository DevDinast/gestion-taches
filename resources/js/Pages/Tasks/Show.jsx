import { Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from "react";
import { formatDate } from '@/Utils/tasks';
import AppLayout from '@/Layouts/AppLayout';

function Show({ tasks })
{
    const { flash } = usePage().props;
    const [showConfirm, setShowConfirm] = useState(false);
    const [visibleMessage, setVisibleMessage] = useState(flash.message);

    useEffect(() => {
        if (flash.message) {
            setVisibleMessage(flash.message);
            const timer = setTimeout(() => setVisibleMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [flash.message]);

    function handleDelete()
    {
        setShowConfirm(true);
    }

    return (
        <div className="flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-lg">
                {visibleMessage && (
                    <div className="mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 text-sm font-medium text-center">
                        {visibleMessage}
                    </div>
                )}

                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Détails de la tâche
                </h1>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <div className="mb-5">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                            Titre
                        </h2>
                        <p className="text-xl font-semibold text-gray-900">
                            {tasks.title}
                        </p>
                    </div>

                    <div className="mb-5">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                            Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            {tasks.description || 'Aucune description'}
                        </p>
                    </div>

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                                Échéance
                            </h2>
                            <p className="text-gray-600">
                                {tasks.due_date ? formatDate(tasks.due_date) : 'Aucune date définie'}
                            </p>
                        </div>

                        <span
                            className={
                                tasks.is_done
                                    ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                    : "rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700"
                            }
                        >
                            {tasks.is_done ? 'Terminée' : 'En cours'}
                        </span>
                    </div>

                   

                    <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                        <Link
                            href={`/tasks/${tasks.id}/edit`}
                            className="flex-1 text-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 transition"
                        >
                            Modifier
                        </Link>

                       
                    </div>

                    <Link
                        href="/tasks"
                        className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Retour à la liste
                    </Link>
                </div>
            </div>

            {showConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
                        <p className="text-gray-800 mb-5">
                            Êtes-vous sûr de vouloir supprimer cette tâche ?
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={() => router.delete(`/tasks/${tasks.id}`)}
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

Show.layout = (page) => <AppLayout children={page} />;

export default Show;