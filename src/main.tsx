import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import * as bf from 'bluefire';
import { useStore } from './store';

(window as any).Bluefire = bf; // TODO: Make a better way to map this
(window as any).BluefireStore = useStore;

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
