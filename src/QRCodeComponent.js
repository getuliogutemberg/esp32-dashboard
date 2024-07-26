import React from 'react';
import QRCode from 'qrcode.react';

function QRCodeComponent() {


  const handleClick = () => {
    const canvas = document.querySelector('canvas');
    // Aumente o tamanho do canvas para melhorar a resolução
    const scale = 4; // Ajuste o fator de escala conforme necessário
    const width = canvas.width * scale;
    const height = canvas.height * scale;
    
    // Crie um novo canvas com maior resolução
    const highResCanvas = document.createElement('canvas');
    highResCanvas.width = width;
    highResCanvas.height = height;
    const ctx = highResCanvas.getContext('2d');
    
    // Redimensione o conteúdo do canvas original para o novo canvas
    ctx.drawImage(canvas, 0, 0, width, height);

    const image = highResCanvas.toDataURL('image/png', 1.0);

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
            window.addEventListener('blur', function() {
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
          img { width: 2.5cm; height: 2.5cm; }
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
        <div onDoubleClick={handleDoubleClick} onAuxClick={handleClick} style={{ cursor: 'pointer', position: 'fixed', right: '-195px', bottom: '-195px', margin: '0px', padding: '0px' }}>
            <QRCode value={window.location.href} size={512} style={{ margin: '0px', padding: '0px' , border: '15px solid #ccc', borderRadius: '10px', transform: 'scale(0.2)'}} />
        </div>
    );
}

export default QRCodeComponent;
