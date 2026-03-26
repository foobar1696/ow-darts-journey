import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import './app.css';
import MainPage from './presentation/pages/MainPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainPage />
  </React.StrictMode>,
);

