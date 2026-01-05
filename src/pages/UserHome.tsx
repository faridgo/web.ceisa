import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Search, FileText, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Link } from 'react-router-dom';

export function UserHome() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500">Welcome back, User! Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">Import Data</Button>
                    <Link to="/dashboard/editor/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> New Document
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Pending Approvals"
                    value="12"
                    trend="+2 this week"
                    trendUp={true}
                    icon={<Clock className="h-5 w-5 text-amber-600" />}
                    color="bg-amber-50"
                />
                <StatsCard
                    title="Completed Exports"
                    value="145"
                    trend="+15% vs last month"
                    trendUp={true}
                    icon={<ArrowUpRight className="h-5 w-5 text-emerald-600" />}
                    color="bg-emerald-50"
                />
                <StatsCard
                    title="Imports Processing"
                    value="8"
                    trend="-2 vs yesterday"
                    trendUp={false}
                    icon={<ArrowDownRight className="h-5 w-5 text-blue-600" />}
                    color="bg-blue-50"
                />
            </div>

            {/* Recent Documents Table (Mock) */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Documents</CardTitle>
                    <div className="w-full max-w-xs">
                        <Input
                            placeholder="Search documents..."
                            icon={<Search className="h-4 w-4" />}
                            className="h-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Doc Number</th>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <DocumentRow id="PEB-2024-001" type="PEB (Export)" status="Submitted" date="Dec 29, 2024" />
                                <DocumentRow id="PIB-2024-089" type="PIB (Import)" status="Draft" date="Dec 28, 2024" />
                                <DocumentRow id="PEB-2024-002" type="PEB (Export)" status="Rejected" date="Dec 27, 2024" />
                                <DocumentRow id="PIB-2024-088" type="PIB (Import)" status="Approved" date="Dec 25, 2024" />
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, trend, trendUp, icon, color }: any) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${color}`}>
                        {icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend}
                    </span>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
                <div className="text-sm text-gray-500">{title}</div>
            </CardContent>
        </Card>
    )
}

function DocumentRow({ id, type, status, date }: any) {
    const statusStyles: any = {
        'Submitted': 'bg-blue-100 text-blue-700',
        'Draft': 'bg-gray-100 text-gray-700',
        'Approved': 'bg-emerald-100 text-emerald-700',
        'Rejected': 'bg-red-100 text-red-700',
    };

    return (
        <tr className="hover:bg-gray-50/50 transition-colors">
            <td className="px-6 py-4 font-medium text-gray-900">{id}</td>
            <td className="px-6 py-4 text-gray-600">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    {type}
                </div>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-500">{date}</td>
            <td className="px-6 py-4">
                <Button variant="ghost" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                    View
                </Button>
            </td>
        </tr>
    )
}
