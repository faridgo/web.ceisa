import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Search, Filter, Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function DocumentList() {
    const [documents, setDocuments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [localDraft, setLocalDraft] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch documents from API
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/documents');
                if (response.ok) {
                    const data = await response.json();
                    setDocuments(data);
                } else {
                    console.error("Failed to fetch documents");
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    // Check for local draft
    useEffect(() => {
        const draft = localStorage.getItem('documentDraft');
        if (draft) {
            try {
                setLocalDraft(JSON.parse(draft));
            } catch (e) {
                console.error("Invalid draft in LS");
            }
        }
    }, []);

    const filteredDocuments = documents.filter(doc =>
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
                    <p className="text-gray-500">Manage your Export (PEB) and Import (PIB) declarations.</p>
                </div>
                <div className="flex gap-2">
                    {localDraft && (
                        <Link to="/dashboard/editor/new">
                            <Button variant="outline" className="border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100">
                                <Clock className="mr-2 h-4 w-4" /> Resume Draft
                            </Button>
                        </Link>
                    )}
                    <Link to="/dashboard/editor/new">
                        <Button>+ Create New Declaration</Button>
                    </Link>
                </div>
            </div>

            <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-1">
                    <Input
                        placeholder="Search by Aju Number, Invoice, or Entity..."
                        icon={<Search className="h-4 w-4" />}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 font-medium">Nomor Aju</th>
                                <th className="px-6 py-4 font-medium">Tipe</th>
                                <th className="px-6 py-4 font-medium">Entitas</th>
                                <th className="px-6 py-4 font-medium">Tanggal</th>
                                <th className="px-6 py-4 font-medium">Status & Respon</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Loading documents...
                                    </td>
                                </tr>
                            ) : filteredDocuments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No documents found matching "{searchQuery}"
                                    </td>
                                </tr>
                            ) : (
                                filteredDocuments.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{doc.id}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${doc.type === 'PEB' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{doc.customer}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" /> {doc.date}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center gap-1.5 text-sm font-medium ${doc.status === 'Ready to Submit' ? 'text-green-600' :
                                                doc.status === 'Processing' ? 'text-amber-600' :
                                                    doc.status === 'Draft' ? 'text-indigo-600' :
                                                        'text-red-600'
                                                }`}>
                                                {doc.status === 'Ready to Submit' && <CheckCircle className="w-4 h-4" />}
                                                {doc.status === 'Processing' && <Clock className="w-4 h-4" />}
                                                {doc.status === 'Draft' && <FileText className="w-4 h-4" />}
                                                {doc.status === 'Rejected' && <AlertTriangle className="w-4 h-4" />}
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button variant="ghost" size="sm">Edit</Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
