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
    const [lastReading, setLastReading] = useState(null);
    const allReadingsRef = useRef([]);
  const [zoomStartIndex, setZoomStartIndex] = useState(0);
  const [zoomEndIndex, setZoomEndIndex] = useState(0);
  const [userZoom, setUserZoom] = useState(false);

  const handleBrushChange = ({ startIndex, endIndex }) => {
    setUserZoom(true); // Indica que o usuário alterou manualmente o Brush
    setZoomStartIndex(startIndex);
    // Verifica se o endIndex está na última leitura
    if (endIndex === allReadingsRef.current.length - 1) {
      setZoomEndIndex(allReadingsRef.current.length - 1);
    //   setUserZoom(false);
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
        console.log('Leituras:', response.data);
        allReadingsRef.current = response.data;
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
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        console.log('Última leitura:', response.data);
        setLastReading(response.data);
        allReadingsRef.current = [...allReadingsRef.current, response.data];
        console.log(allReadingsRef.current[allReadingsRef.current.length - 1]['luz']);
        
        if (allReadingsRef.current.length > 10 && !userZoom) {
          setZoomStartIndex(allReadingsRef.current.length - 10);
          setZoomEndIndex(allReadingsRef.current.length - 1);
        }
      } catch (error) {
        console.error('Erro ao buscar última leitura:', error);
      }
    };

    const interval = setInterval(() => {
      fetchLastReading();
    }, 5000);

    return () => clearInterval(interval);
  }, [ userZoom ]);

  if (!lastReading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>ESP32 Sensor Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div>
          <h3>Umidade</h3>
          <GaugeChart id="gauge-humidity" 
            nrOfLevels={1}
            animate={false}
            animDelay={0}
            animateDuration={5000}
            formatTextValue={value => `${value} %H`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1]['umidade'] / 100}
          />
        </div>
        <div>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
            nrOfLevels={10} 
            animate={false}
            animDelay={500}
            animateDuration={5000}
            formatTextValue={value => `${value} °C`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1]['temperatura'] / 100}
          />
        </div>
        <div>
          <h3>Luz</h3>
          <GaugeChart id="gauge-light"
            nrOfLevels={20} 
            animate={false}
            animDelay={1000}
            animateDuration={5000}
            colors={["#FF5F6D", "#FFC371"]} 
            cornerRadius={3} 
            arcWidth={0.2} 
            formatTextValue={value => ` (${allReadingsRef.current[allReadingsRef.current.length - 1]['luz']}) ${value} %`}
            percent={allReadingsRef.current[allReadingsRef.current.length - 1]['luz'] / 250} 
            arcsLength={[0.3, 0.7]}
            arcPadding={0.02}
          />
        </div>
      </div>

      <h2 style={{ margin: 0 }}>Leituras {userZoom ? 'em zoom' : 'em tempo real'} {userZoom && <button style={{ marginLeft: '10px' , fontSize: '14px'}} onClick={handleZoomButtonClick}>
        Tempo real
      </button>}</h2>
      
      
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={allReadingsRef.current} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tickFormatter={value => new Date(value).toLocaleTimeString()} stroke="#ccc" style={{ fontSize: '14px' }}  />
          <YAxis stroke="#ccc" style={{ fontSize: '14px' }} />
          <Tooltip contentStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
          <Legend contentStyle={{ fontSize: '20px', fontWeight: 'bold' }} />
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
