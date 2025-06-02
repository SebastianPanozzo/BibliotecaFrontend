// src/pages/Landing/Profile/index.jsx
import { useState, useEffect, useRef } from 'react';
import useStore from '../../../hooks/useStore';
import useFetchData from '../../../hooks/useFetchData';

// Componente Modal interno mejorado
const EditProfileModal = ({ 
  id, 
  title, 
  userData, 
  onClose, 
  onUpdate 
}) => {
  const modalRef = useRef();
  const { trigger: updateTrigger } = useFetchData("/updateUser");
  
  const [formData, setFormData] = useState({
    name: '',
    last_name: '',
    phone: '',
    image: '',
    birthdate: ''
  });
  const [updateMessage, setUpdateMessage] = useState('');

  // Función para ajustar la fecha con 3 horas adicionales
  const addThreeHours = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setHours(date.getHours() + 3);
    return date.toISOString();
  };

  // Función para formatear fecha para input date (sin ajuste de zona horaria)
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        last_name: userData.last_name || '',
        phone: userData.phone || '',
        image: userData.image || '',
        birthdate: userData.birthdate ? formatDateForInput(userData.birthdate) : ''
      });
    }
  }, [userData]);

  useEffect(() => {
    const modal = new window.bootstrap.Modal(modalRef.current);
    modal.show();

    const handleHide = () => {
      onClose?.();
    };

    const currentModalRef = modalRef.current;
    currentModalRef.addEventListener('hidden.bs.modal', handleHide);

    return () => {
      if (currentModalRef) {
        currentModalRef.removeEventListener('hidden.bs.modal', handleHide);
      }
      modal.hide();
    };
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Preparar los datos con la fecha ajustada (+3 horas)
      const dataToSend = {
        ...formData,
        email: userData.email, // Mantener el email actual
        birthdate: formData.birthdate ? addThreeHours(formData.birthdate) : ''
      };

      const response = await updateTrigger({
        method: "POST",
        body: dataToSend,
        headers: { "Authorization": userData.token }
      });

      if (response) {
        setUpdateMessage('Perfil actualizado exitosamente');
        
        setTimeout(() => {
          // Actualizar con la fecha ajustada
          onUpdate({ ...userData, ...dataToSend });
          const modal = window.bootstrap.Modal.getInstance(modalRef.current);
          modal.hide();
        }, 2000);
      }
    } catch (error) {
      setUpdateMessage('Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div
      className="modal fade"
      id={id}
      tabIndex="-1"
      aria-labelledby={`${id}Label`}
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title" id={`${id}Label`}>{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="name" className="form-label text-success fw-bold">
                    <i className="fas fa-user me-2"></i>Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control border-success"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label htmlFor="last_name" className="form-label text-success fw-bold">
                    <i className="fas fa-user me-2"></i>Apellido
                  </label>
                  <input
                    type="text"
                    className="form-control border-success"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="phone" className="form-label text-success fw-bold">
                    <i className="fas fa-phone me-2"></i>Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-control border-success"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ej: +54 9 11 1234-5678"
                  />
                </div>

                <div className="col-12">
                  <label htmlFor="image" className="form-label text-success fw-bold">
                    <i className="fas fa-image me-2"></i>URL de Foto de Perfil
                  </label>
                  <input
                    type="url"
                    className="form-control border-success"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://ejemplo.com/mi-foto.jpg"
                  />
                  <div className="form-text">Ingresa la URL de tu foto de perfil</div>
                </div>

                <div className="col-12">
                  <label htmlFor="birthdate" className="form-label text-success fw-bold">
                    <i className="fas fa-birthday-cake me-2"></i>Fecha de Cumpleaños
                  </label>
                  <input
                    type="date"
                    className="form-control border-success"
                    id="birthdate"
                    name="birthdate"
                    value={formData.birthdate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {updateMessage && (
                <div className={`alert ${updateMessage.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`}>
                  {updateMessage}
                </div>
              )}

              <div className="modal-footer border-0 px-0 pb-0">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  data-bs-dismiss="modal"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success fw-bold"
                >
                  <i className="fas fa-save me-2"></i>Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Profile() {
  const { get } = useStore();
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Obtener datos del usuario desde localStorage o store
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || get()?.currentUser;
    if (currentUser) {
      setUserData(currentUser);
    }
  }, [get]);

  const handleUpdateUser = (updatedData) => {
    setUserData(updatedData);
    localStorage.setItem('currentUser', JSON.stringify(updatedData));
  };

  if (!userData) {
    return (
      <div className="bg-light min-vh-100 px-2 bg-spa-img d-flex justify-content-center align-items-center" id="services">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 px-2 bg-spa-img" id="services">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-8">
            {/* Tarjeta de Perfil - Layout Horizontal */}
            <div className="card shadow-lg border-0">
              <div className="card-header bg-success text-white text-center py-3">
                <h2 className="mb-0 fw-bold">Mi Perfil</h2>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  {/* Columna Izquierda - Foto de Perfil */}
                  <div className="col-12 col-md-4 col-lg-3 text-center mb-4 mb-md-0">
                    <div className="position-relative d-inline-block">
                      {userData.image ? (
                        <img
                          src={userData.image}
                          alt="Foto de perfil"
                          className="rounded-circle border border-success border-3"
                          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`rounded-circle bg-success d-flex align-items-center justify-content-center ${userData.image ? 'd-none' : ''}`}
                        style={{ width: '150px', height: '150px' }}
                      >
                        <i className="fas fa-user text-white" style={{ fontSize: '4rem' }}></i>
                      </div>
                    </div>
                    
                    {/* Botón Editar Perfil */}
                    <div className="mt-3">
                      <button 
                        className="btn btn-success btn-sm px-3 py-2 fw-bold d-flex align-items-center justify-content-center mx-auto"
                        onClick={() => setShowModal(true)}
                        style={{ minWidth: '120px' }}
                      >
                        <i className="fas fa-edit me-1000"></i>Editar Perfil
                      </button>
                    </div>
                  </div>

                  {/* Columna Derecha - Información del Usuario */}
                  <div className="col-12 col-md-8 col-lg-9">
                    <div className="row g-3">
                      {/* Nombre completo - ahora en la primera fila */}
                      <div className="col-12">
                        <div className="bg-light p-3 rounded border-start border-success border-4">
                          <h4 className="text-dark fw-bold mb-0">{userData.name} {userData.last_name}</h4>
                        </div>
                      </div>

                      {/* Primera fila de información */}
                      <div className="col-12 col-lg-6">
                        <div className="border-start border-success border-4 ps-3">
                          <h6 className="text-success fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-calendar-alt me-2"></i>Fecha de Nacimiento
                          </h6>
                          <p className="mb-0 text-muted ps-2" style={{ fontSize: '0.95rem' }}>
                            {userData.birthdate 
                              ? new Date(userData.birthdate).toLocaleDateString('es-ES', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                }).replace(/\//g, '/')
                              : 'No especificada'
                            }
                          </p>
                        </div>
                      </div>

                      {/* Segunda fila de información */}
                      <div className="col-12 col-lg-6">
                        <div className="border-start border-success border-4 ps-3">
                          <h6 className="text-success fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-envelope me-2"></i>Correo Electrónico
                          </h6>
                          <p className="mb-0 text-primary ps-2" style={{ fontSize: '0.95rem' }}>{userData.email}</p>
                        </div>
                      </div>

                      {/* Tercera fila de información */}
                      <div className="col-12 col-lg-6">
                        <div className="border-start border-success border-4 ps-3">
                          <h6 className="text-success fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                            <i className="fas fa-phone me-2"></i>Número de Teléfono
                          </h6>
                          <p className="mb-0 text-muted ps-2" style={{ fontSize: '0.95rem' }}>{userData.phone || 'No especificado'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición */}
      {showModal && (
        <EditProfileModal
          id="editProfileModal"
          title="Editar Perfil"
          userData={userData}
          onClose={() => setShowModal(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}