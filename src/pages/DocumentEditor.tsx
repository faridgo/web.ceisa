import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Save, Send, AlertCircle, ChevronLeft, Cloud, WifiOff, RefreshCw } from 'lucide-react';

import { validateDocument, type ValidationError } from '../lib/validation';
import { submitDirectExportJob, type DirectExportJobPayload } from '../lib/singlewindow-api';

// Form Sections
const SECTIONS = [
    { id: 'header', label: 'Header' },
    { id: 'entitas', label: 'Entitas' },
    { id: 'barang', label: 'Barang' },
    { id: 'angkut', label: 'Pengangkutan' },
    { id: 'kemasan', label: 'Kemasan & Peti' },
    { id: 'pungutan', label: 'Pungutan' },
];

export function DocumentEditor() {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('header');
    const [errors, setErrors] = useState<ValidationError[]>([]);

    // Sync State
    const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'local' | 'error'>('synced');

    // Form Data State
    const [formData, setFormData] = useState<any>(location.state?.data || {});

    // Load draft from localStorage on mount if no OCR data
    useEffect(() => {
        if (location.state?.ocrData) {
            setFormData((prev: any) => ({
                ...prev,
                ...location.state.ocrData
            }));
        } else {
            const savedDraft = localStorage.getItem('documentDraft');
            if (savedDraft) {
                try {
                    const parsedDraft = JSON.parse(savedDraft);
                    setFormData(parsedDraft);
                    console.log("Draft loaded from local storage");
                } catch (e) {
                    console.error("Failed to parse draft", e);
                }
            }
        }
    }, [location.state]);

    const saveToDatabase = async (currentData: any) => {
        setSyncStatus('saving');
        const docId = currentData.nomorAju || `DRAFT-${Date.now()}`;
        const payload = {
            id: docId,
            type: currentData.jenisDokumen || 'PEB',
            customer: currentData.exporter || 'Unknown',
            date: new Date().toISOString().split('T')[0],
            status: 'Draft',
            data: currentData
        };

        try {
            const response = await fetch('http://localhost:3001/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                console.log("Saved to database");
                setSyncStatus('synced');
            } else {
                setSyncStatus('error');
            }
        } catch (e) {
            console.error("Failed to save", e);
            setSyncStatus('local');
        }
    };

    // Auto-save debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (Object.keys(formData).length > 0) {
                // 1. Save to Local Storage (Instant backup)
                localStorage.setItem('documentDraft', JSON.stringify(formData));

                // 2. Save to Database (Cloud sync)
                saveToDatabase(formData);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [formData]);

    const saveDraft = () => {
        saveToDatabase(formData);
        alert("Document saved to Database!");
    };

    const handleSubmit = async () => {
        // 1. Validate
        const newErrors = validateDocument(formData);
        if (newErrors.length > 0) {
            setErrors(newErrors);
            alert(`Found ${newErrors.length} validation errors. Fix them before submitting.`);
            return;
        }

        // 2. Transformer: Convert App State -> Single Window Payload
        const payload: DirectExportJobPayload = {
            customsCode: formData.kantorPabean?.split(' - ')[0] || "040300",
            exitCustomsCode: formData.kantorPabean?.split(' - ')[0] || "040300",
            countryOfDispatch: "ID",
            portCode: "IDJKT",
            consignor: { id: formData.exporter || "000000000" },
            consignee: {
                nameTitle: formData.importer?.name || formData.importer || "Unknown",
                countryCode: formData.importer?.countryCode || "SG",
                cityName: formData.importer?.cityName || "Singapore",
                streetName: formData.importer?.streetName || "12 5th Ave"
            },
            bankCode: "000",
            declarantTaxNo: "000000000",
            invoices: [{
                invoiceNo: "INV-" + Date.now(),
                invoiceDate: new Date().toISOString().split('T')[0],
                invoiceAmount: 15000,
                invoiceAmountCurrency: "USD",
                items: (formData.barang || []).map((item: any) => ({
                    itemLineNo: item.id,
                    hsCode: item.hsCode,
                    originCountryCode: "ID",
                    procedure: "1000",
                    incoterms: "FOB",
                    itemDescription: item.uraian,
                    grossWeight: 10,
                    netWeight: 8,
                    packagingType: "CT",
                    itemQuantity: Number(item.jumlah),
                    itemQuantityUnit: "PCE"
                }))
            }]
        };

        // 3. Auth Prompt
        const token = window.prompt("Enter Single Window Bearer Token (Prototype Mode):");
        if (!token) return;

        // 4. Submit
        try {
            setSyncStatus('saving');
            const result = await submitDirectExportJob(token, payload);
            console.log("Submission Result:", result);
            alert("Success! Job Order ID: " + (result.jobOrderId || "Mock-ID"));
            setSyncStatus('synced');
        } catch (e: any) {
            console.error(e);
            alert("Submission Failed: " + e.message);
            setSyncStatus('error');
        }
    };

    const getSectionErrors = (sectionId: string) => {
        return errors.filter(e => e.section === sectionId).length;
    };

    return (
        <div className="space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            PEB - Ekspor
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Draft</span>
                        </h1>
                        <p className="text-xs text-gray-500">Aju: {formData.nomorAju || '000000-000000-20241229-XXXXXX'}</p>
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <div className="mr-4 text-sm font-medium">
                        {syncStatus === 'synced' && <span className="text-green-600 flex items-center gap-1"><Cloud className="h-4 w-4" /> Synced</span>}
                        {syncStatus === 'saving' && <span className="text-gray-500 flex items-center gap-1"><RefreshCw className="h-4 w-4 animate-spin" /> Saving...</span>}
                        {syncStatus === 'local' && <span className="text-amber-600 flex items-center gap-1"><WifiOff className="h-4 w-4" /> Saved Locally</span>}
                        {syncStatus === 'error' && <span className="text-red-600 flex items-center gap-1"><AlertCircle className="h-4 w-4" /> Sync Failed</span>}
                    </div>
                    <Button variant="outline" onClick={saveDraft}>
                        <Save className="mr-2 h-4 w-4" /> Save Draft
                    </Button>
                    <Button onClick={handleSubmit}>
                        <Send className="mr-2 h-4 w-4" /> Validate & Submit
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Navigation */}
                <div className="lg:w-64 flex-shrink-0">
                    <nav className="space-y-1 sticky top-24">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-transparent'
                                    }`}
                            >
                                {section.label}
                                {/* Validation Error Badge */}
                                {getSectionErrors(section.id) > 0 && (
                                    <span className="ml-2 bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {getSectionErrors(section.id)}
                                    </span>
                                )}
                            </button>
                        ))}

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-blue-800">
                                    <p className="font-bold mb-1">AI Assistant</p>
                                    <p>I noticed the Gross Weight in the Header doesn't match the sum of items. Check "Barang" section.</p>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Form Content Area */}
                <div className="flex-1">
                    <Card className="min-h-[600px] border-gray-200 shadow-sm">
                        <CardContent className="p-8">
                            {/* Render Active Section */}
                            {activeSection === 'header' && <HeaderForm initialData={formData} errors={errors} />}
                            {activeSection === 'entitas' && <EntitasForm initialData={formData} setFormData={setFormData} errors={errors} />}
                            {activeSection === 'barang' && <BarangForm formData={formData} setFormData={setFormData} />}
                            {activeSection === 'angkut' && <div className="text-center text-gray-400 py-10">Transport Section Placeholder</div>}
                            {activeSection === 'kemasan' && <div className="text-center text-gray-400 py-10">Packaging Section Placeholder</div>}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// Sub-components (Simplified for brevity)
function HeaderForm({ initialData, errors }: any) {
    const getError = (field: string) => errors.find((e: any) => e.section === 'header' && e.field === field)?.message;

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xl font-semibold border-b pb-4 mb-6">Informasi Header</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kantor Pabean</label>
                    <input
                        type="text"
                        className={`w-full p-2 border rounded-md ${getError('kantorPabean') ? 'border-red-500 bg-red-50' : ''}`}
                        defaultValue={initialData.kantorPabean || "040300 - KPU TANJUNG PRIOK"}
                    />
                    {getError('kantorPabean') && <p className="text-xs text-red-500">{getError('kantorPabean')}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Jenis Dokumen</label>
                    <select className="w-full p-2 border rounded-md" defaultValue={initialData.jenisDokumen}>
                        <option value="3.0 - PEB">3.0 - PEB (Pemberitahuan Ekspor Barang)</option>
                        <option value="bc30">BC 3.0</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Jenis Ekspor</label>
                    <select className="w-full p-2 border rounded-md">
                        <option>1 - Ekspor Biasa</option>
                        <option>2 - Ekspor yang akan diimpor kembali</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Kategori Ekspor</label>
                    <select className="w-full p-2 border rounded-md">
                        <option>1 - Umum</option>
                        <option>2 - Dikenakan Bea Keluar</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cara Dagang</label>
                    <select className="w-full p-2 border rounded-md">
                        <option>1 - Outright Sale</option>
                        <option>2 - Konsinyasi</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cara Bayar</label>
                    <select className="w-full p-2 border rounded-md">
                        <option>1 - Tunai</option>
                        <option>2 - Kredit</option>
                        <option>3 - Letter of Credit (L/C)</option>
                    </select>
                </div>
            </div>
        </div>
    )
}

function EntitasForm({ initialData, setFormData, errors }: any) {
    const getError = (field: string) => errors.find((e: any) => e.section === 'entitas' && e.field === field)?.message;

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-indigo-700">Eksportir</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-600">Nama Perusahaan</label>
                        <input
                            className={`w-full p-2 border rounded ${getError('exporter') ? 'border-red-500 bg-red-50' : ''}`}
                            defaultValue={initialData.exporter || "PT. SAMPLE EXPORTER"}
                        />
                        {getError('exporter') && <p className="text-xs text-red-500">{getError('exporter')}</p>}
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">NPWP</label>
                        <input className="w-full p-2 border rounded" defaultValue="01.234.567.8-123.000" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Alamat</label>
                        <input className="w-full p-2 border rounded" defaultValue="JL. INDUSTRI RAYA NO. 88, JAKARTA UTARA" />
                    </div>
                </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4 text-indigo-700">Importir (Consignee)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Company Name</label>
                        <input
                            className={`w-full p-2 border rounded ${getError('importer.name') ? 'border-red-500 bg-red-50' : ''}`}
                            defaultValue={initialData.importer?.name || initialData.importer || "GLOBAL TRADING CORP"}
                            onChange={(e) => setFormData({ ...initialData, importer: { ...initialData.importer, name: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">Country Code</label>
                        <input
                            className="w-full p-2 border rounded"
                            defaultValue={initialData.importer?.countryCode || "SG"}
                            placeholder="e.g. SG, US"
                            onChange={(e) => setFormData({ ...initialData, importer: { ...initialData.importer, countryCode: e.target.value } })}
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600">City Name</label>
                        <input
                            className="w-full p-2 border rounded"
                            defaultValue={initialData.importer?.cityName || "SINGAPORE"}
                            placeholder="City"
                            onChange={(e) => setFormData({ ...initialData, importer: { ...initialData.importer, cityName: e.target.value } })}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Street Address</label>
                        <input
                            className="w-full p-2 border rounded"
                            defaultValue={initialData.importer?.streetName || "12 5TH AVENUE"}
                            placeholder="Street Name"
                            onChange={(e) => setFormData({ ...initialData, importer: { ...initialData.importer, streetName: e.target.value } })}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function BarangForm({ formData, setFormData }: any) {
    const items = formData.barang || [];

    const handleAddItem = () => {
        const newItem = {
            id: Date.now(),
            hsCode: '0000.00.00',
            uraian: 'New Item Description',
            jumlah: 0,
            nilai: 0
        };
        setFormData({ ...formData, barang: [...items, newItem] });
    };

    const handleRemoveItem = (id: number) => {
        setFormData({ ...formData, barang: items.filter((item: any) => item.id !== id) });
    };

    const totalFOB = items.reduce((sum: number, item: any) => sum + Number(item.nilai), 0);

    return (
        <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Daftar Barang</h2>
                <Button size="sm" onClick={handleAddItem}>
                    + Tambah Barang
                </Button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-4 py-3">No</th>
                            <th className="px-4 py-3">HS Code</th>
                            <th className="px-4 py-3">Uraian Barang</th>
                            <th className="px-4 py-3">Jumlah</th>
                            <th className="px-4 py-3">Nilai (FOB)</th>
                            <th className="px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    No items added yet. Click "Tambah Barang" to start.
                                </td>
                            </tr>
                        )}
                        {items.map((item: any, index: number) => (
                            <tr key={item.id}>
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3 font-mono text-blue-600">
                                    <input
                                        className="bg-transparent border-b border-transparent focus:border-indigo-500 outline-none w-24"
                                        value={item.hsCode}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].hsCode = e.target.value;
                                            setFormData({ ...formData, barang: newItems });
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        className="bg-transparent border-b border-transparent focus:border-indigo-500 outline-none w-full"
                                        value={item.uraian}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].uraian = e.target.value;
                                            setFormData({ ...formData, barang: newItems });
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    <input
                                        type="number"
                                        className="bg-transparent border-b border-transparent focus:border-indigo-500 outline-none w-20"
                                        value={item.jumlah}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].jumlah = Number(e.target.value);
                                            setFormData({ ...formData, barang: newItems });
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-3">
                                    USD
                                    <input
                                        type="number"
                                        className="bg-transparent border-b border-transparent focus:border-indigo-500 outline-none w-24 ml-1"
                                        value={item.nilai}
                                        onChange={(e) => {
                                            const newItems = [...items];
                                            newItems[index].nilai = Number(e.target.value);
                                            setFormData({ ...formData, barang: newItems });
                                        }}
                                    />
                                </td>
                                <td className="px-4 py-3 text-red-500 cursor-pointer hover:font-bold" onClick={() => handleRemoveItem(item.id)}>
                                    Hapus
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end pt-4 font-medium text-lg">
                Total FOB: USD {totalFOB.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
        </div>
    )
}
