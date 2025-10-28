// ==================== src/components/prestamos/DetallePrestamo.jsx ====================
import { formatearFecha, formatearFechaHora } from '../../utils/formatters';

function DetallePrestamo({ prestamo, onClose }) {
  if (!prestamo) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-arrow-left-right me-2"></i>
              Detalles del Préstamo
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row g-3">
              <div className="col-12">
                <h6 className="text-muted">Información del Libro</h6>
                <h5 className="text-primary">{prestamo.libro?.titulo || 'Libro no encontrado'}</h5>
                <p className="mb-0">
                  <strong>Autor:</strong> {prestamo.libro?.autor}
                  <br />
                  <strong>ISBN:</strong> {prestamo.libro?.isbn}
                </p>
              </div>

              <div className="col-12">
                <hr />
                <h6 className="text-muted">Información del Socio</h6>
                <p className="mb-0">
                  <strong>Nombre:</strong> {prestamo.socio?.nombre || 'Socio no encontrado'}
                  <br />
                  <strong>N° Socio:</strong> {prestamo.socio?.numeroSocio}
                  <br />
                  <strong>DNI:</strong> {prestamo.socio?.dni}
                </p>
              </div>

              <div className="col-12">
                <hr />
                <h6 className="text-muted">Información del Préstamo</h6>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Fecha de Préstamo</label>
                <p className="mb-0">{formatearFecha(prestamo.fechaPrestamo)}</p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Fecha de Devolución</label>
                <p className="mb-0">{formatearFecha(prestamo.fechaDevolucion)}</p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Estado</label>
                <p className="mb-0">
                  {prestamo.estadoPrestamo === 'ACTIVO' && (
                    <span className="badge bg-success">Activo</span>
                  )}
                  {prestamo.estadoPrestamo === 'VENCIDO' && (
                    <span className="badge bg-danger">Vencido</span>
                  )}
                  {prestamo.estadoPrestamo === 'DEVUELTO' && (
                    <span className="badge bg-secondary">Devuelto</span>
                  )}
                </p>
              </div>

              {prestamo.fechaDevolucionReal && (
                <div className="col-md-6">
                  <label className="text-muted small">Fecha de Devolución Real</label>
                  <p className="mb-0">{formatearFecha(prestamo.fechaDevolucionReal)}</p>
                </div>
              )}

              {prestamo.observaciones && (
                <div className="col-12">
                  <label className="text-muted small">Observaciones</label>
                  <p className="mb-0">{prestamo.observaciones}</p>
                </div>
              )}

              {prestamo.fechaCreacion && (
                <div className="col-12">
                  <label className="text-muted small">Fecha de Registro</label>
                  <p className="mb-0">{formatearFechaHora(prestamo.fechaCreacion)}</p>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetallePrestamo;