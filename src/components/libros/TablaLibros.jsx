// ==================== src/components/libros/TablaLibros.jsx ====================
import { formatearFecha } from '../../utils/formatters';

function TablaLibros({ libros, onVer, onEditar, onEliminar }) {
  if (!libros || libros.length === 0) {
    return (
      <div className="alert alert-info">
        <i className="bi bi-info-circle me-2"></i>
        No se encontraron libros
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>ISBN</th>
            <th>Género</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {libros.map((libro) => (
            <tr key={libro.id}>
              <td>
                <strong>{libro.titulo}</strong>
              </td>
              <td>{libro.autor}</td>
              <td>{libro.isbn}</td>
              <td>{libro.genero || '-'}</td>
              <td>
                {libro.estado === 'DISPONIBLE' ? (
                  <span className="badge bg-success">
                    <i className="bi bi-check-circle me-1"></i>
                    Disponible
                  </span>
                ) : (
                  <span className="badge bg-warning text-dark">
                    <i className="bi bi-hourglass-split me-1"></i>
                    Prestado
                  </span>
                )}
              </td>
              <td>
                <div className="btn-group btn-group-sm" role="group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => onVer(libro)}
                    title="Ver detalles"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => onEditar(libro)}
                    title="Editar"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => onEliminar(libro)}
                    title="Eliminar"
                    disabled={libro.estado === 'PRESTADO'}
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

export default TablaLibros;
