import * as pdfjsLib from 'pdfjs-dist';

// Set worker source (required for Vite/Webpack)
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function convertPdfToImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    // Get first page
    const page = await pdf.getPage(1);
    const scale = 2.0; // Higher scale for better OCR resolution
    const viewport = page.getViewport({ scale });

    // Render to canvas
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) throw new Error("Canvas context failed");

    await page.render({
        canvasContext: context,
        viewport: viewport
    } as any).promise;

    // Return Base64 image
    return canvas.toDataURL('image/png');
}
