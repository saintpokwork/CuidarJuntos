import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import { CareDataProvider } from './context/CareDataContext';
import './styles/index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <CareDataProvider>
        <App />
      </CareDataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
