import { useState } from 'react';

function BuscadorLibros({ onBuscar }) {
  const [filtros, setFiltros] = useState({
    termino: '',
    estado: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nuevosFiltros = {
      ...filtros,
      [name]: value
    };
    setFiltros(nuevosFiltros);
    onBuscar(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    const filtrosVacios = {
      termino: '',
      estado: ''
    };
    setFiltros(filtrosVacios);
    onBuscar(filtrosVacios);
  };

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text"
                name="termino"
                className="form-control"
                placeholder="Buscar por título, autor o ISBN..."
                value={filtros.termino}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select 
              name="estado"
              className="form-select"
              value={filtros.estado}
              onChange={handleChange}
            >
              <option value="">Todos los estados</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="PRESTADO">Prestado</option>
            </select>
          </div>
          <div className="col-md-1">
            <button 
              className="btn btn-outline-secondary w-100"
              onClick={limpiarFiltros}
              title="Limpiar filtros"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuscadorLibros;