// src/App.js
import React from 'react';
import './App.css';
import Dashboard from './Dashboard.js';
import Stream from './Stream.js';
import ExternalLink from './ExternalLink.jsx';
import './ChupaCabra.jsx';

export const apiUrl = process.env.REACT_APP_URL;
export const features = JSON.parse(process.env.REACT_APP_FEATURES);
export const description = JSON.parse(process.env.REACT_APP_DESCRIPTION);
export const apiData = process.env.REACT_APP_ENDPOINT_API_DATA;
export const apiLastData = process.env.REACT_APP_ENDPOINT_API_LASTDATA;




function App() {



  return (
    <div className="App">
        
      <header  className="App-header" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'start-between', alignItems: 'center'}}>
        <ExternalLink  href={apiUrl} >{'Painel Telemetrico'}</ExternalLink>
      <div  style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'start'}}>

        <Stream description={description} features={features}/>
        <Dashboard apiData={apiData} apiLastData={apiLastData} />
        
      </div>

      </header>
      
    </div>
  );
}

export default App;
