import QRCode from 'qrcode';

export async function generateQRCode(url: string, elementId: string) {
    QRCode.toCanvas(url, { type: 'svg' } as any, function (err, canvas) {
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(canvas);
        }
    });
}
