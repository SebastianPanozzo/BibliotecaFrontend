// ==================== src/components/socios/FormularioSocio.jsx ====================
import { useState, useEffect } from 'react';

function FormularioSocio({ socio, onSubmit, onCancel, verificarDNI }) {
  const [formData, setFormData] = useState({
    nombre: '',
    dni: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: ''
  });

  const [errors, setErrors] = useState({});
  const [verificandoDNI, setVerificandoDNI] = useState(false);

  useEffect(() => {
    if (socio) {
      setFormData({
        nombre: socio.nombre || '',
        dni: socio.dni || '',
        email: socio.email || '',
        telefono: socio.telefono || '',
        direccion: socio.direccion || '',
        fechaNacimiento: socio.fechaNacimiento || ''
      });
    }
  }, [socio]);

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

  const handleDNIBlur = async () => {
    if (!formData.dni || socio) return; // No verificar si es edición

    setVerificandoDNI(true);
    try {
      const socioExistente = await verificarDNI(formData.dni);
      if (socioExistente) {
        setErrors(prev => ({
          ...prev,
          dni: 'Ya existe un socio con este DNI'
        }));
      }
    } catch (error) {
      console.error('Error al verificar DNI:', error);
    } finally {
      setVerificandoDNI(false);
    }
  };

  const validarFormulario = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es obligatorio';
    } else if (!/^\d+$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe contener solo números';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
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
            Nombre Completo <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre y apellido"
          />
          {errors.nombre && (
            <div className="invalid-feedback">{errors.nombre}</div>
          )}
        </div>

        <div className="col-md-4">
          <label className="form-label">
            DNI <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            name="dni"
            className={`form-control ${errors.dni ? 'is-invalid' : ''}`}
            value={formData.dni}
            onChange={handleChange}
            onBlur={handleDNIBlur}
            placeholder="12345678"
            disabled={!!socio || verificandoDNI}
          />
          {verificandoDNI && (
            <div className="form-text">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Verificando DNI...
            </div>
          )}
          {errors.dni && (
            <div className="invalid-feedback">{errors.dni}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            value={formData.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="col-md-6">
          <label className="form-label">Teléfono</label>
          <input
            type="tel"
            name="telefono"
            className="form-control"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="+54 9 11 1234-5678"
          />
        </div>

        <div className="col-md-8">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            name="direccion"
            className="form-control"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Calle, número, ciudad"
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            name="fechaNacimiento"
            className="form-control"
            value={formData.fechaNacimiento}
            onChange={handleChange}
          />
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
          disabled={verificandoDNI || Object.keys(errors).some(key => errors[key])}
        >
          <i className="bi bi-save me-2"></i>
          {socio ? 'Actualizar' : 'Registrar'} Socio
        </button>
      </div>
    </form>
  );
}

export default FormularioSocio;
