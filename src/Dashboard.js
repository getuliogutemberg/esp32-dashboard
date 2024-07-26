import React, { useEffect, useState, useRef } from 'react';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';
// import io from 'socket.io-client';
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
    luz: 0,
    temperatura: 0,
    umidade: 0,
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

        // define maxLuz
        const maxLuz = Math.max(...response.data.map(entry => entry.luz));

        maxLuzValue.current = maxLuz;

        // define maxTemperatura
        const maxTemperatura = Math.max(...response.data.map(entry => entry.temperatura));
        maxTemperaturaValue.current = maxTemperatura;

        // define maxUmidade
        const maxUmidade = Math.max(...response.data.map(entry => entry.umidade));
        maxUmidadeValue.current = maxUmidade;

        // define minTemperatura
        const minTemperatura = Math.min(...response.data.map(entry => entry.temperatura));
        minTemperaturaValue.current = minTemperatura;

        // define minLuz
        const minLuz = Math.min(...response.data.map(entry => entry.luz));
        minLuzValue.current = minLuz;

        // define minUmidade
        const minUmidade = Math.min(...response.data.map(entry => entry.umidade));
        minUmidadeValue.current = minUmidade;

       

        // Define zoomStartIndex e zoomEndIndex
        if (response.data.length > 10) {
          setZoomStartIndex(response.data.length - 10);
          setZoomEndIndex(response.data.length - 1);
        } 
      } catch (error) {
        console.error('Erro ao buscar todas as leituras:', error);
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
      };

      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        checkDataDelay(response.data.timestamp);
        if (response.data.timestamp > allReadingsRef.current[allReadingsRef.current.length - 1].timestamp) {
          lastReadingsRef.current = response.data;
          allReadingsRef.current = [...allReadingsRef.current, response.data];
        }
        
        if (allReadingsRef.current.length && !userZoom) {
          setZoomStartIndex(allReadingsRef.current.length > 10 ? allReadingsRef.current.length - 10 : 0);
          setZoomEndIndex(allReadingsRef.current.length - 1);
        } 
        // define maxLuz 
        const maxLuz = Math.max(...allReadingsRef.current.map(entry => entry.luz));
        maxLuzValue.current = maxLuz;

        // define maxTemperatura
        const maxTemperatura = Math.max(...allReadingsRef.current.map(entry => entry.temperatura));
        maxTemperaturaValue.current = maxTemperatura;

        // define maxUmidade
        const maxUmidade = Math.max(...allReadingsRef.current.map(entry => entry.umidade));
        maxUmidadeValue.current = maxUmidade;

        // define minTemperatura
        const minTemperatura = Math.min(...allReadingsRef.current.map(entry => entry.temperatura));
        minTemperaturaValue.current = minTemperatura;

        // define minLuz
        const minLuz = Math.min(...allReadingsRef.current.map(entry => entry.luz));
        minLuzValue.current = minLuz;

        // define minUmidade
        const minUmidade = Math.min(...allReadingsRef.current.map(entry => entry.umidade));
        minUmidadeValue.current = minUmidade;

      } catch (error) {
        console.error('Erro ao buscar última leitura:', error);
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
    return <div style={{marginRight: '30px'}}>Consultando dados... </div>;
  }

  const convertMilliseconds = (ms) => {
    let seconds = Math.floor((ms / 1000) % 60);
    let minutes = Math.floor((ms / (1000 * 60)) % 60);
    let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  
    return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', margin: '0 auto' }}>
      <div style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: isDataOnline ? 'green' : 'red', padding: '5px', borderRadius: '5px', left: '10px', top: '10px' }}>
        {isDataOnline ? 'Online.' : `Offline a ${convertMilliseconds(lastDataDelay)}.`}
      </div>
      <div 
        onClick={handleDeleteData}
        style={{ color: 'white', fontSize: '14px', position: 'fixed', backgroundColor: 'red', padding: '5px', borderRadius: '5px', right: '10px', top: '10px', cursor: 'pointer' }}
      >
        Apagar dados
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <h3>Umidade</h3>
          <GaugeChart id="gauge-humidity" 
            nrOfLevels={1}
            animate={false}
            animDelay={0}
            animateDuration={5000}
            formatTextValue={value => `${allReadingsRef.current[allReadingsRef.current.length - 1].umidade ? value + '%' : "No Data"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].umidade / 100}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* deve ficar piscando */}
          <span style={{ fontSize: '12px',color: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'red',display: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'none' ,transition: 'color 0.5s ease-in-out'}}>{value => `${allReadingsRef.current[allReadingsRef.current.length - 1].umidade ? value + '%' : "Offline"} `}</span>
         
          <span style={{ fontSize: '12px' }}>Umidade maxima: 100 %</span>
          <span style={{ fontSize: '12px', color: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'rgba(0, 0, 255, 1)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'none' }}>Maxima: {maxLuzValue.current} %</span>
          <span style={{ fontSize: '12px', color: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'rgba(0, 0, 255, 0.5)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].umidade && 'none' }}>Minima: {minLuzValue.current} %</span>
          </div>
        </div>
        <div>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
            nrOfLevels={10} 
            animate={false}
            animDelay={500}
            animateDuration={5000}
            formatTextValue={value => `${allReadingsRef.current[allReadingsRef.current.length - 1].temperatura ? value + '°C' : "No Data"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].temperatura / 100}
          />
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {/* deve ficar piscando */}
          <span style={{ fontSize: '12px',color: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'red',display: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'none' ,transition: 'color 0.5s ease-in-out'}}>{value => `${allReadingsRef.current[allReadingsRef.current.length - 1].temperatura ? value + '°C' : "Offline"} `}</span>
          
          <span style={{ fontSize: '12px' }}>Temperatura maxima: 100 °C</span>
          <span style={{ fontSize: '12px',color: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'red',display: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'none' }}>Maxima: {maxTemperaturaValue.current} °C</span>
          <span style={{ fontSize: '12px',color: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'blue',display: !allReadingsRef.current[allReadingsRef.current.length - 1].temperatura && 'none' }}>Minima: {minTemperaturaValue.current} °C</span>
          </div>
        </div>
        <div>
          <h3>Luminosidade</h3>
          <GaugeChart id="gauge-light"
            nrOfLevels={20} 
            animate={false}
            animDelay={1000}
            animateDuration={5000}
            colors={["#FF5F6D", "#FFC371"]} 
            cornerRadius={3} 
            arcWidth={0.2} 
            formatTextValue={value => `${allReadingsRef.current[allReadingsRef.current.length - 1].luz ? value + 'L (' + (value * 100 / maxLuzValue.current).toFixed(0) + ' %)' : "No Data"} `}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].luz / maxLuzValue.current} 
            arcsLength={[0.3, 0.7]}
            arcPadding={0.02}
          />
          {/* deve ficar piscando */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '12px',color: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'red',display: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'none' ,transition: 'color 0.5s ease-in-out'}}>{value => `${allReadingsRef.current[allReadingsRef.current.length - 1].luz ? value + 'L' : "Offline"} `}</span>
          <span style={{ fontSize: '12px' }}>Luminosidade maxima: 4068 L</span>
          <span style={{ fontSize: '12px', color: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'rgba(255, 165, 0, 1)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'none' }}>Maxima: {maxLuzValue.current} L</span>
          <span style={{ fontSize: '12px', color: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'rgba(255, 165, 0, 0.5)', display: !allReadingsRef.current[allReadingsRef.current.length - 1].luz && 'none' }}>Minima: {minLuzValue.current} L</span>
          </div>
        </div>
      </div>

      <h2 style={{ margin: '20px 0', fontSize: '20px' }}>Leituras {userZoom ? 'em zoom' : 'em tempo real'} {userZoom && <button style={{ marginLeft: '10px', fontSize: '14px' }} onClick={handleZoomButtonClick}>Tempo real</button>}</h2>

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={allReadingsRef.current} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={value => new Date(value).toLocaleTimeString()} stroke="#ccc" style={{ fontSize: '14px' }} />
          <YAxis stroke="#ccc" style={{ fontSize: '14px' }} domain={[0, 100]} />
          <Tooltip contentStyle={{ fontSize: '20px', background: '#000' }} labelFormatter={(value) => new Date(value).toLocaleTimeString()} offset={100} />
          <Legend />
          {/* <Bar  type="monotone" dataKey={(value) => (value.luz * 100 / maxLuzValue.current).toFixed(0)} barSize={30} fill="#ffc658" name="Luminosidade" unit=" %" stroke="#ffc658" dot={false} /> */}
          {/* <Line strokeWidth={5} type="monotone" dataKey="umidade" stroke="#8884d8" dot={false} name='Umidade' unit=" %H"  /> */}
          {/* <Line strokeWidth={5} type="monotone" dataKey="temperatura" stroke="#82ca9d" dot={false} name='Temperatura' unit=" °C" /> */}
          <Bar type="monotone" dataKey="umidade" barSize={20}  stroke="#8884d8" fill="#8884d8" name='Umidade' unit=" %H" dot={false} />
          {/* <Area type="monotone" dataKey="temperatura" stroke="#82ca9d" fill="#82ca9d" dot={false} name='Temperatura' unit=" °C" /> */}
          <Bar type="monotone" dataKey="temperatura" barSize={20} stroke="#82ca9d" fill="#82ca9d" dot={false} name='Temperatura' unit=" °C" />
          <Line strokeWidth={5} type="monotone" dataKey={(value) =>(value.luz * 100 / maxLuzValue.current).toFixed(0)} formatTextValue={value => `${value} L`} barSize={30} fill="#ffc658" name="Luminosidade" unit=" %" stroke="#ffc658" dot={false} />
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
    </div>
  );
};

export default Dashboard;
