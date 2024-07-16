// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import {RadialGauge}  from 'react-canvas-gauges';
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
        fetch('/data/last')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na requisição HTTP: ' + response.status);
          }
          
          return response.json();
        })
        .then(data => {
          console.log('Última leitura:', data);
          setLastReading(data);
          // Aqui você pode processar os dados recebidos
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
        });
    };

    const fetchAllReadings = async () => {
        fetch('/data')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro na requisição HTTP: ' + response.status);
          }
          return response.json();
        })
        .then(data => {
          console.log('Todas as leituras:', data);
          setAllReadings(data);
          // Aqui você pode processar os dados recebidos
        })
        .catch(error => {
          console.error('Erro ao buscar dados:', error);
        });
    };

    fetchLastReading();
    fetchAllReadings();

    // Aqui você pode adicionar ou lidar com o setInterval para buscar novos dados

    // Por exemplo:

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
        <div style={{ }}>
          <h3>Umidade</h3>
          <RadialGauge value={lastReading.umidade}/>
        </div>
        <div>
          <h3>Temperatura</h3>
          <RadialGauge value={lastReading.temperatura} />
        </div>
        <div>
          <h3>Luz</h3>
          <RadialGauge value={lastReading.luz} />
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
