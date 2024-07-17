// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart'
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
  const [allReadings, setAllReadings] = useState([]);
  const [zoomStartIndex, setZoomStartIndex] = useState(0);

  useEffect(() => {
    if (allReadings.length > 10) {
      setZoomStartIndex(allReadings.length - 10);
    }
  }, [allReadings]);

  useEffect(() => {
    const fetchLastReading = async () => {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data/last");
        console.log('Última leitura:', response.data);
        setLastReading(response.data);
      } catch (error) {
        console.error('Erro ao buscar última leitura:', error);
      }
    };

    const fetchAllReadings = async () => {
      try {
        const response = await axios.get("https://esp32-data-api-1.onrender.com/data");
        console.log('Leituras:', response.data);
        setAllReadings(response.data);
      } catch (error) {
        console.error('Erro ao buscar todas as leituras:', error);
      }
    };

    fetchLastReading();
    fetchAllReadings();

    // Aqui você pode adicionar ou lidar com o setInterval para buscar novos dados

    const interval = setInterval(() => {
      fetchLastReading();
      fetchAllReadings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
            nrOfLevels={20}
            animate={false}
            formatTextValue={value => `${value} %H`}
            percent={lastReading.umidade/100}
          />
        </div>
        <div>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
            nrOfLevels={20} 
            animate={false}
            formatTextValue={value => `${value} °C`}
            percent={lastReading.temperatura/100}
          />
        </div>
        <div>
          <h3>Luz</h3>
          <GaugeChart id="gauge-light"
            nrOfLevels={30} 
            animate={false}
            colors={["#FF5F6D", "#FFC371"]} 
            arcWidth={0.3} 
            formatTextValue={value => `${value}`}
            percent={lastReading.luz/100} 
          />
        </div>
      </div>

      <h2>Leituras</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={allReadings} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          endIndex={allReadings.length - 1}
          stroke="#8884d8"
          dataKey="timestamp"
          tickFormatter={value => new Date(value).toLocaleTimeString()}
        />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
