// ==================== src/components/multas/DetalleMulta.jsx ====================
import { formatearFecha, formatearFechaHora, formatearMoneda } from '../../utils/Formatters';

function DetalleMulta({ multa, onClose }) {
  if (!multa) return null;

  const getTipoLabel = (tipo) => {
    const tipos = {
      'RETRASO': 'Retraso en devolución',
      'DANO': 'Daño al libro',
      'PERDIDA': 'Pérdida del libro',
      'OTROS': 'Otros'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Detalles de la Multa
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
                <h6 className="text-muted">Información del Socio</h6>
                <h5 className="text-primary">{multa.socio?.nombre || 'Socio no encontrado'}</h5>
                <p className="mb-0">
                  <strong>N° Socio:</strong> {multa.socio?.numeroSocio}
                  <br />
                  <strong>DNI:</strong> {multa.socio?.dni}
                </p>
              </div>

              <div className="col-12">
                <hr />
                <h6 className="text-muted">Información de la Multa</h6>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Tipo de Multa</label>
                <p className="mb-0">
                  <span className="badge bg-info text-dark">
                    {getTipoLabel(multa.tipoMulta)}
                  </span>
                </p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Monto</label>
                <p className="mb-0">
                  <strong className="text-danger fs-5">{formatearMoneda(multa.monto)}</strong>
                </p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Fecha de Multa</label>
                <p className="mb-0">{formatearFecha(multa.fechaMulta)}</p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Estado</label>
                <p className="mb-0">
                  {multa.estadoMulta === 'PENDIENTE' && (
                    <span className="badge bg-warning text-dark">Pendiente</span>
                  )}
                  {multa.estadoMulta === 'PAGADA' && (
                    <span className="badge bg-success">Pagada</span>
                  )}
                  {multa.estadoMulta === 'CANCELADA' && (
                    <span className="badge bg-secondary">Cancelada</span>
                  )}
                </p>
              </div>

              {multa.fechaPago && (
                <div className="col-md-6">
                  <label className="text-muted small">Fecha de Pago</label>
                  <p className="mb-0">{formatearFecha(multa.fechaPago)}</p>
                </div>
              )}

              {multa.prestamo && (
                <div className="col-12">
                  <label className="text-muted small">Préstamo Relacionado</label>
                  <p className="mb-0">
                    <strong>{multa.prestamo.libro?.titulo}</strong>
                    <br />
                    <small>Préstamo del {formatearFecha(multa.prestamo.fechaPrestamo)}</small>
                  </p>
                </div>
              )}

              <div className="col-12">
                <label className="text-muted small">Descripción</label>
                <p className="mb-0">{multa.descripcion}</p>
              </div>

              {multa.fechaCreacion && (
                <div className="col-12">
                  <label className="text-muted small">Fecha de Registro</label>
                  <p className="mb-0">{formatearFechaHora(multa.fechaCreacion)}</p>
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

export default DetalleMulta;