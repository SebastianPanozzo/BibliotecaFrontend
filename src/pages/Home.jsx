// ==================== src/pages/Home.jsx ====================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibros } from '../hooks/useLibros';
import { useSocios } from '../hooks/useSocios';
import { usePrestamos } from '../hooks/usePrestamos';
import { useMultas } from '../hooks/useMultas';

function Home() {
  const { libros, cargarLibros } = useLibros();
  const { socios, cargarSocios } = useSocios();
  const { prestamos, cargarPrestamos } = usePrestamos();
  const { estadisticas, cargarEstadisticas } = useMultas();

  useEffect(() => {
    cargarLibros();
    cargarSocios();
    cargarPrestamos();
    cargarEstadisticas();
  }, []);

  const stats = {
    totalLibros: libros.length,
    librosDisponibles: libros.filter(l => l.estado === 'DISPONIBLE').length,
    librosPrestados: libros.filter(l => l.estado === 'PRESTADO').length,
    totalSocios: socios.length,
    sociosActivos: socios.filter(s => s.activo).length,
    prestamosActivos: prestamos.filter(p => p.estadoPrestamo === 'ACTIVO').length,
    prestamosVencidos: prestamos.filter(p => p.estadoPrestamo === 'VENCIDO').length,
    multasPendientes: estadisticas?.multasPendientes || 0
  };

  return (
    <div className="container mt-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1 className="display-4 mb-3">
            <i className="bi bi-book-fill text-primary me-3"></i>
            Sistema de Biblioteca
          </h1>
          <p className="lead text-muted">
            Gestión integral de libros, socios, préstamos y multas
          </p>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div className="card hover-shadow border-primary">
            <div className="card-body text-center">
              <i className="bi bi-book display-4 text-primary"></i>
              <h3 className="mt-3 mb-0">{stats.totalLibros}</h3>
              <p className="text-muted mb-1">Total Libros</p>
              <small className="text-success">
                {stats.librosDisponibles} disponibles
              </small>
            </div>
            <div className="card-footer bg-transparent">
              <Link to="/libros" className="btn btn-sm btn-primary w-100">
                Ver Libros
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card hover-shadow border-success">
            <div className="card-body text-center">
              <i className="bi bi-people-fill display-4 text-success"></i>
              <h3 className="mt-3 mb-0">{stats.totalSocios}</h3>
              <p className="text-muted mb-1">Total Socios</p>
              <small className="text-success">
                {stats.sociosActivos} activos
              </small>
            </div>
            <div className="card-footer bg-transparent">
              <Link to="/socios" className="btn btn-sm btn-success w-100">
                Ver Socios
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card hover-shadow border-info">
            <div className="card-body text-center">
              <i className="bi bi-arrow-left-right display-4 text-info"></i>
              <h3 className="mt-3 mb-0">{stats.prestamosActivos}</h3>
              <p className="text-muted mb-1">Préstamos Activos</p>
              <small className="text-danger">
                {stats.prestamosVencidos} vencidos
              </small>
            </div>
            <div className="card-footer bg-transparent">
              <Link to="/prestamos" className="btn btn-sm btn-info w-100">
                Ver Préstamos
              </Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card hover-shadow border-warning">
            <div className="card-body text-center">
              <i className="bi bi-exclamation-triangle-fill display-4 text-warning"></i>
              <h3 className="mt-3 mb-0">{stats.multasPendientes}</h3>
              <p className="text-muted mb-1">Multas Pendientes</p>
              <small className="text-muted">
                Por cobrar
              </small>
            </div>
            <div className="card-footer bg-transparent">
              <Link to="/multas" className="btn btn-sm btn-warning w-100">
                Ver Multas
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="row mb-5">
        <div className="col-12">
          <h4 className="mb-4">
            <i className="bi bi-lightning-fill me-2"></i>
            Acciones Rápidas
          </h4>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/libros" className="text-decoration-none">
            <div className="card h-100 hover-shadow">
              <div className="card-body text-center">
                <i className="bi bi-plus-circle display-5 text-primary"></i>
                <h5 className="mt-3">Agregar Libro</h5>
                <p className="text-muted small">Registrar nuevo libro en el sistema</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/socios" className="text-decoration-none">
            <div className="card h-100 hover-shadow">
              <div className="card-body text-center">
                <i className="bi bi-person-plus display-5 text-success"></i>
                <h5 className="mt-3">Registrar Socio</h5>
                <p className="text-muted small">Dar de alta un nuevo socio</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/prestamos" className="text-decoration-none">
            <div className="card h-100 hover-shadow">
              <div className="card-body text-center">
                <i className="bi bi-box-arrow-right display-5 text-info"></i>
                <h5 className="mt-3">Nuevo Préstamo</h5>
                <p className="text-muted small">Registrar préstamo de libro</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-md-3 mb-3">
          <Link to="/prestamos" className="text-decoration-none">
            <div className="card h-100 hover-shadow">
              <div className="card-body text-center">
                <i className="bi bi-box-arrow-in-left display-5 text-warning"></i>
                <h5 className="mt-3">Devolución</h5>
                <p className="text-muted small">Registrar devolución de libro</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Información del Sistema */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Acerca del Sistema
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Sistema de Biblioteca v1.0</strong>
              </p>
              <p className="text-muted small mb-0">
                Sistema completo de gestión de biblioteca que permite administrar
                libros, socios, préstamos y multas de forma eficiente y organizada.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Funcionalidades
              </h5>
            </div>
            <div className="card-body">
              <ul className="mb-0">
                <li>Gestión completa de libros (CRUD)</li>
                <li>Alta y gestión de socios</li>
                <li>Sistema de préstamos con validaciones</li>
                <li>Control de devoluciones y multas</li>
                <li>Estadísticas y reportes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;