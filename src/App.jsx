// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Libros from './pages/Libros';
import Socios from './pages/Socios';
import Prestamos from './pages/Prestamos';
import Multas from './pages/Multas';
import NotFound from './pages/NotFound';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/libros" element={<Libros />} />
            <Route path="/socios" element={<Socios />} />
            <Route path="/prestamos" element={<Prestamos />} />
            <Route path="/multas" element={<Multas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;