export function parseOCRText(text: string) {
    console.log("Raw OCR Text:", text);
    const data: any = {
        barang: []
    };

    // Helper regex
    const findValue = (regex: RegExp) => {
        const match = text.match(regex);
        return match ? match[1].trim() : null;
    };

    // 1. Invoice Number
    // Looks for "Invoice No", "INV", "No.", followed by alphanumeric
    data.nomorAju = findValue(/(?:Invoice\s*No|INV|Ref|No)[.:]\s*([A-Za-z0-9\-\/]+)/i);

    // 2. Date
    // Looks for standard date formats
    data.date = findValue(/(?:Date|Tanggal)[.:]\s*([0-9]{1,2}[-/.][0-9]{1,2}[-/.][0-9]{2,4})/i);

    // 3. Exporter / Entity (Heuristic: Look for "Exporter:" or first few lines typically contain company name)
    // We try to find a line starting with "Exporter" or just take the top-most uppercase line that's not a header
    const exporterMatch = text.match(/Exporter[.:\s]+([^\n]+)/i);
    if (exporterMatch) {
        data.exporter = exporterMatch[1].trim();
    } else {
        // Fallback: Try to find "PT." or "CV."
        const companyMatch = text.match(/(PT\.|CV\.|UD\.)\s*[A-Z\s]+/);
        if (companyMatch) data.exporter = companyMatch[0].trim();
    }

    // 4. Importer
    const importerMatch = text.match(/(?:Importer|Consignee|Bill To)[.:\s]+([^\n]+)/i);
    if (importerMatch) data.importer = importerMatch[1].trim();

    // 5. Items (Heuristic: Look for lines with currency or quantity patterns)
    // This is hard to do generically, but we can try to find lines with "USD" or numbers
    // Mocking item extraction for the demo if meaningful text is found
    if (text.toLowerCase().includes("shoes") || text.toLowerCase().includes("footwear")) {
        data.barang.push({
            id: Date.now(),
            hsCode: '6404.11.90',
            uraian: 'SPORTS FOOTWEAR',
            jumlah: 500,
            nilai: 15000
        });
    } else if (text.toLowerCase().includes("garment") || text.toLowerCase().includes("shirt")) {
        data.barang.push({
            id: Date.now(),
            hsCode: '6109.10.00',
            uraian: 'COTTON T-SHIRTS',
            jumlah: 1000,
            nilai: 5000
        });
    }
    // Always add a dummy item if nothing found, to show the grid works
    if (data.barang.length === 0) {
        data.barang.push({
            id: Date.now(),
            hsCode: '0000.00.00',
            uraian: 'DETECTED ITEM (Review Needed)',
            jumlah: 1,
            nilai: 0
        });
    }

    return data;
}
