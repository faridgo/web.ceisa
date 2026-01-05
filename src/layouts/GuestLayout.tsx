import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/navbar';

export function GuestLayout() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main>
                <Outlet />
            </main>
            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-100 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    <p>© 2024 FRD Spedition Solutions. Jakarta, Indonesia.</p>
                </div>
            </footer>
        </div>
    );
}
