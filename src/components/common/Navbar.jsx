import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-book-fill me-2"></i>
          Biblioteca
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/')}`} to="/">
                <i className="bi bi-house-fill me-1"></i>
                Inicio
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/libros')}`} to="/libros">
                <i className="bi bi-book me-1"></i>
                Libros
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/socios')}`} to="/socios">
                <i className="bi bi-people-fill me-1"></i>
                Socios
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/prestamos')}`} to="/prestamos">
                <i className="bi bi-arrow-left-right me-1"></i>
                Préstamos
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/multas')}`} to="/multas">
                <i className="bi bi-exclamation-triangle-fill me-1"></i>
                Multas
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;