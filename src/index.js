import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';

i18n
.use(I18NextHttpBackend)
.use(initReactI18next)
.init({
  backend: {
    loadPath: '/I18n/{{lng}}.json',
  },
  lng: 'ta', // Default
  fallbackLng: 'ta',
  interpolation: {
    escapeValue: false,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>,
);

reportWebVitals();
