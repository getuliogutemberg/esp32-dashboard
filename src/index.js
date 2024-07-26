import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import ReportWebVitals from './reportWebVitals.js';
// import axios from 'axios';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


ReportWebVitals(console.log);