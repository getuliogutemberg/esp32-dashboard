import React from 'react';
import './App.css';
import Dashboard from './Dashboard.js';
import Stream from './Stream.js';
import ExternalLink from './ExternalLink.jsx';

export const apiUrl = process.env.REACT_APP_URL;
export const features = JSON.parse(process.env.REACT_APP_FEATURES);
export const description = JSON.parse(process.env.REACT_APP_DESCRIPTION);
export const apiData = process.env.REACT_APP_ENDPOINT_API_DATA;
export const apiLastData = process.env.REACT_APP_ENDPOINT_API_LASTDATA;


function App() {
 
  // const [positions, setPositions] = useState([]);

  // useEffect(() => {
  //   // Conectar ao servidor WebSocket
  //   const ws = new WebSocket('ws://esp32-data-api-1.onrender.com/ws');
  //   // const ws = new WebSocket('ws://localhost:3001/ws');
    
  //   // Evento de conexão estabelecida
  //   ws.addEventListener('open', function(event) {
  //     console.log('Conectado ao WebSocket');
     
      
  //   });

  //   // Evento de mensagem recebida do servidor
  //   ws.addEventListener('message', function(event) {
  //     console.log('Mensagem do servidor:', event.data);
  //     const data = JSON.parse(event.data);
  //     if (data.type === 'update_positions') {
  //       setPositions(data.positions);
  //     }
      
  //   });

  //   // Evento de desconexão
  //   ws.addEventListener('close', function(event) {
  //     console.log('Desconectado do WebSocket');
      
  //   });

  //   // Evento de erro
  //   ws.addEventListener('error', function(event) {
  //     console.error('Erro no WebSocket:', event);
     
  //   });

  //   const sendData = (type, data) => {
  //     const message = JSON.stringify({ type, ...data });
  //     if (ws && ws.readyState === WebSocket.OPEN) {
  //       ws.send(message);
  //     } else {
        
  //       console.warn('WebSocket não está aberto: ', type, data);
  //     }
  //   };
  //   const handleMouseMove = (event) => {
  //     const x = event.clientX;
  //     const y = event.clientY;
  //     sendData('mousemove', { x, y });
  //   };
  
  //   // Enviar eventos de clique
  //   const handleClick = (event) => {
  //     const x = event.clientX;
  //     const y = event.clientY;
  //     console.log(`Clique registrado em: X: ${x}, Y: ${y}`);
  //     sendData('click', { x, y });
  //   };
  
  //   // Enviar eventos de scroll
  //   const handleScroll = (event) => {
  //     const x = window.scrollX ;
  //     const y = window.scrollY;
  //     console.log(`Scroll registrado em: X: ${x}, Y: ${y}`);
  //     sendData('scroll', { x, y });
  //   };
  
  //   // Enviar eventos de tecla pressionada
  //   const handleKeyDown = (event) => {
  //     const key = event.key;
  //     console.log(`Tecla pressionada: ${key}`);
  //     sendData('keydown', { key });
  //   };
  
  //   // Enviar eventos de tecla liberada
  //   const handleKeyUp = (event) => {
  //     const key = event.key;
  //     console.log(`Tecla liberada: ${key}`);
  //     sendData('keyup', { key });
  //   };
    
  //   document.addEventListener('mousemove', handleMouseMove);
  //   document.addEventListener('click', handleClick);
  //   document.addEventListener('scroll', handleScroll);
  //   document.addEventListener('keydown', handleKeyDown);
  //   document.addEventListener('keyup', handleKeyUp);

  //   // Remove listeners ao desmontar o componente
  //   return () => {
  //     document.removeEventListener('mousemove', handleMouseMove);
  //     document.removeEventListener('click', handleClick);
  //     document.removeEventListener('scroll', handleScroll);
  //     document.removeEventListener('keydown', handleKeyDown);
  //     document.removeEventListener('keyup', handleKeyUp);
  //     ws.close();
  //   };

  
  // }, []);

  // Funções para enviar dados de diferentes eventos
  

  // Enviar eventos de movimento do mouse
  



  return (
    <div className="App">
      <header className="App-header" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'start-between', alignItems: 'center' }}>
        <ExternalLink href={apiUrl} >{'Painel Telemetrico'}</ExternalLink>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'start' }}>
          <Stream description={description} features={features} />
          <Dashboard apiData={apiData} apiLastData={apiLastData} />
        </div>
        {/* {positions.map(({ id, x, y,click,scroll,scrollX,scrollY}) => (
          <div key={id} style={{ position: 'absolute', left: x + scrollX, top: y + scrollY, backgroundColor: scroll ? 'green' :'red', width: 10, height: 10, borderRadius: '50%',scale: click ? 2 : 1 , transition: 'all 0.3s ease',}}>
            {id}
          </div>
        ))} */}
      </header>
    </div>
  );
}

export default App;
