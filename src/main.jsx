import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import logo from './assets/Cognizn_logo.webp'; // Adjust the path if necessary

// Dynamically set favicon
const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
link.rel = 'icon';
link.type = 'image/webp';
link.href = logo;
document.head.appendChild(link);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
