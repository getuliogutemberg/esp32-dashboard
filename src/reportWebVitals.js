// reportWebVitals.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Função para medir e relatar as métricas de Web Vitals.
 * @param {function} onPerfEntry - Função de callback que recebe as métricas de desempenho.
 */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Medir e relatar a métrica Cumulative Layout Shift
    getCLS(onPerfEntry);
    // Medir e relatar a métrica First Input Delay
    getFID(onPerfEntry);
    // Medir e relatar a métrica First Contentful Paint
    getFCP(onPerfEntry);
    // Medir e relatar a métrica Largest Contentful Paint
    getLCP(onPerfEntry);
    // Medir e relatar a métrica Time to First Byte
    getTTFB(onPerfEntry);
  }
};

export default reportWebVitals;
