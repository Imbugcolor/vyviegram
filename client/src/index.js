import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import DataProvider from './redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google'
import { NotificationsProvider, setUpNotifications } from 'reapop';
import Popup from './components/alert/Popup';

setUpNotifications({
  defaultProps: {
    position: "top-right",
    dismissible: true,
    dismissAfter: 5000,
    showDismissButton: true
  }
});


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId="482953197772-hka18t1ea806s84g0ilo0830rmpptgmg.apps.googleusercontent.com">
  <DataProvider>
      <NotificationsProvider>
          <Popup />
          <App />
      </NotificationsProvider>
  </DataProvider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
