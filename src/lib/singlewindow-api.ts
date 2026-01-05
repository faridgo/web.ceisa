export interface DirectExportJobPayload {
    customsCode: string;
    exitCustomsCode: string;
    countryOfDispatch: string;
    portCode: string;
    consignor: {
        id: string; // NPWP or ID
    };
    consignee: {
        nameTitle: string;
        countryCode: string;
        cityName: string;
        streetName: string;
    };
    bankCode: string;
    declarantTaxNo: string;
    invoices: Invoice[];
}

export interface Invoice {
    invoiceNo: string;
    invoiceDate: string; // DD/MM/YYYY
    invoiceAmount: number;
    invoiceAmountCurrency: string;
    items: InvoiceItem[];
}

export interface InvoiceItem {
    itemLineNo: number;
    hsCode: string;
    originCountryCode: string;
    procedure: string; // e.g., "2100"
    incoterms: string;
    itemDescription: string;
    grossWeight: number;
    netWeight: number;
    packagingType: string;
    itemQuantity: number;
    itemQuantityUnit: string;
}

const PROXY_URL = "http://localhost:3001/api/proxy/single-window/submit";

export async function submitDirectExportJob(token: string, payload: DirectExportJobPayload) {
    console.log("Submitting via Proxy:", payload);

    try {
        const response = await fetch(PROXY_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, payload })
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API Error: ${response.status} - ${error}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Submission Failed:", error);
        throw error;
    }
}
