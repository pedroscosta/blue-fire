import { merge } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import * as bf from 'bluefire';
import { useStore } from './store';
import initialState from './store/initialState';

(window as any).Bluefire = bf; // TODO: Make a better way to map this
(window as any).BluefireStore = useStore;

if (!useStore.getState().primed)
  useStore.setState((s: any) => merge(s, initialState, { primed: true }));

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
