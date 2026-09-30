import { useEffect } from 'react';
import { About } from './components/About';
import { Cart } from './components/Cart';
import { CartBar } from './components/CartBar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { useCatalog } from './context/CatalogContext';

export default function App() {
  const { settings } = useCatalog();

  useEffect(() => {
    document.title = `${settings.storeName} | Sándwiches de miga`;
  }, [settings.storeName]);

  return (
    <div id="top" className="min-h-dvh">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Hero />
        <ProductList />
        <About />
      </main>
      <Footer />
      <CartBar />
      <Cart />
    </div>
  );
}
