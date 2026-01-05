import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChevronLeft, Book, Code, FileText } from 'lucide-react';

export function Docs() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link to="/">
                            <Button variant="ghost" size="icon">
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <span className="font-bold text-xl text-indigo-900">FRD Docs</span>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Documentation</h1>

                <div className="space-y-12">
                    {/* Getting Started */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <Book className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-semibold">Getting Started</h2>
                        </div>
                        <div className="prose text-gray-600 space-y-4">
                            <p>
                                Welcome to <strong>FRD Spedition</strong>, the advanced customs automation platform.
                                Follow these steps to create your first PEB document:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2">
                                <li>Register an account to clear the Guest status.</li>
                                <li>Navigate to the <strong>Dashboard</strong>.</li>
                                <li>Click <strong>"Smart Scan"</strong> to upload an Invoice or Packing List (PDF/Image).</li>
                                <li>Review the extracted data in the Editor.</li>
                                <li>Click <strong>"Validate & Submit"</strong> to generate the CEISA-compatible JSON.</li>
                            </ol>
                        </div>
                    </section>

                    {/* API Reference */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-violet-100 p-2 rounded-lg">
                                <Code className="h-6 w-6 text-violet-600" />
                            </div>
                            <h2 className="text-2xl font-semibold">API Integration</h2>
                        </div>
                        <div className="prose text-gray-600 space-y-4">
                            <p>
                                Integrate directly with the <strong>Single Window (AGSW/ATEZ)</strong> API:
                            </p>
                            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto space-y-2">
                                <div className="text-emerald-400"># Direct Export Job Creation</div>
                                <div>POST https://test-ogi.singlewindow.io/api/v2-0/direct-export-jobs/document</div>
                                <div className="mt-2 text-emerald-400"># Headers</div>
                                <div>Authorization: Bearer &lt;YOUR_TOKEN&gt;</div>
                                <div>Content-Type: application/json</div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Payload Example</h3>
                            <pre className="bg-gray-50 p-4 rounded-lg text-xs font-mono border overflow-x-auto">
                                {`{
  "customsCode": "351800",
  "consignee": {
    "nameTitle": "Company Name",
    "countryCode": "IT",
    "cityName": "Verona",
    "streetName": "Via Guascogna No 3"
  },
  "invoices": [
    {
      "invoiceNo": "INV2023001",
      "items": [
        {
          "hsCode": "690900000000",
          "itemDescription": "Ceramic items",
          "grossWeight": 15.1
        }
      ]
    }
  ]
}`}
                            </pre>
                        </div>
                    </section>

                    {/* File Formats */}
                    <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                                <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-semibold">Supported Formats</h2>
                        </div>
                        <ul className="grid grid-cols-2 bg-gray-50 p-4 rounded-xl gap-4">
                            <li className="flex items-center gap-2">✅ PDF (Text & Scanned)</li>
                            <li className="flex items-center gap-2">✅ JPG / JPEG Images</li>
                            <li className="flex items-center gap-2">✅ PNG Images</li>
                            <li className="flex items-center gap-2">✅ Excel / CSV (Beta)</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
