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

    const interval = setInterval(fetchLastReading, 5000); // Busca a cada 5 segundos

    return () => clearInterval(interval);
  }, [userZoom]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard de Monitoramento</h1>
      <button className="zoom-button" onClick={handleZoomButtonClick}>Ver Últimas Leituras</button>
      <div className="chart-container">
        <div className="gauge-chart">
          <h3 className={lastReadingsRef.current.temperatura === maxTemperaturaValue.current ? 'on-fire' : lastReadingsRef.current.temperatura === minTemperaturaValue.current ? 'frozen' : ''}>Temperatura Atual</h3>
          <GaugeChart id="gauge-chart1" 
            nrOfLevels={30} 
            percent={lastReadingsRef.current.temperatura / maxTemperaturaValue.current} 
            textColor="#000000"
            formatTextValue={value => `${lastReadingsRef.current.temperatura.toFixed(2)}°C`}
          />
        </div>
        <div className="gauge-chart">
          <h3 className={lastReadingsRef.current.umidade === maxUmidadeValue.current ? 'soaked' : lastReadingsRef.current.umidade === minUmidadeValue.current ? 'dry' : ''}>Umidade Atual</h3>
          <GaugeChart id="gauge-chart2" 
            nrOfLevels={30} 
            percent={lastReadingsRef.current.umidade / maxUmidadeValue.current} 
            textColor="#000000"
            formatTextValue={value => `${lastReadingsRef.current.umidade.toFixed(2)}%`}
          />
        </div>
        <div className="gauge-chart">
          <h3 className={lastReadingsRef.current.luz === maxLuzValue.current ? 'shining' : lastReadingsRef.current.luz === minLuzValue.current ? 'dimmed' : ''}>Luminosidade Atual</h3>
          <GaugeChart id="gauge-chart3" 
            nrOfLevels={30} 
            percent={lastReadingsRef.current.luz / maxLuzValue.current} 
            textColor="#000000"
            formatTextValue={value => `${lastReadingsRef.current.luz.toFixed(2)} Lux`}
          />
        </div>
      </div>
      <div className="historical-data">
        <h2>Histórico de Leituras</h2>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={allReadingsRef.current.slice(zoomStartIndex, zoomEndIndex + 1)}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="timestamp" tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()} />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip labelFormatter={(label) => new Date(label).toLocaleString()} />
            <Legend />
            <Brush dataKey="timestamp" startIndex={zoomStartIndex} endIndex={zoomEndIndex} onChange={handleBrushChange} />
            <Line yAxisId="left" type="monotone" dataKey="temperatura" stroke="#ff7300" />
            <Line yAxisId="left" type="monotone" dataKey="umidade" stroke="#387908" />
            <Line yAxisId="right" type="monotone" dataKey="luz" stroke="#8884d8" />
            <Bar yAxisId="left" dataKey="temperatura" fill="#ff7300" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="logs">
        <h2>Logs de Status do Dashboard</h2>
        <ul>
          <li>Dashboard está {isDataOnline ? 'online' : 'offline'}.</li>
          <li>Último atraso de dados: {lastDataDelay} ms.</li>
          <li>Número de usuários visualizando o dashboard: {/* Aqui você pode adicionar a lógica para obter o número de usuários */}</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
