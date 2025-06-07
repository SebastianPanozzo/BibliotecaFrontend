import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from 'react';
import Loader from "../../../components/LoadAndErr/Loader";
import Error from "../../../components/LoadAndErr/Error";
import image from "../../../../public/img/bgDark.webp"
import useStore from '../../../hooks/useStore';
import useFetchData from '../../../hooks/useFetchData';
import AppointmentList from "../../../components/AppointmentList";
import { appointmentQuery } from "../../../utiles/querys";
const storedUser = JSON.parse(localStorage.getItem('currentUser'));

// Componente Modal interno mejorado
const EditProfileModal = ({
  id,
  title,
  userData,
  onClose,
  onUpdate
}) => {
  const modalRef = useRef();
  const { trigger: updateTrigger } = useFetchData(`/api/updateUser/${userData._id}`);

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
        birthdate: formData.birthdate ? addThreeHours(formData.birthdate) : ''
      };

      const response = await updateTrigger({
        method: "PUT",
        body: dataToSend,
        headers: { "Authorization": userData.token }
      });

      if (response) {
        setUpdateMessage('Perfil actualizado exitosamente');

        setTimeout(() => {
          // Actualizar con la fecha ajustada
          const updatedUser = {
            ...userData,
            ...dataToSend,
            token: userData.token // Mantener el token
          };
          onUpdate(updatedUser);
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
  const navigateTo = useNavigate();
  const { save, remove } = useStore();
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fech del usuario
  const { trigger, isMutating, error } = useFetchData('/api/findUsers');
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await trigger({
          method: 'POST',
          body: [{ $match: { _id: { "$eq": storedUser._id } } }],
          headers: { "Authorization": storedUser.token }
        });

        // Verificar que la respuesta tenga la estructura correcta
        if (response && response.items && response.items.length > 0) {
          const backendUserData = response.items[0];

          // Combinar datos del backend con token del localStorage
          const completeUserData = {
            ...backendUserData,
            token: storedUser.token // Preservar el token de autenticación
          };

          setUserData(completeUserData);

          // Actualizar localStorage con los datos frescos del backend
          localStorage.setItem('currentUser', JSON.stringify(completeUserData));

          // Actualizar useStore con los datos frescos
          save({ currentUser: completeUserData });
        } else {
          throw new Error('No se encontraron datos del usuario en el servidor');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [trigger, save]);

  //fetch de los turnos
  const {
    trigger: getAppointment,
    isMutating: isMutatingAppointment,
    error: errorInAppointment
  } = useFetchData('/api/findRelations');
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAppointment({
          method: 'POST',
          body: appointmentQuery,
          headers: { "Authorization": storedUser.token }
        });
        setAppointments(res);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetch();
  }, [getAppointment, save]);

  const handleUpdateUser = async (updatedData) => {
    try {
      // Cerrar el modal primero
      setShowModal(false);

      // Actualizar estado local inmediatamente
      setUserData(updatedData);

      // Actualizar localStorage manteniendo la estructura completa
      localStorage.setItem('currentUser', JSON.stringify(updatedData));

      // Actualizar useStore
      save({ currentUser: updatedData });

    } catch (err) {
      console.error('Error updating user data:', err);
    }
  };

  const handleLogout = () => {
    remove("currentUser")
    localStorage.removeItem("currentUser");
    navigateTo('/login');
  }

  if (isMutating) return <Loader context={{ image }} />
  if (error) return <Error backgroundImage={image} />
  if (userData) {
    return (
      <div className="min-vh-100 px-2 bg-spa-img" id="services">
        <div className="container">
          <div className="row m-0 justify-content-center mb-2">
            <div className="col-12 p-0">
              {/* Tarjeta de Perfil que ocupa todo el ancho del container */}
              <div className="card shadow-sm border-0 w-100">
                <div className="card-body p-4">
                  <div className="row">
                    {/* Columna Izquierda - Foto de Perfil */}
                    <div className="col-12 col-md-4 col-lg-3 text-center d-flex align-items-center justify-content-center mb-3">
                      {/* Imagen de fondo por defecto */}
                      <img
                        src={userData.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"}
                        alt="Foto de perfil"
                        className="rounded-circle border border-success border-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                    {/* Columna Derecha - Información del Usuario */}
                    <div className="col-12 col-md-8 col-lg-9">
                      <div className="row g-3">
                        {/* Nombre completo - ahora en la primera fila */}
                        <div className="col-12">
                          <div className="shadow-sm bg-light p-3 rounded border-start border-success border-4">
                            <h3 className="text-success fw-bold mb-0">{userData.name} {userData.last_name}</h3>
                          </div>
                        </div>

                        {/* Primera fila de información */}
                        <div className="col-12 col-lg-6">
                          <div className="shadow-sm bg-light p-2 rounded border-start border-success border-4">
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
                          <div className="shadow-sm bg-light p-2 rounded border-start border-success border-4">
                            <h6 className="text-success fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                              <i className="fas fa-envelope me-2"></i>Correo Electrónico
                            </h6>
                            <p className="mb-0 text-muted ps-2" style={{ fontSize: '0.95rem' }}>{userData.email}</p>
                          </div>
                        </div>

                        {/* Tercera fila de información */}
                        <div className="col-12 col-lg-6">
                          <div className="shadow-sm bg-light p-2 rounded border-start border-success border-4">
                            <h6 className="text-success fw-bold mb-1" style={{ fontSize: '0.9rem' }}>
                              <i className="fas fa-phone me-2"></i>Número de Teléfono
                            </h6>
                            <p className="mb-0 text-muted ps-2" style={{ fontSize: '0.95rem' }}>{userData.phone || 'No especificado'}</p>
                          </div>
                        </div>

                        <div className="col-12 col-lg-6 d-flex justify-content-between justify-content-lg-end align-items-end">
                          <button className='btn btn-outline-success me-3' onClick={() => setShowModal(true)}>Editar perfil</button>
                          <button className='btn btn-success' onClick={handleLogout}>Salir</button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <AppointmentList appointments={appointments} error={errorInAppointment} isMutating={isMutatingAppointment}/>
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
}