import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/MainLayout';
import ItemListContainer from './components/ItemListContainer';
import ProductsWithFilters from './components/ProductsWithFilters';
import ItemDetailContainer from './components/ItemDetailContainer';
import Cart from './pages/Cart';
import CheckoutForm from './components/CheckoutForm';
import Contact from './pages/Contact';
import CentroAyuda from './pages/CentroAyuda';
import EnviosDevoluciones from './pages/EnviosDevoluciones';
import Garantia from './pages/Garantia';
import MetodosPago from './pages/MetodosPago';
import Error404 from './pages/Error404';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Rutas con layout (NavBar visible) */}
          <Route element={<MainLayout />}>
              <Route path="/" element={<ProductsWithFilters />} />
              <Route path="/category/:categoryId" element={<ProductsWithFilters />} />
              <Route path="/marca/:marca" element={<ProductsWithFilters />} />
              <Route path="/genero/:genero" element={<ProductsWithFilters />} />
              <Route path="/item/:id" element={<ItemDetailContainer />} />
              <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutForm />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/ayuda" element={<CentroAyuda />} />
            <Route path="/envios-devoluciones" element={<EnviosDevoluciones />} />
            <Route path="/garantia" element={<Garantia />} />
            <Route path="/metodos-pago" element={<MetodosPago />} />
          </Route>

          {/* Rutas sin layout (NavBar oculta) */}
          <Route path="/404" element={<Error404 />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
