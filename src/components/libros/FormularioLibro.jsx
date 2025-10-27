// ==================== src/components/libros/FormularioLibro.jsx ====================
import { useState, useEffect } from 'react';
import { GENEROS_LIBRO } from '../../utils/constants';

function FormularioLibro({ libro, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    editorial: '',
    genero: '',
    anioPublicacion: '',
    numeroPaginas: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (libro) {
      setFormData({
        titulo: libro.titulo || '',
        autor: libro.autor || '',
        isbn: libro.isbn || '',
        editorial: libro.editorial || '',
        genero: libro.genero || '',
        anioPublicacion: libro.anioPublicacion || '',
        numeroPaginas: libro.numeroPaginas || '',
        descripcion: libro.descripcion || ''
      });
    }
  }, [libro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es obligatorio';
    }

    if (!formData.autor.trim()) {
      newErrors.autor = 'El autor es obligatorio';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'El ISBN es obligatorio';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-8">
          <label className="form-label">
            Título <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="titulo"
            className={`form-control ${errors.titulo ? 'is-invalid' : ''}`}
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ingrese el título del libro"
          />
          {errors.titulo && (
            <div className="invalid-feedback">{errors.titulo}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">
            ISBN <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="isbn"
            className={`form-control ${errors.isbn ? 'is-invalid' : ''}`}
            value={formData.isbn}
            onChange={handleChange}
            placeholder="978-3-16-148410-0"
          />
          {errors.isbn && (
            <div className="invalid-feedback">{errors.isbn}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Autor <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="autor"
            className={`form-control ${errors.autor ? 'is-invalid' : ''}`}
            value={formData.autor}
            onChange={handleChange}
            placeholder="Nombre del autor"
          />
          {errors.autor && (
            <div className="invalid-feedback">{errors.autor}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Editorial</label>
          <input
            type="text"
            name="editorial"
            className="form-control"
            value={formData.editorial}
            onChange={handleChange}
            placeholder="Nombre de la editorial"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Género</label>
          <select
            name="genero"
            className="form-select"
            value={formData.genero}
            onChange={handleChange}
          >
            <option value="">Seleccione un género</option>
            {GENEROS_LIBRO.map(genero => (
              <option key={genero.value} value={genero.value}>
                {genero.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Año de Publicación</label>
          <input
            type="number"
            name="anioPublicacion"
            className="form-control"
            value={formData.anioPublicacion}
            onChange={handleChange}
            min="1000"
            max={new Date().getFullYear()}
            placeholder="2024"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Número de Páginas</label>
          <input
            type="number"
            name="numeroPaginas"
            className="form-control"
            value={formData.numeroPaginas}
            onChange={handleChange}
            min="1"
            placeholder="300"
          />
        </div>

        <div className="col-12">
          <label className="form-label">Descripción</label>
          <textarea
            name="descripcion"
            className="form-control"
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Breve descripción del libro..."
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
        <button type="submit" className="btn btn-primary">
          <i className="bi bi-save me-2"></i>
          {libro ? 'Actualizar' : 'Guardar'} Libro
        </button>
      </div>
    </form>
  );
}

export default FormularioLibro;
