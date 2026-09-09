import { Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

function Create()
{
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        is_done: false,
    });

    function handleSubmit(e)
    {
        e.preventDefault();
        post('/tasks');
    }

    return (
        <div className="flex flex-col items-center px-4 py-10">
            <div className="w-full max-w-md">
                <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                    Créer une tâche
                </h1>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Titre
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                            )}
                        </div>

                        <div className="mb-5">
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                            ></textarea>
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                            )}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Date d'échéance
                            </label>
                            <input
                                type="date"
                                id="due_date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-3.5 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400"
                            />
                            {errors.due_date && (
                                <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-xl bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-2.5 transition"
                        >
                            {processing ? 'Création...' : 'Créer la tâche'}
                        </button>
                    </form>

                    <Link
                        href="/dashboard"
                        className="mt-4 block text-center text-sm text-gray-500 hover:text-gray-700"
                    >
                        ← Retour au dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}

Create.layout = (page) => <AppLayout children={page} />;

export default Create;