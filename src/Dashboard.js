// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart'
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
          <GaugeChart id="gauge-humidity" 
          nrOfLevels={20}
          formatTextValue={value => `${value} %H`}
          percent={lastReading.umidade/100}
           />
        </div>
        <div>
          <h3>Temperatura</h3>
          <GaugeChart id="gauge-temperature"
          nrOfLevels={20} 
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
           {/* <GaugeChart id="gauge-chart4" 
  nrOfLevels={10} 
  arcPadding={0.1} 
  cornerRadius={3} 
  percent={0.6} 
/>
<GaugeChart id="gauge-chart5"
  nrOfLevels={420}
  arcsLength={[0.3, 0.5, 0.2]}
  colors={['#5BE12C', '#F5CD19', '#EA4228']}
  percent={0.37}
  arcPadding={0.02}
/>
<GaugeChart id="gauge-chart6" 
  animate={false} 
  nrOfLevels={15} 
  percent={0.56} 
  needleColor="#345243" 
/> */}
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
