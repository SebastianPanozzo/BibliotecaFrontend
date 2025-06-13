import { useState, useEffect } from "react"
import useFetchData from "../../../hooks/useFetchData"
import { queryAdminServices } from "../../../utiles/querys"
import DinamicModal from "../../../components/DinamicModal"

// Asumiendo que currentUser se maneja de forma consistente
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

export default function Index() {
    const { trigger, isMutating } = useFetchData("/api/findObjects");
    const { trigger: deleteService } = useFetchData(`/api/deleteObject`);
    const [services, setServices] = useState();
    const [search, setSearch] = useState("");
    const [serviceDeleted, setServiceDeleted] = useState(false);
    const [errorDeleting, setErrorDeleting] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await trigger({
                    method: 'POST',
                    body: queryAdminServices,
                    headers: { "Authorization": currentUser.token }
                });
                setServices(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
                // Aquí podrías mostrar un mensaje de error al usuario
            }
        }
        fetchServices();
    }, [trigger]);

    const filteredServices = services?.filter((service) => {
        const fullName = `${service.name} ${service.type}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    const handleRemoveService = async (id) => {
        try {
            await deleteService({
                method: 'DELETE',
                id: `/${id}`,
                body: {},
                headers: { "Authorization": currentUser.token }
            });
            setServiceDeleted(true);
            setErrorDeleting(null);
            setTimeout(() => window.location.reload(), 1500); // Recargar para ver los cambios
        } catch (error) {
            console.error("Error al eliminar el servicio:", error);
            setErrorDeleting("Error al eliminar el servicio. Inténtalo de nuevo.");
            setServiceDeleted(false);
        }
    }

    return (
        <div className="container-fluid p-0">
            {/* Encabezado */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded border-start border-success border-4">
                    <h3 className="text-success fw-bold mb-0">Administración de Servicios</h3>
                </div>
            </div>

            {/* Barra de búsqueda y botón nuevo */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="d-flex w-100 w-md-auto">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o categoría..."
                            className="form-control me-2 border-success"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button
                            className="btn btn-success d-flex align-items-center"
                            data-bs-toggle="modal"
                            data-bs-target="#newService"
                        >
                            <i className="bi bi-plus-lg me-2"></i> Nuevo
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal para crear nuevo servicio */}
            <NewServiceModal />

            {/* Estados de carga y error */}
            {isMutating && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-info text-center mb-0 text-info shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Cargando servicios</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de Servicios */}
            {!isMutating && (
                <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded">
                    <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center mb-3">
                        <h4 className="text-success fw-bold mb-0 lh-1">Servicios Disponibles</h4>
                        <h5 className="bg-success rounded text-white p-2 mb-1 flex-shrink-0">
                            <i className="bi bi-list-check"></i> {filteredServices?.length || 0}
                        </h5>
                    </div>
                    <div className="col-12 p-0">
                        {filteredServices?.length > 0 ? (
                            filteredServices.map((service) => (
                                <div key={service._id} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">
                                    {/* Imagen del servicio */}
                                    <div className="col-sm-2 col-lg-1 d-flex justify-content-center p-sm-0 mb-3 mb-sm-0" style={{ maxHeight: '100px' }}>
                                        <img
                                            src={service.image || "https://energiaelectrica.com.ar/images/default.jpg"}
                                            alt={service.name}
                                            className="img-fluid rounded"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>

                                    {/* Datos del Servicio */}
                                    <div className="col-sm-6 col-lg-7 mb-3 mb-sm-0">
                                        <h5 className="mb-1 text-success fw-bold">{service.name}</h5>
                                        <p className="m-0 text-muted mb-2 text-truncate" title={service.description} style={{ fontSize: '0.9rem' }}>
                                            {service.description}
                                        </p>
                                        <div className="d-flex flex-wrap align-items-center">
                                            <span className="badge bg-success me-2 mb-1">{service.type}</span>
                                            <span className="text-muted me-3 mb-1">
                                                <i className="bi bi-clock me-1 text-primary"></i>
                                                <strong className="text-primary">{service.props.duration} min</strong>
                                            </span>
                                            <span className="text-muted mb-1">
                                                <i className="bi bi-currency-dollar me-1 text-success"></i>
                                                <strong className="text-success">${service.props.price.toLocaleString('es-AR')}</strong>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="col-sm-4 col-lg-4 d-flex align-items-center justify-content-center justify-content-sm-end">
                                        <div className="d-flex flex-column flex-sm-row w-100 justify-content-end justify-content-md-ceneter">
                                            <button
                                                className="btn btn-outline-primary btn-sm mb-2 mb-sm-0 me-sm-2"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#edit-${service._id}`}
                                            >
                                                <i className="bi bi-pencil-square me-1"></i> Editar
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-sm"
                                                data-bs-toggle="modal"
                                                data-bs-target={`#delete-${service._id}`}
                                            >
                                                <i className="bi bi-trash me-1"></i> Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    {/* Modal para eliminar servicio */}
                                    <DinamicModal id={`delete-${service._id}`} title={"Confirmar Eliminación"}>
                                        <div className="p-3">
                                            <p className="text-center mb-4 fs-5">
                                                ¿Estás seguro de eliminar el servicio <strong className="text-danger">{service.name}</strong>?
                                            </p>
                                            <div className="d-flex justify-content-center">
                                                <button
                                                    className="btn btn-danger me-2"
                                                    onClick={() => handleRemoveService(service._id)}
                                                >
                                                    <i className="bi bi-trash me-1"></i> Sí, Eliminar
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    data-bs-dismiss="modal"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                            {serviceDeleted && (
                                                <div className="alert alert-success mt-3 text-center" role="alert">
                                                    <i className="bi bi-check-circle me-1"></i> Servicio eliminado correctamente.
                                                </div>
                                            )}
                                            {errorDeleting && (
                                                <div className="alert alert-danger mt-3 text-center" role="alert">
                                                    <i className="bi bi-exclamation-triangle me-1"></i> {errorDeleting}
                                                </div>
                                            )}
                                        </div>
                                    </DinamicModal>

                                    {/* Modal para editar servicio */}
                                    <DinamicModal id={`edit-${service._id}`} title={`Editar ${service.name}`}>
                                        <EditServiceModal service={service} />
                                    </DinamicModal>
                                </div>
                            ))
                        ) : (
                            <p className="text-center mt-3 text-muted">No se encontraron servicios que coincidan con la búsqueda.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// Componente para crear nuevo servicio
const NewServiceModal = () => {
    const { trigger: createService } = useFetchData("/api/createObject");
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        access: "public",
        owner: import.meta.env.VITE_SPA_ID,
        image: '',
        type: '',
        props: {
            duration: 0,
            price: 0,
            materials_included: [],
            service_unit: "6819fccf6b483e8f69f3ca15"
        }
    });
    const [serviceCreated, setServiceCreated] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({}); // Para validación de formulario

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "El nombre es requerido.";
        if (!formData.description) newErrors.description = "La descripción es requerida.";
        if (!formData.type) newErrors.type = "El tipo de servicio es requerido.";
        if (formData.props.duration <= 0) newErrors.duration = "La duración debe ser mayor a 0.";
        if (formData.props.price <= 0) newErrors.price = "El precio debe ser mayor a 0.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.props) {
            setFormData(prev => ({
                ...prev,
                props: {
                    ...prev.props,
                    [name]: name === 'duration' || name === 'price'
                        ? Number(value)
                        : name === 'materials_included'
                            ? value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                            : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors(prev => ({ ...prev, [name]: '' })); // Limpia el error al cambiar el campo
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            setIsError(true);
            setServiceCreated("Por favor, corrige los errores del formulario.");
            return;
        }

        try {
            await createService({
                method: 'POST',
                body: {
                    type: "service",
                    ...formData,
                    owner: "6819fccf6b483e8f69f3ca15"
                },
                headers: { "Authorization": currentUser.token }
            });

            setServiceCreated("Servicio creado correctamente.");
            setIsError(false);
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setServiceCreated("Error al crear el servicio. Inténtalo de nuevo.");
            setIsError(true);
            console.error("Error al crear servicio:", error);
        }
    };

    return (
        <DinamicModal id="newService" title="Crear Nuevo Servicio">
            <div className="container-fluid p-3">
                <form>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label text-success fw-bold">Nombre del Servicio <span className="text-danger">*</span></label>
                        <input
                            type="text"
                            className={`form-control border-success ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="description" className="form-label text-success fw-bold">Descripción <span className="text-danger">*</span></label>
                        <textarea
                            className={`form-control border-success ${errors.description ? 'is-invalid' : ''}`}
                            id="description"
                            name="description"
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="image" className="form-label text-success fw-bold">URL de la imagen</label>
                        <input
                            type="text"
                            className="form-control border-success"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Ej: https://ejemplo.com/imagen.jpg"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="type" className="form-label text-success fw-bold">Tipo de servicio <span className="text-danger">*</span></label>
                        <select
                            className={`form-select border-success ${errors.type ? 'is-invalid' : ''}`}
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="massage">Masaje</option>
                            <option value="beauty">Belleza</option>
                            <option value="facial_treatment">Tratamiento Facial</option>
                            <option value="body_treatment">Tratamiento Corporal</option>
                            <option value="group_service">Servicio Grupal</option>
                        </select>
                        {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="duration" className="form-label text-success fw-bold">Duración (minutos) <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className={`form-control border-success ${errors.duration ? 'is-invalid' : ''}`}
                                id="duration"
                                name="duration"
                                value={formData.props.duration}
                                onChange={handleChange}
                                min="0"
                            />
                            {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="price" className="form-label text-success fw-bold">Precio <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className={`form-control border-success ${errors.price ? 'is-invalid' : ''}`}
                                id="price"
                                name="price"
                                value={formData.props.price}
                                onChange={handleChange}
                                min="0"
                            />
                            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="materials_included" className="form-label text-success fw-bold">Materiales incluidos (separados por comas)</label>
                        <input
                            type="text"
                            className="form-control border-success"
                            id="materials_included"
                            name="materials_included"
                            value={formData.props.materials_included?.join(', ') || ''}
                            onChange={handleChange}
                            placeholder="Ej: Toallas, Aceites, Piedras"
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="btn btn-success btn-lg fw-bold"
                        >
                            <i className="bi bi-save me-2"></i> Crear Servicio
                        </button>
                    </div>
                </form>

                {serviceCreated && (
                    <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3 text-center shadow-sm`} role="alert">
                        <i className={`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                        {serviceCreated}
                    </div>
                )}
            </div>
        </DinamicModal>
    );
};

// Componente para editar servicio
const EditServiceModal = ({ service }) => {
    const { trigger: updateService } = useFetchData("/api/updateObject");
    const [formData, setFormData] = useState({
        ...service,
        props: {
            ...service.props,
            materials_included: service.props.materials_included || [] // Si es undefined, usa un array vacío
        }
    });
    const [serviceUpdated, setServiceUpdated] = useState(null);
    const [isError, setIsError] = useState(false);
    const [errors, setErrors] = useState({}); // Para validación de formulario

    useEffect(() => {
        if (service) {
            setFormData(service);
        }
    }, [service]);

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = "El nombre es requerido.";
        if (!formData.description) newErrors.description = "La descripción es requerida.";
        if (!formData.type) newErrors.type = "El tipo de servicio es requerido.";
        if (formData.props.duration <= 0) newErrors.duration = "La duración debe ser mayor a 0.";
        if (formData.props.price <= 0) newErrors.price = "El precio debe ser mayor a 0.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name in formData.props) {
            setFormData(prev => ({
                ...prev,
                props: {
                    ...prev.props,
                    [name]: name === 'duration' || name === 'price'
                        ? Number(value)
                        : name === 'materials_included'
                            ? value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
                            : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleUpdate = async () => {
        if (!validateForm()) {
            setIsError(true);
            setServiceUpdated("Por favor, corrige los errores del formulario.");
            return;
        }

        const { _id, ...sendUpdateService } = formData;

        try {
            await updateService({
                method: 'PUT',
                id: `/${service._id}`,
                body: sendUpdateService,
                headers: { "Authorization": currentUser.token }
            });

            setServiceUpdated("Servicio actualizado correctamente.");
            setIsError(false);
            setTimeout(() => window.location.reload(), 1500);
        } catch (error) {
            setServiceUpdated("Error al actualizar el servicio. Inténtalo de nuevo.");
            setIsError(true);
            console.error("Error al actualizar servicio:", error);
        }
    };

    return (
        <div className="container-fluid p-3">
            <form>
                <div className="mb-3">
                    <label htmlFor="edit-name" className="form-label text-success fw-bold">Nombre del Servicio <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        className={`form-control border-success ${errors.name ? 'is-invalid' : ''}`}
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="edit-description" className="form-label text-success fw-bold">Descripción <span className="text-danger">*</span></label>
                    <textarea
                        className={`form-control border-success ${errors.description ? 'is-invalid' : ''}`}
                        id="edit-description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {errors.description && <div className="invalid-feedback">{errors.description}</div>}
                </div>

                <div className="mb-3">
                    <label htmlFor="edit-image" className="form-label text-success fw-bold">URL de la imagen</label>
                    <input
                        type="text"
                        className="form-control border-success"
                        id="edit-image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Ej: https://ejemplo.com/imagen.jpg"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="edit-type" className="form-label text-success fw-bold">Tipo de servicio <span className="text-danger">*</span></label>
                    <select
                        className={`form-select border-success ${errors.type ? 'is-invalid' : ''}`}
                        id="edit-type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                    >
                        <option value="massage">Masaje</option>
                        <option value="beauty">Belleza</option>
                        <option value="facial_treatment">Tratamiento Facial</option>
                        <option value="body_treatment">Tratamiento Corporal</option>
                        <option value="group_service">Servicio Grupal</option>
                    </select>
                    {errors.type && <div className="invalid-feedback">{errors.type}</div>}
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="edit-duration" className="form-label text-success fw-bold">Duración (minutos) <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className={`form-control border-success ${errors.duration ? 'is-invalid' : ''}`}
                            id="edit-duration"
                            name="duration"
                            value={formData.props.duration}
                            onChange={handleChange}
                            min="0"
                        />
                        {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="edit-price" className="form-label text-success fw-bold">Precio <span className="text-danger">*</span></label>
                        <input
                            type="number"
                            className={`form-control border-success ${errors.price ? 'is-invalid' : ''}`}
                            id="edit-price"
                            name="price"
                            value={formData.props.price}
                            onChange={handleChange}
                            min="0"
                        />
                        {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="edit-materials_included" className="form-label text-success fw-bold">Materiales incluidos (separados por comas)</label>
                    <input
                        type="text"
                        className="form-control border-success"
                        id="edit-materials_included"
                        name="materials_included"
                        value={formData.props.materials_included?.join(', ') || ''}
                        onChange={handleChange}
                        placeholder="Ej: Toallas, Aceites, Piedras"
                    />
                </div>

                <div className="d-grid gap-2">
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="btn btn-primary btn-lg fw-bold"
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i> Actualizar Servicio
                    </button>
                </div>
            </form>

            {serviceUpdated && (
                <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} mt-3 text-center shadow-sm`} role="alert">
                    <i className={`bi ${isError ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
                    {serviceUpdated}
                </div>
            )}
        </div>
    );
};