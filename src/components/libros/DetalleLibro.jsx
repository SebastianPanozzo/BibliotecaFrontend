// ==================== src/components/libros/DetalleLibro.jsx ====================
import { formatearFecha } from '../../utils/Formatters';
import { GENEROS_LIBRO } from '../../utils/constants';

function DetalleLibro({ libro, onClose }) {
  if (!libro) return null;

  const generoLabel = GENEROS_LIBRO.find(g => g.value === libro.genero)?.label || libro.genero;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-book me-2"></i>
              Detalles del Libro
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
                <h4 className="text-primary">{libro.titulo}</h4>
                <p className="text-muted mb-0">
                  <i className="bi bi-person me-2"></i>
                  {libro.autor}
                </p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">ISBN</label>
                <p className="mb-0 fw-bold">{libro.isbn}</p>
              </div>

              <div className="col-md-6">
                <label className="text-muted small">Estado</label>
                <p className="mb-0">
                  {libro.estado === 'DISPONIBLE' ? (
                    <span className="badge bg-success">Disponible</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Prestado</span>
                  )}
                </p>
              </div>

              {libro.editorial && (
                <div className="col-md-6">
                  <label className="text-muted small">Editorial</label>
                  <p className="mb-0">{libro.editorial}</p>
                </div>
              )}

              {libro.genero && (
                <div className="col-md-6">
                  <label className="text-muted small">Género</label>
                  <p className="mb-0">{generoLabel}</p>
                </div>
              )}

              {libro.anioPublicacion && (
                <div className="col-md-6">
                  <label className="text-muted small">Año de Publicación</label>
                  <p className="mb-0">{libro.anioPublicacion}</p>
                </div>
              )}

              {libro.numeroPaginas && (
                <div className="col-md-6">
                  <label className="text-muted small">Número de Páginas</label>
                  <p className="mb-0">{libro.numeroPaginas}</p>
                </div>
              )}

              {libro.numeroAcceso && (
                <div className="col-md-6">
                  <label className="text-muted small">Número de Acceso</label>
                  <p className="mb-0">
                    <code>{libro.numeroAcceso}</code>
                  </p>
                </div>
              )}

              {libro.descripcion && (
                <div className="col-12">
                  <label className="text-muted small">Descripción</label>
                  <p className="mb-0">{libro.descripcion}</p>
                </div>
              )}

              {libro.fechaCreacion && (
                <div className="col-12">
                  <label className="text-muted small">Fecha de Registro</label>
                  <p className="mb-0">{formatearFecha(libro.fechaCreacion)}</p>
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

export default DetalleLibro;