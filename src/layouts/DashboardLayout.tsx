import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/layout/sidebar';
import { Navbar } from '../components/layout/navbar';
import { useEffect, useState } from 'react';

export function DashboardLayout() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log("No token found, redirecting to login");
            navigate('/login');
        } else {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [navigate]);

    if (isLoading) return <div className="p-10 flex justify-center">Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
