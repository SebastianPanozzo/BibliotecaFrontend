// ==================== src/components/socios/TablaSocios.jsx ====================
import { formatearFecha } from '../../utils/formatters';

function TablaSocios({ socios, onVer, onEditar, onDesactivar, onEliminar }) {
  if (!socios || socios.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron socios
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Número de Socio</th>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {socios.map((socio) => (
            <tr key={socio.id}>
              <td>
                <code>{socio.numeroSocio}</code>
              </td>
              <td>
                <strong>{socio.nombre}</strong>
              </td>
              <td>{socio.dni}</td>
              <td>{socio.email || '-'}</td>
              <td>
                {socio.activo ? (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Activo
                  </span>
                ) : (
                  <span className="badge bg-secondary">
                    <i className="bi bi-x-circle me-1"></i>
                    Inactivo
                  </span>
                )}
              </td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => onVer(socio)}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => onEditar(socio)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  {socio.activo && (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => onDesactivar(socio)}
                      title="Desactivar"
                    >
                      <i className="bi bi-pause-circle"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => onEliminar(socio)}
                    title="Eliminar"
                    disabled={socio.activo}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TablaSocios;
