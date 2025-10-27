// ==================== src/components/prestamos/FormularioPrestamo.jsx ====================
import { useState, useEffect } from 'react';
import { CONFIG_PRESTAMO } from '../../utils/constants';

function FormularioPrestamo({ libros, socios, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idLibro: '',
    idSocio: '',
    diasPrestamo: CONFIG_PRESTAMO.DIAS_DEFAULT,
    observaciones: ''
  });

  const [errors, setErrors] = useState({});
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [busquedaLibro, setBusquedaLibro] = useState('');

  useEffect(() => {
    // Filtrar solo libros disponibles
    const disponibles = libros.filter(libro => libro.estado === 'DISPONIBLE');
    setLibrosFiltrados(disponibles);
  }, [libros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleBusquedaLibro = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusquedaLibro(termino);
    
    if (termino) {
      const filtrados = libros.filter(libro => 
        libro.estado === 'DISPONIBLE' &&
        (libro.titulo.toLowerCase().includes(termino) ||
         libro.autor.toLowerCase().includes(termino) ||
         libro.isbn.includes(termino))
      );
      setLibrosFiltrados(filtrados);
    } else {
      setLibrosFiltrados(libros.filter(libro => libro.estado === 'DISPONIBLE'));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.idLibro) {
      newErrors.idLibro = 'Debe seleccionar un libro';
    }

    if (!formData.idSocio) {
      newErrors.idSocio = 'Debe seleccionar un socio';
    }

    if (formData.diasPrestamo < CONFIG_PRESTAMO.DIAS_MINIMO || 
        formData.diasPrestamo > CONFIG_PRESTAMO.DIAS_MAXIMO) {
      newErrors.diasPrestamo = `Los días deben estar entre ${CONFIG_PRESTAMO.DIAS_MINIMO} y ${CONFIG_PRESTAMO.DIAS_MAXIMO}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      // Calcular fecha de devolución
      const fechaDevolucion = new Date();
      fechaDevolucion.setDate(fechaDevolucion.getDate() + parseInt(formData.diasPrestamo));
      
      onSubmit({
        ...formData,
        fechaDevolucion: fechaDevolucion.toISOString()
      });
    }
  };

  const libroSeleccionado = libros.find(l => l.id === formData.idLibro);
  const socioSeleccionado = socios.find(s => s.id === formData.idSocio);

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-12">
          <label className="form-label">
            Buscar Libro <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control mb-2"
            value={busquedaLibro}
            onChange={handleBusquedaLibro}
            placeholder="Buscar por título, autor o ISBN..."
          />
          <select
            name="idLibro"
            className={`form-select ${errors.idLibro ? 'is-invalid' : ''}`}
            value={formData.idLibro}
            onChange={handleChange}
            size="5"
          >
            <option value="">Seleccione un libro disponible</option>
            {librosFiltrados.map(libro => (
              <option key={libro.id} value={libro.id}>
                {libro.titulo} - {libro.autor} ({libro.isbn})
              </option>
            ))}
          </select>
          {errors.idLibro && (
            <div className="invalid-feedback">{errors.idLibro}</div>
          )}
          {librosFiltrados.length === 0 && (
            <div className="form-text text-warning">
              No hay libros disponibles para préstamo
            </div>
          )}
        </div>

        {libroSeleccionado && (
          <div className="col-12">
            <div className="alert alert-info">
              <strong>Libro seleccionado:</strong> {libroSeleccionado.titulo}
              <br />
              <small>Autor: {libroSeleccionado.autor} | ISBN: {libroSeleccionado.isbn}</small>
            </div>
          </div>
        )}

        <div className="col-12">
          <label className="form-label">
            Socio <span className="text-danger">*</span>
          </label>
          <select
            name="idSocio"
            className={`form-select ${errors.idSocio ? 'is-invalid' : ''}`}
            value={formData.idSocio}
            onChange={handleChange}
          >
            <option value="">Seleccione un socio</option>
            {socios.filter(s => s.activo).map(socio => (
              <option key={socio.id} value={socio.id}>
                {socio.nombre} - {socio.numeroSocio} (DNI: {socio.dni})
              </option>
            ))}
          </select>
          {errors.idSocio && (
            <div className="invalid-feedback">{errors.idSocio}</div>
          )}
        </div>

        {socioSeleccionado && (
          <div className="col-12">
            <div className="alert alert-success">
              <strong>Socio seleccionado:</strong> {socioSeleccionado.nombre}
              <br />
              <small>N° Socio: {socioSeleccionado.numeroSocio} | DNI: {socioSeleccionado.dni}</small>
            </div>
          </div>
        )}

        <div className="col-md-6">
          <label className="form-label">
            Días de Préstamo <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            name="diasPrestamo"
            className={`form-control ${errors.diasPrestamo ? 'is-invalid' : ''}`}
            value={formData.diasPrestamo}
            onChange={handleChange}
            min={CONFIG_PRESTAMO.DIAS_MINIMO}
            max={CONFIG_PRESTAMO.DIAS_MAXIMO}
          />
          {errors.diasPrestamo && (
            <div className="invalid-feedback">{errors.diasPrestamo}</div>
          )}
          <div className="form-text">
            Entre {CONFIG_PRESTAMO.DIAS_MINIMO} y {CONFIG_PRESTAMO.DIAS_MAXIMO} días
          </div>
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha de Devolución Estimada</label>
          <input
            type="text"
            className="form-control"
            value={new Date(Date.now() + formData.diasPrestamo * 24 * 60 * 60 * 1000).toLocaleDateString('es-AR')}
            disabled
          />
        </div>

        <div className="col-12">
          <label className="form-label">Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            value={formData.observaciones}
            onChange={handleChange}
            rows="2"
            placeholder="Observaciones adicionales (opcional)"
          ></textarea>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={librosFiltrados.length === 0}
        >
          <i className="bi bi-check-circle me-2"></i>
          Registrar Préstamo
        </button>
      </div>
    </form>
  );
}

export default FormularioPrestamo;