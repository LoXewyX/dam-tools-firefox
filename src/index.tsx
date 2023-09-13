import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

window.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root')!;
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.info('DAM Tool State: %cRunning ⚡', 'color: lime;');
});
