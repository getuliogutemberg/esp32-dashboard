// src/App.js
import React from 'react';
import './App.css';
import Dashboard from './Dashboard';
import Stream from './Stream.js';

function App() {


  return (
    <div className="App">
      <header className="App-header" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        <Dashboard />
        <Stream />
      </header>
    </div>
  );
}

export default App;
