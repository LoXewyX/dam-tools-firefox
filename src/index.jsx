import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.info('DAM Tool State: %cRunning ⚡', 'color: lime;');
});
