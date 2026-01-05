import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createWorker } from 'tesseract.js';

import { parseOCRText } from '../lib/ocr';

export function OCRUpload() {
    const navigate = useNavigate();
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [scanning, setScanning] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [status, setStatus] = useState('');

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) handleFile(selectedFile);
    };

    const handleFile = async (f: File) => {
        setFile(f);
        setUploadProgress(0);
        await processFile(f);
    };

    const processFile = async (f: File) => {
        setScanning(true);
        setStatus('Initializing engine...');

        try {
            const worker = await createWorker('eng', 1, {
                logger: (m: any) => {
                    if (m.status === 'recognizing text') {
                        setUploadProgress(Math.round(m.progress * 100));
                    }
                }
            });

            let imageSource: string | File = f;

            // Handle PDF
            if (f.type === 'application/pdf') {
                setStatus('Converting PDF to Image...');
                const { convertPdfToImage } = await import('../lib/pdf-utils');
                imageSource = await convertPdfToImage(f);
            }

            setStatus('Recognizing text...');
            const ret = await worker.recognize(imageSource, {
                rotateAuto: true
            });

            setStatus('Parsing data...');
            const extractedData = parseOCRText(ret.data.text);
            console.log("Extracted Data:", extractedData);

            await worker.terminate();

            navigate('/dashboard/editor/new', {
                state: {
                    source: 'ocr',
                    ocrData: extractedData
                }
            });

        } catch (error) {
            console.error(error);
            setStatus('Error processing file.');
            setScanning(false);
        }
    };

    const startScan = () => {
        if (file) {
            processFile(file);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Document Scanner</h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Upload your Invoice, Packing List, or PEB draft. Our AI will extract entities, items, and values automatically.
                </p>
            </div>

            <Card className={`border-2 border-dashed transition-colors ${isDragging ? 'border-indigo-600 bg-indigo-100' : 'border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50'}`}>
                <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">

                    {!file && (
                        <div
                            className="flex flex-col items-center cursor-pointer"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="bg-white p-4 rounded-full shadow-sm mb-2">
                                <Upload className={`h-10 w-10 ${isDragging ? 'text-indigo-800' : 'text-indigo-600'}`} />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <span className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg inline-flex items-center">
                                        Choose File (PDF/Image)
                                    </span>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                <p className="text-sm text-gray-500">Supported: PDF, JPG, PNG</p>
                            </div>
                        </div>
                    )}

                    {file && !scanning && (
                        <div className="flex flex-col items-center">
                            <FileText className="h-16 w-16 text-indigo-600 mb-4" />
                            <p className="text-xl font-medium text-gray-900">{file.name}</p>
                            <p className="text-sm text-gray-500 mb-6">{(file.size / 1024 / 1024).toFixed(2)} MB</p>

                            <div className="flex gap-4">
                                <Button variant="ghost" onClick={() => setFile(null)}>Remove</Button>
                                <Button onClick={startScan}>
                                    <BrainCircuitIcon className="mr-2 h-4 w-4" /> Start AI Scan
                                </Button>
                            </div>
                        </div>
                    )}

                    {scanning && (
                        <div className="flex flex-col items-center py-8">
                            <div className="relative mb-6">
                                <div className="h-20 w-20 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-indigo-600">{uploadProgress}%</span>
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">{status || 'Analyzing Document...'}</h3>
                            <p className="text-gray-500 animate-pulse">Extracting Entities, HS Codes, and Values</p>
                        </div>
                    )}


                </CardContent>
            </Card>

            {/* Recent Scans (Mock) */}
            <div className="pt-8">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Recent Scans</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Invoice-001.pdf', 'PackingList-Oct.jpg', 'AirWayBill-Garuda.pdf'].map((doc, i) => (
                        <div key={i} className="flex items-center p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                            <FileText className="h-8 w-8 text-gray-400 mr-3" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{doc}</p>
                                <p className="text-xs text-gray-500">Scanned 2 hours ago</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function BrainCircuitIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" /><path d="M9 13a4.5 4.5 0 0 0 3-4" /><path d="M6.003 5.125A3 3 0 0 1 6.428 13" /><path d="M16.658 9.272a4 4 0 0 0-1.838-1.423" /><path d="M12 18a3 3 0 1 0-3.958 1.942 4 4 0 0 0 5.483 1.964" /><path d="M16 11a3 3 0 0 0 5.997-.125 4 4 0 0 0 2.526-5.77 4 4 0 0 0-.556-6.588A4 4 0 1 0 16 0Z" /><path d="M12 0a4.5 4.5 0 0 0-3 4" /><path d="M17.997 10.875A3 3 0 0 1 17.572 3" /><path d="M16 0a3 3 0 1 0 3.958 1.942 4 4 0 0 0-5.483 1.964" /></svg>
    )
}
