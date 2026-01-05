import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { LayoutGrid } from 'lucide-react';

export function Navbar() {
    return (
        <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <LayoutGrid className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                            FRD Spedition
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/features" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Features</Link>
                        <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Pricing</Link>
                        <Link to="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Contact</Link>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-4">
                        <Link to="/login">
                            <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button>Get Started</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
