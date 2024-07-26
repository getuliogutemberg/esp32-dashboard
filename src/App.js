// src/App.js
import React from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Stream from './Stream.js';
import QRCodeComponent from './QRCodeComponent.js';


function App() {


  return (
    <div className="App">
      <header className="App-header" style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'start-between', alignItems: 'center'}}>
      <h1 style={{ margin: '35px 0px 0px 0px', padding: '0px'}}>Painel telemetrico</h1>
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'start'}}>

        <Stream />
        <Dashboard />

      </div>
      </header>
      <QRCodeComponent />
    </div>
  );
}

export default App;
