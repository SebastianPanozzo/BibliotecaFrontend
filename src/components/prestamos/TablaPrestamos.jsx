// ==================== src/components/prestamos/TablaPrestamos.jsx ====================
import { formatearFecha, esFechaVencida } from '../../utils/Formatters';

function TablaPrestamos({ prestamos, onVer, onDevolver, onRenovar }) {
  if (!prestamos || prestamos.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron préstamos
      </div>
    );
  }

  const getEstadoBadge = (prestamo) => {
    if (prestamo.estadoPrestamo === 'DEVUELTO') {
      return <span className="badge bg-secondary">Devuelto</span>;
    }
    if (esFechaVencida(prestamo.fechaDevolucion)) {
      return <span className="badge bg-danger">Vencido</span>;
    }
    return <span className="badge bg-success">Activo</span>;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Libro</th>
            <th>Socio</th>
            <th>Fecha Préstamo</th>
            <th>Fecha Devolución</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prestamos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td>
                <strong>{prestamo.libro?.titulo || 'Libro no encontrado'}</strong>
                <br />
                <small className="text-muted">{prestamo.libro?.autor}</small>
              </td>
              <td>
                <strong>{prestamo.socio?.nombre || 'Socio no encontrado'}</strong>
                <br />
                <small className="text-muted">{prestamo.socio?.numeroSocio}</small>
              </td>
              <td>{formatearFecha(prestamo.fechaPrestamo)}</td>
              <td>
                {formatearFecha(prestamo.fechaDevolucion)}
                {esFechaVencida(prestamo.fechaDevolucion) && prestamo.estadoPrestamo === 'ACTIVO' && (
                  <span className="badge bg-danger ms-2">
                    <i className="bi bi-exclamation-triangle"></i>
                  </span>
                )}
              </td>
              <td>{getEstadoBadge(prestamo)}</td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => onVer(prestamo)}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  {prestamo.estadoPrestamo === 'ACTIVO' && (
                    <>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => onDevolver(prestamo)}
                        title="Registrar devolución"
                      >
                        <i className="bi bi-arrow-return-left"></i>
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => onRenovar(prestamo)}
                        title="Renovar préstamo"
                      >
                        <i className="bi bi-arrow-repeat"></i>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaPrestamos;