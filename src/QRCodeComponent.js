import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeComponent() {

    const handleDoubleClick = () => {
        const canvas = document.querySelector('canvas');
        const image = canvas.toDataURL('image/png', 1.0);

        const printWindow = window.open("", "", "width=400,height=200");
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir QR Code</title>
              <style>
                @page { size: A4; margin: 0; }
                body { display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin: 0; height: 200px; }
                img { width: 2.5cm; height: 2.5cm; }
                button {  font-size: 16px; cursor: pointer; padding: 10px 20px;margin: 10px; }
              </style>
            </head>
            <body>
              <img src="${image}" style="width: 2.5cm; height: 2.5cm; margin: 10px" />
            <div>
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Cancelar</button>
            </div>
            </body>
          </html>
        `);
        printWindow.document.close();
    }

    return (
        <div onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer', position: 'fixed', right: '0px', bottom: '0px', margin: '0px', padding: '0px' }}>
            <QRCode value={window.location.href} size={50} style={{ margin: '0px', padding: '0px' , border: '5px solid #ccc', borderRadius: '10px'}} />
        </div>
    );
}

export default QRCodeComponent;
