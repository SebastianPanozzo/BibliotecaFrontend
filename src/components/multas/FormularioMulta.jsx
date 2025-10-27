// ==================== src/components/multas/FormularioMulta.jsx ====================
import { useState, useEffect } from 'react';
import { TIPO_MULTA } from '../../utils/constants';

function FormularioMulta({ socios, prestamos, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    idSocio: '',
    idPrestamo: '',
    tipoMulta: 'OTROS',
    monto: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});

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

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.idSocio) {
      newErrors.idSocio = 'Debe seleccionar un socio';
    }

    if (!formData.monto || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'El monto debe ser mayor a 0';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      onSubmit({
        ...formData,
        monto: parseFloat(formData.monto)
      });
    }
  };

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
    <form onSubmit={handleSubmit}>
      <div className="row g-3">
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

        <div className="col-md-6">
          <label className="form-label">
            Tipo de Multa <span className="text-danger">*</span>
          </label>
          <select
            name="tipoMulta"
            className="form-select"
            value={formData.tipoMulta}
            onChange={handleChange}
          >
            {Object.keys(TIPO_MULTA).map(tipo => (
              <option key={tipo} value={tipo}>
                {getTipoLabel(tipo)}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">
            Monto <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              name="monto"
              className={`form-control ${errors.monto ? 'is-invalid' : ''}`}
              value={formData.monto}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
            {errors.monto && (
              <div className="invalid-feedback">{errors.monto}</div>
            )}
          </div>
        </div>

        <div className="col-12">
          <label className="form-label">Préstamo Relacionado (opcional)</label>
          <select
            name="idPrestamo"
            className="form-select"
            value={formData.idPrestamo}
            onChange={handleChange}
          >
            <option value="">Sin préstamo asociado</option>
            {prestamos.filter(p => p.idSocio === formData.idSocio && p.estadoPrestamo !== 'DEVUELTO').map(prestamo => (
              <option key={prestamo.id} value={prestamo.id}>
                {prestamo.libro?.titulo} - Préstamo del {new Date(prestamo.fechaPrestamo).toLocaleDateString('es-AR')}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
          <label className="form-label">
            Descripción <span className="text-danger">*</span>
          </label>
          <textarea
            name="descripcion"
            className={`form-control ${errors.descripcion ? 'is-invalid' : ''}`}
            value={formData.descripcion}
            onChange={handleChange}
            rows="3"
            placeholder="Describa el motivo de la multa..."
          ></textarea>
          {errors.descripcion && (
            <div className="invalid-feedback">{errors.descripcion}</div>
          )}
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
          Registrar Multa
        </button>
      </div>
    </form>
  );
}

export default FormularioMulta;