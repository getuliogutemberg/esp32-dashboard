import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeComponent() {


  const handleClick = () => {
    const canvas = document.querySelector('canvas');
    const image = canvas.toDataURL('image/png', 1.0);

    // Abrir uma nova janela em tela cheia
    const fullscreenWindow = window.open("about:blank", "", "fullscreen=yes,menubar=no,scrollbars=no,resizable=no,status=no,toolbar=no,location=no");
    fullscreenWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR Code</title>
          <style>
            body { display: flex; justify-content: center; align-items: center; margin: 0; height: 100vh; background-color: white; overflow: hidden; }
            img { width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${image}" />
          <script>
            // Fechar a janela quando ela perder o foco
            window.addEventListener('click', function() {
              window.close();
            });
          </script>
        </body>
      </html>
    `);
    fullscreenWindow.document.close();
}
const handleDoubleClick = () => {
  const canvas = document.querySelector('canvas');
  const image = canvas.toDataURL('image/png', 1.0);

  // Abrir a janela menor com a imagem e botões, sem informações adicionais
  const printWindow = window.open("", "", "width=400,height=200,scrollbars=no,resizable=no,toolbar=no,location=no,directories=no,status=no");
  printWindow.document.write(`
    <html>
      <head>
        <title>Imprimir QR Code</title>
        <style>
          body { display: flex; flex-direction: column; justify-content: center; align-items: center; margin: 0; height: 100vh; background-color: white; }
          img { width: 2.5cm; height: 2.5cm; cursor: pointer; }
          button { font-size: 16px; cursor: pointer; padding: 10px 20px; margin: 10px; }
        </style>
      </head>
      <body>
        <img src="${image}" onclick="window.opener.handleClick()" />
        <div>
          <button onclick="window.print()">Imprimir</button>
          <button onclick="window.close()">Cancelar</button>
        </div>
        <script>
          // Fechar a janela quando ela perder o foco
          window.addEventListener('blur', function() {
            window.close();
          });
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}


    

    return (
        <div onDoubleClick={handleDoubleClick} onAuxClick={handleClick} style={{ cursor: 'pointer', position: 'fixed', right: '0px', bottom: '0px', margin: '0px', padding: '0px' }}>
            <QRCode value={window.location.href} size={50} style={{ margin: '0px', padding: '0px' , border: '5px solid #ccc', borderRadius: '10px'}} />
        </div>
    );
}

export default QRCodeComponent;
