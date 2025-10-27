function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>
              <i className="bi bi-book-fill me-2"></i>
              Sistema de Biblioteca
            </h5>
            <p className="text-muted">
              Gestión integral de libros, socios, préstamos y multas
            </p>
          </div>
          <div className="col-md-3">
            <h6>Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><a href="/libros" className="text-white-50 text-decoration-none">Libros</a></li>
              <li><a href="/socios" className="text-white-50 text-decoration-none">Socios</a></li>
              <li><a href="/prestamos" className="text-white-50 text-decoration-none">Préstamos</a></li>
              <li><a href="/multas" className="text-white-50 text-decoration-none">Multas</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Contacto</h6>
            <p className="text-muted mb-1">
              <i className="bi bi-envelope me-2"></i>
              info@biblioteca.com
            </p>
            <p className="text-muted">
              <i className="bi bi-telephone me-2"></i>
              +54 9 11 1234-5678
            </p>
          </div>
        </div>
        <hr className="border-secondary" />
        <div className="text-center text-muted">
          <p className="mb-0">
            &copy; {currentYear} Sistema de Biblioteca. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;