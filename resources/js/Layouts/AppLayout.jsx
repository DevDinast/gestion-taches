import Sidebar from '@/Components/Sidebar';

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen bg-[#F7F7F5] flex">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}