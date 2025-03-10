import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';  // ✅ Ensure CSS is imported

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/Nso2/controlpanel/dashboard/">  {/* ✅ Apply base route */}
	
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

