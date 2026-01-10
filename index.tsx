

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Fix: Access document via globalThis to resolve the 'Cannot find name' error in this environment where DOM types may be missing from the global scope.
const rootElement = (globalThis as any).document?.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
