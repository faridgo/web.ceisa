import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { LogIn } from 'lucide-react';
import { API_URL } from '../config';

export function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Save token and user info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/dashboard');
            } else {
                alert(data.error || "Login failed");
            }
        } catch (error) {
            console.error("Login Error:", error);
            alert("Network error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Link to="/" className="mb-8 flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <LogIn className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    FRD Spedition
                </span>
            </Link>

            <Card className="w-full max-w-md bg-white/80 backdrop-blur shadow-xl border-t-4 border-t-indigo-500">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                        <p className="text-gray-500 mt-2">Sign in to manage your documents</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <Input
                                type="email"
                                placeholder="you@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Create account
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
