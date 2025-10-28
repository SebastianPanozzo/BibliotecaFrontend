// ==================== src/components/prestamos/DevolucionForm.jsx ====================
import { useState } from 'react';
import { formatearFecha, calcularDiasEntre } from '../../utils/formatters';
import { CONFIG_PRESTAMO } from '../../utils/constants';

function DevolucionForm({ prestamo, onSubmit, onCancel }) {
  const [estadoLibro, setEstadoLibro] = useState('bueno');
  const [observaciones, setObservaciones] = useState('');

  if (!prestamo) return null;

  const fechaDevolucion = new Date(prestamo.fechaDevolucion);
  const hoy = new Date();
  const diasRetraso = calcularDiasEntre(fechaDevolucion, hoy);
  const tieneRetraso = diasRetraso > 0;
  const montoRetraso = tieneRetraso ? diasRetraso * CONFIG_PRESTAMO.MULTA_POR_DIA : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Solo pasamos el estado del libro - las multas se generan en el backend
    const datosDevolucion = {
      estadoLibro: estadoLibro.toUpperCase(), // Enviar en MAYÚSCULAS
      observaciones
    };
    
    onSubmit(datosDevolucion);
  };

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-arrow-return-left me-2"></i>
                Registrar Devolución
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onCancel}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="alert alert-info">
                    <strong>Libro:</strong> {prestamo.libro?.titulo}
                    <br />
                    <strong>Socio:</strong> {prestamo.socio?.nombre}
                    <br />
                    <strong>Fecha de préstamo:</strong> {formatearFecha(prestamo.fechaPrestamo)}
                    <br />
                    <strong>Fecha de devolución:</strong> {formatearFecha(prestamo.fechaDevolucion)}
                  </div>
                </div>

                {tieneRetraso && (
                  <div className="col-12">
                    <div className="alert alert-warning">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>¡Atención!</strong> Este préstamo tiene un retraso de <strong>{diasRetraso} días</strong>.
                      <br />
                      Se registrará automáticamente una multa de <strong>${montoRetraso}</strong>.
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label">
                    Estado del Libro <span className="text-danger">*</span>
                  </label>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="estadoLibro"
                      id="estadoBueno"
                      value="bueno"
                      checked={estadoLibro === 'bueno'}
                      onChange={(e) => setEstadoLibro(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="estadoBueno">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Buenas condiciones
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="estadoLibro"
                      id="estadoDanado"
                      value="danado"
                      checked={estadoLibro === 'danado'}
                      onChange={(e) => setEstadoLibro(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="estadoDanado">
                      <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                      Libro dañado
                    </label>
                  </div>
                </div>

                {estadoLibro === 'danado' && (
                  <div className="col-12">
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Se registrará una multa de <strong>$200</strong> por daños al libro.
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label">Observaciones</label>
                  <textarea
                    className="form-control"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows="3"
                    placeholder="Describa el estado del libro o cualquier observación relevante..."
                  ></textarea>
                </div>

                <div className="col-12">
                  <div className="border rounded p-3 bg-light">
                    <h6>Resumen de la Devolución</h6>
                    <ul className="mb-0">
                      <li>Estado del libro: <strong>{estadoLibro === 'bueno' ? 'Buenas condiciones' : 'Dañado'}</strong></li>
                      {tieneRetraso && (
                        <li className="text-warning">Retraso: {diasRetraso} días - Multa: ${montoRetraso}</li>
                      )}
                      {estadoLibro === 'danado' && (
                        <li className="text-danger">Daño al libro - Multa: $200</li>
                      )}
                      {!tieneRetraso && estadoLibro === 'bueno' && (
                        <li className="text-success">Devolución sin incidentes</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onCancel}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-success"
              >
                <i className="bi bi-check-circle me-2"></i>
                Confirmar Devolución
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DevolucionForm;