import { Link, usePage } from '@inertiajs/react';

export default function Sidebar() {
    const { auth } = usePage().props;
    const currentUrl = usePage().url;

    const links = [
        { href: '/dashboard', label: 'Tableau de bord' },
        { href: '/tasks', label: 'Toutes les tâches' },
    ];

    return (
        <aside className="w-60 shrink-0 bg-slate-800 text-slate-100 flex flex-col">
            <div className="px-6 py-6 border-b border-slate-700/60">
                <p className="text-lg font-semibold tracking-tight">TaskFlow</p>
                <p className="text-xs text-slate-400 mt-0.5">Gestion de tâches</p>
            </div>

            <nav className="flex-1 px-3 py-5 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={
                            currentUrl === link.href
                                ? "flex items-center gap-2.5 rounded-lg bg-slate-700/70 px-3 py-2 text-sm font-medium text-white"
                                : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700/40 hover:text-white transition"
                        }
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="px-6 py-4 border-t border-slate-700/60">
                <p className="text-sm font-medium text-white">{auth.user.name}</p>
                <Link href="/profile" className="text-xs text-slate-400 hover:text-slate-200">
                    Mon profil
                </Link>
            </div>
        </aside>
    );
}