import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { UserPlus } from 'lucide-react';
import { API_URL } from '../config';

export function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Registration successful! check your email (or console for demo link) for welcome message.");
                navigate('/login');
            } else {
                alert(data.error || "Registration failed");
            }
        } catch (error) {
            console.error("Register Error:", error);
            alert("Network error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <Link to="/" className="mb-8 flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-2 rounded-lg">
                    <UserPlus className="h-6 w-6" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                    FRD Spedition
                </span>
            </Link>

            <Card className="w-full max-w-md bg-white/80 backdrop-blur shadow-xl border-t-4 border-t-indigo-500">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                        <p className="text-gray-500 mt-2">Join us to automate your export documents</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <Input
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
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
                            <label className="text-sm font-medium text-gray-700">Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Register & Get Started'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
