// ==================== src/components/multas/TablaMultas.jsx ====================
import { formatearFecha, formatearMoneda } from '../../utils/Formatters';

function TablaMultas({ multas, onVer, onPagar, onCancelar }) {
  if (!multas || multas.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron multas
      </div>
    );
  }

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return <span className="badge bg-warning text-dark">Pendiente</span>;
      case 'PAGADA':
        return <span className="badge bg-success">Pagada</span>;
      case 'CANCELADA':
        return <span className="badge bg-secondary">Cancelada</span>;
      default:
        return <span className="badge bg-secondary">{estado}</span>;
    }
  };

  const getTipoLabel = (tipo) => {
    const tipos = {
      'RETRASO': 'Retraso',
      'DANO': 'Daño',
      'PERDIDA': 'Pérdida',
      'OTROS': 'Otros'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Socio</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {multas.map((multa) => (
            <tr key={multa.id}>
              <td>
                <strong>{multa.socio?.nombre || 'Socio no encontrado'}</strong>
                <br />
                <small className="text-muted">{multa.socio?.numeroSocio}</small>
              </td>
              <td>
                <span className="badge bg-info text-dark">
                  {getTipoLabel(multa.tipoMulta)}
                </span>
              </td>
              <td>{multa.descripcion}</td>
              <td>
                <strong className="text-danger">{formatearMoneda(multa.monto)}</strong>
              </td>
              <td>{formatearFecha(multa.fechaMulta)}</td>
              <td>{getEstadoBadge(multa.estadoMulta)}</td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => onVer(multa)}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  {multa.estadoMulta === 'PENDIENTE' && (
                    <>
                      <button
                        className="btn btn-outline-success"
                        onClick={() => onPagar(multa)}
                        title="Registrar pago"
                      >
                        <i className="bi bi-cash"></i>
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => onCancelar(multa)}
                        title="Cancelar multa"
                      >
                        <i className="bi bi-x-circle"></i>
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

export default TablaMultas;