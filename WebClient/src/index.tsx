import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import userStore from 'redux/store';
import adminStore from 'admin/redux/store';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { reCaptChaSiteKey } from './constants';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

let store: any = userStore;

const isAdminRoute = window.location.pathname.startsWith('/quan-tri')

if (isAdminRoute) {
  store = adminStore;
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleReCaptchaProvider
        reCaptchaKey={reCaptChaSiteKey}
      >
        <App />
      </GoogleReCaptchaProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
