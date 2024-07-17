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
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [lastReading, setLastReading] = useState(null);
  const [allReadings, setAllReadings] = useState([]);

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
        <LineChart data={allReadings}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="umidade" stroke="#8884d8" />
          <Line type="monotone" dataKey="temperatura" stroke="#82ca9d" />
          <Line type="monotone" dataKey="luz" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
