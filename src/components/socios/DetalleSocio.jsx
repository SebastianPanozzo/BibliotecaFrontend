// ==================== src/components/socios/DetalleSocio.jsx ====================
import { formatearFecha } from '../../utils/Formatters';

function DetalleSocio({ socio, onClose }) {
  if (!socio) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-person me-2"></i>
              Detalles del Socio
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
                <h4 className="text-primary">{socio.nombre}</h4>
                <p className="text-muted mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  DNI: {socio.dni}
                </p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Número de Socio</label>
                <p className="mb-0">
                  <code className="fs-6">{socio.numeroSocio}</code>
                </p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Estado</label>
                <p className="mb-0">
                  {socio.activo ? (
                    <span className="badge bg-success">Activo</span>
                  ) : (
                    <span className="badge bg-secondary">Inactivo</span>
                  )}
                </p>
              </div>

              {socio.email && (
                <div className="col-md-6">
                  <label className="text-muted small">Email</label>
                  <p className="mb-0">
                    <a href={`mailto:${socio.email}`}>{socio.email}</a>
                  </p>
                </div>
              )}

              {socio.telefono && (
                <div className="col-md-6">
                  <label className="text-muted small">Teléfono</label>
                  <p className="mb-0">
                    <a href={`tel:${socio.telefono}`}>{socio.telefono}</a>
                  </p>
                </div>
              )}

              {socio.direccion && (
                <div className="col-12">
                  <label className="text-muted small">Dirección</label>
                  <p className="mb-0">{socio.direccion}</p>
                </div>
              )}

              {socio.fechaNacimiento && (
                <div className="col-md-6">
                  <label className="text-muted small">Fecha de Nacimiento</label>
                  <p className="mb-0">{formatearFecha(socio.fechaNacimiento)}</p>
                </div>
              )}

              {socio.fechaInscripcion && (
                <div className="col-md-6">
                  <label className="text-muted small">Fecha de Inscripción</label>
                  <p className="mb-0">{formatearFecha(socio.fechaInscripcion)}</p>
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

export default DetalleSocio;