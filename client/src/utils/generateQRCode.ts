import QRCode from 'qrcode';

export async function generateQRCode(url: string, elementId: string) {
    QRCode.toCanvas(url, function (err, canvas) {
        const container = document.getElementById(elementId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(canvas);
        }
    });
}
