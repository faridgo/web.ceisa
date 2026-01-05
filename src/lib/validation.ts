export interface ValidationError {
    section: string;
    field: string;
    message: string;
}

export interface DocumentData {
    nomorAju?: string;
    kantorPabean?: string;
    jenisDokumen?: string;
    exporter?: string;
    importer?: string;
    // Add other fields as necessary
}

export function validateDocument(data: DocumentData): ValidationError[] {
    const errors: ValidationError[] = [];

    // 1. Header Validation
    if (!data.nomorAju || data.nomorAju.length !== 26) {
        if (!data.nomorAju) {
            errors.push({ section: 'header', field: 'nomorAju', message: 'Nomor Aju is required' });
        } else {
            // Mock length check (format: 000000-000000-20241229-000001) is 26 chars
            // relaxed for demo
        }
    }

    if (!data.kantorPabean) {
        errors.push({ section: 'header', field: 'kantorPabean', message: 'Kantor Pabean is required' });
    }

    // 2. Entitas Validation
    if (!data.exporter || data.exporter.trim() === '') {
        errors.push({ section: 'entitas', field: 'exporter', message: 'Nama Eksportir required' });
    } else if (data.exporter.length < 3) {
        errors.push({ section: 'entitas', field: 'exporter', message: 'Nama Eksportir is too short' });
    }

    if (!data.importer) {
        errors.push({ section: 'entitas', field: 'importer', message: 'Nama Importir required' });
    }

    // Mock Complex Rule: HS Code Validation (Simulation)
    // In a real app, this would check against a database of valid HS Codes

    return errors;
}
