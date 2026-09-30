import '@fontsource-variable/outfit';
import '@fontsource/caveat-brush';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { CartProvider } from './context/CartContext';
import { CatalogProvider } from './context/CatalogContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CatalogProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </CatalogProvider>
  </StrictMode>,
);
