import React, { useEffect, useState, useRef } from 'react';
import GaugeChart from 'react-gauge-chart';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Brush,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const lastReadingsRef = useRef(null);
  const allReadingsRef = useRef([]);
  const [zoomStartIndex, setZoomStartIndex] = useState(0);
  const [zoomEndIndex, setZoomEndIndex] = useState(0);
  const [userZoom, setUserZoom] = useState(false);
  const maxLuzValue = useRef(1); // Inicializado com 1 para evitar divisão por zero
  const [lastDataDelay, setLastDataDelay] = useState(0);
  const [isDataOnline, setIsDataOnline] = useState(false);
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
    setZoomStartIndex(allReadingsRef.current.length - 10);
    setZoomEndIndex(allReadingsRef.current.length - 1);
    setUserZoom(false); // Indica que o usuário alterou manualmente o Zoom
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data");
        allReadingsRef.current = response.data;
        const maxLuz = Math.max(...response.data.map(entry => entry.luz));
        maxLuzValue.current = maxLuz;
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
        const timestampDate =new Date(timestamp);
        const now = new Date();
        
        const lastDataDelay = now - timestampDate;
        console.log(lastDataDelay);
        setLastDataDelay(lastDataDelay);
        
        if (lastDataDelay > 20000) {
          setIsDataOnline(false);
        } else {
          setIsDataOnline(true);
        }
        };
      
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        checkDataDelay(response.data.timestamp);
        if (response.data.timestamp > allReadingsRef.current[allReadingsRef.current.length - 1].timestamp) {
          lastReadingsRef.current = response.data;
          allReadingsRef.current = [...allReadingsRef.current, response.data];
        }
        
        if (allReadingsRef.current.length > 10 && !userZoom) {
          setZoomStartIndex(allReadingsRef.current.length - 10);
          setZoomEndIndex(allReadingsRef.current.length - 1);
        }
        
        const maxLuz = Math.max(...allReadingsRef.current.map(entry => entry.luz));
        maxLuzValue.current = maxLuz;
      } catch (error) {
        console.error('Erro ao buscar última leitura:', error);
      }
    };

    const interval = setInterval(() => {
      fetchLastReading();
    }, 5000);

    return () => clearInterval(interval);
  }, [userZoom]);

  if (allReadingsRef.current.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        
      <h1>ESP32 Sensor Dashboard</h1>
      <div style={{color: 'white', fontSize: '14px' ,position: 'fixed',backgroundColor: isDataOnline ? 'green' : 'red', padding: '5px', borderRadius: '5px', right: '10px', top: '10px'}}>
        
          {isDataOnline ? 'Online. ' : 'Offline. '}  {` Última atualização há ${(lastDataDelay / 1000).toFixed(0)} segundos.`}
       
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexWrap: 'wrap'}}>
        <div>
          <h3>Umidade</h3>
          <GaugeChart id="gauge-humidity" 
            nrOfLevels={1}
            animate={false}
            animDelay={0}
            animateDuration={5000}
            formatTextValue={value => `${value} %H`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].umidade / 100}
          />
          <span style={{ fontSize: '12px' }}>umidade maxima: 100 %</span>

        </div>
        <div>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
            nrOfLevels={10} 
            animate={false}
            animDelay={500}
            animateDuration={5000}
            formatTextValue={value => `${value} °C`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].temperatura / 100}
          />
          <span style={{ fontSize: '12px' }}>temperatura maxima: 100 °C</span>

        </div>
        <div>
          <h3>Luz</h3>
          <GaugeChart id="gauge-light"
            nrOfLevels={20} 
            animate={true}
            animDelay={1000}
            animateDuration={5000}
            colors={["#FF5F6D", "#FFC371"]} 
            cornerRadius={3} 
            arcWidth={0.2} 
            formatTextValue={value => ` (${allReadingsRef.current[allReadingsRef.current.length - 1].luz}) ${value} %`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1].luz / maxLuzValue.current} 
            arcsLength={[0.3, 0.7]}
            arcPadding={0.02}
          />
          <span style={{ fontSize: '12px' }}>Luz maxima: {maxLuzValue.current}</span>
        </div>
      </div>

      <h2 style={{ margin: '20px 0' , fontSize: '20px' }}>Leituras {userZoom ? 'em zoom' : 'em tempo real'} {userZoom && <button style={{ marginLeft: '10px' , fontSize: '14px'}} onClick={handleZoomButtonClick}>
        Tempo real
      </button>}</h2>

      
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={allReadingsRef.current} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={value => new Date(value).toLocaleTimeString()} stroke="#ccc" style={{ fontSize: '14px' }}  />
          <YAxis stroke="#ccc" style={{ fontSize: '14px' }} />
          <Tooltip contentStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
          <Legend contentStyle={{ fontSize: '20px', fontWeight: 'bold' }} wrapperStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
          <Line type="monotone" dataKey="umidade" stroke="#8884d8" dot={false} />
          <Line type="monotone" dataKey="temperatura" stroke="#82ca9d" dot={false}/>
          <Line type="monotone" dataKey="luz" stroke="#ffc658" dot={false}/>
          <Brush
            startIndex={zoomStartIndex}
            endIndex={zoomEndIndex}
            stroke="#8884d8"
            dataKey="timestamp"
            tickFormatter={value => new Date(value).toLocaleTimeString()}
            onChange={handleBrushChange}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
