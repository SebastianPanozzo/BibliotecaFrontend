import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
          <h1 className="display-1 mt-3">404</h1>
          <h2 className="mb-4">Página No Encontrada</h2>
          <p className="lead text-muted mb-4">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            <i className="bi bi-house-fill me-2"></i>
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;