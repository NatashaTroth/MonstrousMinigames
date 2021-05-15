import QRCode from 'qrcode';

export async function generateQRCode(url: string, elementId: string) {
    QRCode.toCanvas(url, function (err, canvas) {
        const container = document.getElementById(elementId);
        container!.innerHTML = '';
        container!.appendChild(canvas);
    });
}
