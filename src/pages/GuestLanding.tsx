import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { FileCheck, BrainCircuit, Globe, ChevronRight, Mail, Play, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function GuestLanding() {
    const [showDemo, setShowDemo] = useState(false);

    return (
        <div className="flex flex-col font-sans">
            {/* Demo Modal */}
            {showDemo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                        <button
                            onClick={() => setShowDemo(false)}
                            className="absolute top-4 right-4 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="w-full h-full flex items-center justify-center text-white flex-col gap-4">
                            <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center animate-pulse">
                                <Play className="h-8 w-8 ml-1" />
                            </div>
                            <h3 className="text-2xl font-bold">Live Demo Preview</h3>
                            <p className="text-gray-400">Loading demo environment...</p>
                            {/* In a real app, embed YouTube/Video here */}
                        </div>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-36">
                <div className="absolute top-0 transform -translate-x-1/2 left-1/2 w-full h-full z-[-1] pointer-events-none">
                    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl" />
                    <div className="absolute top-[30%] right-[20%] w-[400px] h-[400px] bg-violet-300/30 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 mb-8 backdrop-blur-xl">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2 animate-pulse"></span>
                        FRD Spedition System v2.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-8 line-clamp-3 leading-tight">
                        Logistics & Customs <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                            Made Simple with FRD
                        </span>
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Automate your PIB/PEB documents with our advanced AI OCR. Seamless integration with Customs standards has never been easier.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-xl shadow-indigo-600/20 transition-all">
                                Start Free Trial <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Button
                            size="lg"
                            variant="secondary"
                            onClick={() => setShowDemo(true)}
                            className="h-14 px-8 text-lg rounded-full bg-white border border-gray-200 hover:bg-gray-50"
                        >
                            <Play className="mr-2 h-5 w-5 text-indigo-600" /> Watch Demo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white" id="features">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            We combine cutting-edge AI with deep knowledge of Indonesian customs regulations.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<BrainCircuit className="h-10 w-10 text-indigo-600" />}
                            title="AI-Powered OCR"
                            description="Upload invoices or packing lists and let our AI automatically extract data and fill your PEB/PIB forms instantly."
                        />
                        <FeatureCard
                            icon={<Globe className="h-10 w-10 text-violet-600" />}
                            title="Customs Ready"
                            description="Always up-to-date with the latest Indonesian customs schemes and validation rules. Never worry about compliance."
                        />
                        <FeatureCard
                            icon={<FileCheck className="h-10 w-10 text-emerald-600" />}
                            title="Smart Validation"
                            description="Real-time error checking prevents rejection. We validate HS codes, tax calculations, and required fields automatically."
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section className="py-24 bg-slate-50 relative overflow-hidden" id="pricing">
                <div className="container mx-auto px-4 max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-gray-500">Choose the plan that fits your business needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Starter */}
                        <PricingCard
                            title="Starter"
                            price="$0"
                            period="/ month"
                            features={['5 Documents / mo', 'Basic OCR', 'Email Support']}
                        />

                        {/* Pro */}
                        <PricingCard
                            title="Professional"
                            price="$49"
                            period="/ month"
                            features={['Unlimited Documents', 'Priority Processing', 'API Access', '24/7 Support']}
                            popular
                        />

                        {/* Enterprise */}
                        <PricingCard
                            title="Enterprise"
                            price="Custom"
                            period=""
                            features={['Custom Integration', 'Dedicated Manager', 'On-Premise Deployment', 'SLA Guarantee']}
                        />
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-12 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-6">Ready to streamline your logistics?</h2>
                            <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                                Get in touch with our team for a personalized demo or enterprise pricing.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <a href="mailto:sales@frdspedition.com">
                                    <Button size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 border-none w-full sm:w-auto">
                                        <Mail className="mr-2 h-5 w-5" /> Contact Sales
                                    </Button>
                                </a>
                                <Link to="/docs">
                                    <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white w-full sm:w-auto">
                                        Read Documentation
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <Card className="border-gray-100 shadow-lg hover:shadow-xl transition-shadow bg-white/50 backdrop-blur-sm">
            <CardHeader>
                <div className="mb-4 p-3 bg-gray-50 rounded-2xl w-fit">{icon}</div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-600 leading-relaxed">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function PricingCard({ title, price, period, features, popular }: any) {
    return (
        <Card className={`relative border-2 ${popular ? 'border-indigo-600 shadow-xl scale-105' : 'border-gray-100 shadow-md'} bg-white flex flex-col`}>
            {popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                    Most Popular
                </div>
            )}
            <CardHeader>
                <CardTitle className="text-xl text-gray-500 font-medium">{title}</CardTitle>
                <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{price}</span>
                    <span className="text-gray-400 ml-1">{period}</span>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <ul className="space-y-3">
                    {features.map((feat: string, i: number) => (
                        <li key={i} className="flex items-center text-sm text-gray-600">
                            <Check className="h-4 w-4 text-green-500 mr-2 shrink-0" />
                            {feat}
                        </li>
                    ))}
                </ul>
            </CardContent>
            <CardFooter>
                <Link to="/register" className="w-full">
                    <Button className={`w-full ${popular ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`} variant={popular ? 'primary' : 'outline'}>
                        Get Started
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}
