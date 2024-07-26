import React, { useEffect, useState, useRef } from 'react';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';
import QRCodeComponent from './QRCodeComponent.js';

import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
  ResponsiveContainer,
  Bar,
  // Area,
} from 'recharts';

const Dashboard = () => {
  const lastReadingsRef = useRef(null);
  const allReadingsRef = useRef([{
    timestamp: new Date().getTime(),
    luz: NaN,
    temperatura: NaN, 
    umidade: NaN ,
  }]);
  const [zoomStartIndex, setZoomStartIndex] = useState(allReadingsRef.current.length > 10 ? allReadingsRef.current.length - 10 : 0);
  const [zoomEndIndex, setZoomEndIndex] = useState(0);
  const [userZoom, setUserZoom] = useState(false);
  const maxLuzValue = useRef(1); // Inicializado com 1 para evitar divisão por zero
  const maxTemperaturaValue = useRef(1); // Inicializado com 1 para evitar divisão por zero
  const minTemperaturaValue = useRef(0); // Inicializado com 0 para evitar divisão por zero
  const minLuzValue = useRef(0); // Inicializado com 0 para evitar divisão por zero
  const minUmidadeValue = useRef(0); // Inicializado com 0 para evitar divisão por zero
  const maxUmidadeValue = useRef(1); // Inicializado com 1 para evitar divisão por zero
  const [lastDataDelay, setLastDataDelay] = useState(0);
  const [isDataOnline, setIsDataOnline] = useState(false);
  const [logs, setLogs] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  // const socketRef = useRef(null);

  const handleBrushChange = ({ startIndex, endIndex }) => {
    setUserZoom(true); // Indica que o usuário alterou manualmente o Brush
    setZoomStartIndex(startIndex);
    if (endIndex === allReadingsRef.current.length - 1) {
      setZoomEndIndex(allReadingsRef.current.length - 1);
    } else {
      setZoomEndIndex(endIndex);
    }
  };

  const handleZoomButtonClick = () => {
    setZoomStartIndex(allReadingsRef.current.length > 10 ? allReadingsRef.current.length - 10 : 0); // Se houver mais de 10 leituras, zoom inicia em 10 leituras atras
    setZoomEndIndex(allReadingsRef.current.length - 1);
    setUserZoom(false); // Indica que o usuário alterou manualmente o Zoom
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data");
        allReadingsRef.current = response.data;
        setLogs(prevLogs => [
          ...prevLogs,
          `Carregando historicos!`
        ]);
        // define maxLuz
        const maxLuz = Math.max(...response.data.map(entry => entry.luz));
        maxLuzValue.current = maxLuz;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Luz maxima: ${maxLuz}`
        // ]);

        // define maxTemperatura
        const maxTemperatura = Math.max(...response.data.map(entry => entry.temperatura));
        maxTemperaturaValue.current = maxTemperatura;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Temperatura maxima: ${maxTemperatura}`
        // ]);
        // define maxUmidade
        const maxUmidade = Math.max(...response.data.map(entry => entry.umidade));
        maxUmidadeValue.current = maxUmidade;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Umidade maxima: ${maxUmidade}`
        // ])

        // define minTemperatura
        const minTemperatura = Math.min(...response.data.map(entry => entry.temperatura));
        minTemperaturaValue.current = minTemperatura;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Temperatura minima: ${minTemperatura}`
        // ])
        // define minLuz
        const minLuz = Math.min(...response.data.map(entry => entry.luz));
        minLuzValue.current = minLuz;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Luz minima: ${minLuz}`
        // ])
        // define minUmidade
        const minUmidade = Math.min(...response.data.map(entry => entry.umidade));
        minUmidadeValue.current = minUmidade;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Umidade minima: ${minUmidade}`
        // ])
       

        // Define zoomStartIndex e zoomEndIndex
        if (response.data.length > 10) {
          setZoomStartIndex(response.data.length - 10);
          setZoomEndIndex(response.data.length - 1);
        } 
      } catch (error) {
        console.error('Erro ao buscar todas as leituras:', error);
        setLogs(prevLogs => [
          ...prevLogs,
          `Erro ao buscar todas as leituras: ${error.message}`
        ]);
      }
    };
    
    fetchInitialData();
    
    
  }, []);

  useEffect(() => {
    const fetchLastReading = async () => {
      const checkDataDelay = (timestamp) => {
        const timestampDate = new Date(timestamp);
        const now = new Date();
        const lastDataDelay = now - timestampDate;
        setLastDataDelay(lastDataDelay);
        setIsDataOnline(lastDataDelay <= 20000);
        lastDataDelay > 20000 && setLogs(prevLogs => [
          ...prevLogs,
           `O servidor parece estar offline`
        ]);
      };

      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        checkDataDelay(response.data.timestamp);
        if (response.data.timestamp > allReadingsRef.current[allReadingsRef.current.length - 1].timestamp) {
          lastReadingsRef.current = response.data;
          allReadingsRef.current = [...allReadingsRef.current, response.data];
          setLogs(prevLogs => [
            ...prevLogs,
            `Nova leitura recebida: Umidade: ${response.data.umidade}, Temperatura: ${response.data.temperatura}, Luz: ${response.data.luz}`
          ]);
        }
        
        if (allReadingsRef.current.length && !userZoom) {
          setZoomStartIndex(allReadingsRef.current.length > 10 ? allReadingsRef.current.length - 10 : 0);
          setZoomEndIndex(allReadingsRef.current.length - 1);
        } 
        // define maxLuz 
        const maxLuz = Math.max(...allReadingsRef.current.map(entry => entry.luz));
        maxLuzValue.current = maxLuz;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Maxima Luz: ${maxLuz}`
        // ]);

        // define maxTemperatura
        const maxTemperatura = Math.max(...allReadingsRef.current.map(entry => entry.temperatura));
        maxTemperaturaValue.current = maxTemperatura;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Maxima Temperatura: ${maxTemperatura}`
        // ]);

        // define maxUmidade
        const maxUmidade = Math.max(...allReadingsRef.current.map(entry => entry.umidade));
        maxUmidadeValue.current = maxUmidade;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Maxima umidade: ${maxUmidade}`
        // ]);

        // define minTemperatura
        const minTemperatura = Math.min(...allReadingsRef.current.map(entry => entry.temperatura));
        minTemperaturaValue.current = minTemperatura;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Minima temperatura: ${minTemperatura}`
        // ]);
        // define minLuz
        const minLuz = Math.min(...allReadingsRef.current.map(entry => entry.luz));
        minLuzValue.current = minLuz;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Minima luz: ${minLuz}`
        // ]);

        // define minUmidade
        const minUmidade = Math.min(...allReadingsRef.current.map(entry => entry.umidade));
        minUmidadeValue.current = minUmidade;
        // setLogs(prevLogs => [
        //   ...prevLogs,
        //   `Minima umidade: ${minUmidade}`
        // ]);

      } catch (error) {
        console.error('Erro ao buscar última leitura:', error);
        setLogs(prevLogs => [
          ...prevLogs,
          `Erro ao buscar último leitura: ${error.message}`
        ]);
      }
    };

    const interval = setInterval(() => {
      fetchLastReading();
    }, 5000);

    return () => clearInterval(interval);
  }, [userZoom]);

  // useEffect(() => {
  //   socketRef.current = io("https://esp32-data-api-1.onrender.com:3000");

  //   socketRef.current.on('newData', (newData) => {
  //     allReadingsRef.current = [...allReadingsRef.current, newData];
  //     if (!userZoom) {
  //       setZoomStartIndex(allReadingsRef.current.length > 10 ? allReadingsRef.current.length - 10 : 0);
  //       setZoomEndIndex(allReadingsRef.current.length - 1);
  //     }

  //     const maxLuz = Math.max(...allReadingsRef.current.map(entry => entry.luz));
  //     maxLuzValue.current = maxLuz;
  //   });

  //   return () => {
  //     socketRef.current.disconnect();
  //   };
  // }, [userZoom]);

  const handleDeleteData = async () => {
    const confirmDelete = window.confirm("Os dados serão apagados permanentemente. Deseja continuar?");
  
    if (confirmDelete) {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        allReadingsRef.current = [response.data];
        lastReadingsRef.current = null;
        setZoomStartIndex(0);
        setZoomEndIndex(0);
        await axios.delete("https://esp32-data-api-1.onrender.com/data");
        alert('Dados apagados com sucesso.');
      } catch (error) {
        console.error('Erro ao apagar dados:', error);
      }
    } else {
      alert('Ação de exclusão cancelada.');
    }
  };

  if (allReadingsRef.current.length === 0) {
    setLogs(prevLogs => [
      ...prevLogs,
      `Nenhum dado encontrado. Por favor, aguarde...`
    ]);
    return <div style={{marginRight: '30px'}}>Consultando dados... </div>;

  }

  const convertMilliseconds = (ms) => {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
   
    return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;

  };

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
  

  

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '0 auto' }}>
      <div style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: isDataOnline ? 'green' : 'red', padding: '5px', borderRadius: '5px', left: '10px', top: '10px' }}>
        {isDataOnline ? 'Online.' : `Offline a ${convertMilliseconds(lastDataDelay)}.`}
      </div>
     
  <div 
        title='Menu'
        onClick={() => setOpenMenu(!openMenu)}
        style={{ color: openMenu ? 'white':'transparent', fontSize: '14px', position: 'fixed', backgroundColor: openMenu ? '#111' : 'transparent', padding: '5px', borderRadius: '5px', right: '10px', top: '10px', cursor: 'pointer' }}
      > 
        Menu
      </div>

        <div 
        onClick={handleDeleteData}
        style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: 'red', padding: '5px', borderRadius: '5px', right: '10px', top: '50px', cursor: 'pointer', display: openMenu ? 'block' : 'none' }}
      >
        Apagar dados
      </div>

      

      <div 
        onClick={handleClick}
        style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: '#111', padding: '5px', borderRadius: '5px', right: '10px', top: '90px', cursor: 'pointer', display: openMenu ? 'block' : 'none' }}
      >
        QR Code
      </div>
      <div 
        onClick={handleDoubleClick}
        style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: '#111', padding: '5px', borderRadius: '5px', right: '10px', top: '130px', cursor: 'pointer', display: openMenu ? 'block' : 'none' }}
      >
        Imprimir QR Code
      </div>


    
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3>Umidade</h3>
          <GaugeChart id="gauge-humidity" 
            nrOfLevels={1}
            animate={false}
            animDelay={0}
            animateDuration={5000}
            formatTextValue={value => `${value === 0 ? "0 %" : allReadingsRef.current[allReadingsRef.current.length - 1].umidade ? (value*maxUmidadeValue.current/100).toFixed(2) + ' %' : "Indisponível"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].umidade / maxUmidadeValue.current}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* deve ficar piscando */}

          <span style={{ fontSize: '12px',color:'rgba(255, 0, 0, 1)' ,transition: 'color 0.5s ease-in-out'}}>{allReadingsRef.current[allReadingsRef.current.length - 1].umidade === 0 ? "0 %" : allReadingsRef.current[allReadingsRef.current.length - 1].umidade ? `${allReadingsRef.current[allReadingsRef.current.length - 1].umidade} %` : "Offline"}</span>
          <span style={{ fontSize: '12px' }}>Umidade maxima: 100 %</span>
          <span style={{ fontSize: '12px', color: 'rgba(0, 0, 255, 1)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'none' }}>Maxima: {maxUmidadeValue.current} %</span>
          <span style={{ fontSize: '12px', color: 'rgba(0, 0, 255, 0.5)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'none' }}>Minima: {minUmidadeValue.current} %</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
            nrOfLevels={10} 
            animate={false}
            animDelay={500}
            animateDuration={5000}
            formatTextValue={value => `${value === 0 ? "0 °C" : allReadingsRef.current[allReadingsRef.current.length - 1].temperatura ? (value*maxTemperaturaValue.current/100).toFixed(2) + ' °C' : "Indisponível"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].temperatura / maxTemperaturaValue.current}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* deve ficar piscando */}
          
          <span style={{ fontSize: '12px',color:'rgba(255, 0, 0, 1)' ,transition: 'color 0.5s ease-in-out'}}>{allReadingsRef.current[allReadingsRef.current.length - 1].temperatura === 0 ? "0 °C" : allReadingsRef.current[allReadingsRef.current.length - 1].temperatura ? `${allReadingsRef.current[allReadingsRef.current.length - 1].temperatura} °C` : "Offline"}</span>
          
          <span style={{ fontSize: '12px' }}>Temperatura maxima: 100 °C</span>
          <span style={{ fontSize: '12px',color: "rgba(255, 0, 0, 1)",transition: 'color 0.5s ease-in-out',display: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'none' }}>Maxima: {maxTemperaturaValue.current} °C</span>
          <span style={{ fontSize: '12px',color: "rgba(0, 0, 255, 1)",display: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'none' }}>Minima: {minTemperaturaValue.current} °C</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <h3 >Luminosidade</h3>
          <GaugeChart id="gauge-light"
            nrOfLevels={20} 
            animate={false}
            animDelay={1000}
            animateDuration={5000}
            colors={["#FF5F6D", "#FFC371"]} 
            cornerRadius={3} 
            arcWidth={0.2} 
            formatTextValue={value => `${value === 0 ? "0 L (0 %)" : allReadingsRef.current[allReadingsRef.current.length - 1].luz ? (value*maxLuzValue.current/100).toFixed(2) + ' L (' + value + ' %)' : "Indisponível"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].luz / maxLuzValue.current} 
            arcsLength={[0.3, 0.7]}
            arcPadding={0.02}
          />
          {/* deve ficar piscando */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '12px',color:'rgba(255, 0, 0, 1)' ,transition: 'color 0.5s ease-in-out'}}>{allReadingsRef.current[allReadingsRef.current.length - 1].luz === 0 ? "0 L" : allReadingsRef.current[allReadingsRef.current.length - 1].luz ? `${allReadingsRef.current[allReadingsRef.current.length - 1].luz} L` : "Offline"}</span>
          <span style={{ fontSize: '12px' }}>Luminosidade maxima: 4095 L</span>
          <span style={{ fontSize: '12px', color:'rgba(255, 165, 0, 1)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'none' }}>Maxima: {maxLuzValue.current} L</span>
          <span style={{ fontSize: '12px', color:'rgba(255, 165, 0, 0.5)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'none' }}>Minima: {minLuzValue.current} L</span>
          </div>
        </div>
      </div>

      <h2 style={{ margin: '20px 0', fontSize: '20px' }}>Leituras {userZoom ? 'em zoom' : 'em tempo real'} {userZoom && <button style={{ marginLeft: '10px', fontSize: '14px' }} onClick={handleZoomButtonClick}>Tempo real</button>}</h2>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={allReadingsRef.current} margin={{ top: 0, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={value => new Date(value).toLocaleTimeString()} stroke="#ccc" style={{ fontSize: '14px' }} />
          <YAxis stroke="#8884d8" yAxisId="left1" orientation="left" style={{ fontSize: '14px' }} domain={[minUmidadeValue.current, maxUmidadeValue.current]} unit={' %'} />
          <YAxis stroke="#82ca9d" yAxisId="left2" orientation="left" style={{ fontSize: '14px' }} domain={[minTemperaturaValue.current, maxTemperaturaValue.current]} unit={' °C'} />
          <YAxis stroke="#ffc658"  yAxisId="right1" orientation="right" style={{ fontSize: '14px' }} domain={[minLuzValue.current, maxLuzValue.current]} unit={' L'} />
          <YAxis stroke="#ffc658"  yAxisId="right2" orientation="right" style={{ fontSize: '14px' }} domain={(value )=> [minLuzValue.current/maxLuzValue.current*100,maxLuzValue.current/maxLuzValue.current*100]} unit={' %'} />


          <Tooltip contentStyle={{ fontSize: '20px', background: '#000' }} labelFormatter={(value) => new Date(value).toLocaleTimeString()} offset={100} />
          <Legend />
          {/* <Bar  type="monotone" dataKey={(value) => (value.luz * 100 / maxLuzValue.current).toFixed(0)} barSize={30} fill="#ffc658" name="Luminosidade" unit=" %" stroke="#ffc658" dot={false} /> */}
          {/* <Line strokeWidth={5} type="monotone" dataKey="umidade" stroke="#8884d8" dot={false} name='Umidade' unit=" %H"  /> */}
          {/* <Line strokeWidth={5} type="monotone" dataKey="temperatura" stroke="#82ca9d" dot={false} name='Temperatura' unit=" °C" /> */}
          <Bar yAxisId="left1" type="monotone"  dataKey="umidade" barSize={20}  stroke="#8884d8" fill="#8884d8" name='Umidade' unit=" %H" dot={false} />
          {/* <Area type="monotone" dataKey="temperatura" stroke="#82ca9d" fill="#82ca9d" dot={false} name='Temperatura' unit=" °C" /> */}
          <Bar yAxisId="left2" type="monotone" dataKey="temperatura" barSize={20} stroke="#82ca9d" fill="#82ca9d" dot={false} name='Temperatura' unit=" °C" />
          <Line yAxisId="right1" strokeWidth={5} type="monotone" dataKey={(value) =>(value.luz).toFixed(2)} barSize={30} fill="#ffc658" name="Luminosidade" unit=" L" stroke="#ffc658" dot={false} />
          <Brush
            startIndex={zoomStartIndex}
            endIndex={zoomEndIndex}
            stroke="#8884d8"
            dataKey="timestamp"
            tickFormatter={value => new Date(value).toLocaleTimeString()}
            onChange={handleBrushChange}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div style={{ position: 'fixed', display: 'flex', justifyContent: 'start', alignItems: 'center', bottom: '0px', left: '0px', width: '100%', margin: '0px', background: '#000', padding: '0px', borderRadius: '0px', color: '#fff', fontSize: '10px', textAlign: 'start', overflow: 'hidden' }}>
      {/* <h3 style={{ margin: '5px 0px', padding: '0px 10px' ,background: '#000' ,color: '#fff',width: '30px',zIndex: '1'}}>Logs: </h3> */}
      <div style={{ whiteSpace: 'nowrap', display: 'inline-block', animation: 'scroll-infinite  50s linear infinite' }}>
        <ul style={{margin: '5px 0px' , listStyle: 'none', padding: '0px', display: 'flex', justifyContent: 'start', alignItems: 'center', flexWrap: 'wrap', gap: '10px',width: '100vw' }}>
          {logs.map((log, index) => (
            index === logs.length - 1 && <li key={index} style={{ color: '#fff', marginRight: '50px', display: 'inline' }}>{log}</li>
          ))}
        </ul>
      </div>
    </div>
    {openMenu && <QRCodeComponent />}
    </div>
  );
};

export default Dashboard;
