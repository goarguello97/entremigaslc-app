import { About } from './components/About';
import { Cart } from './components/Cart';
import { CartBar } from './components/CartBar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';

export default function App() {
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
