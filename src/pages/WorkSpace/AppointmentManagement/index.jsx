import { useState, useEffect, useMemo } from "react"
import Calendar from "../../../components/Calendar"
import useFetchData from '../../../hooks/useFetchData';

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Query para obtener los turnos (similar a la de analytics pero adaptada)
const appointmentQuery = (selectedMonth = null) => {
    const now = new Date();
    let startDate, endDate;
    
    if (selectedMonth) {
        // Si hay un mes seleccionado, obtener turnos de ese mes
        startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1);
    } else {
        // Por defecto, obtener turnos del mes actual
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    return [
        {
            "$match": {
                "type": "spa_appointment",
                "$expr": {
                    "$and": [
                        {
                            "$gte": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": startDate.toISOString()
                                    }
                                }
                            ]
                        },
                        {
                            "$lt": [
                                "$duration.start",
                                {
                                    "$dateFromString": {
                                        "dateString": endDate.toISOString()
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$lookup": {
                "from": "users",
                "localField": "tags",
                "foreignField": "email",
                "as": "user",
                "pipeline": [
                    {
                        "$project": {
                            "name": true,
                            "last_name": true,
                            "email": true,
                            "image": true
                        }
                    }
                ]
            }
        },
        {
            "$unwind": "$user"
        },
        {
            "$project": {
                "_id": 1,
                "status": 1,
                "user": 1,
                "services": "$props.services",
                "professional": "$props.professional",
                "discount": "$props.discount",
                "date": "$duration.start" // Usar duration.start como fecha del turno
            }
        }
    ];
};

export default function AppointmentManagement() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [month, setMonth] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const [search, setSearch] = useState("");

    // Fetch de los turnos usando findEvents (como en analytics)
    const { 
        trigger: getAppointments, 
        isMutating, 
        error 
    } = useFetchData('/api/findEvents');

    // Función para obtener turnos
    const fetchAppointments = async (selectedMonth = null) => {
        try {
            const response = await getAppointments({
                method: 'POST',
                body: appointmentQuery(selectedMonth),
                headers: { "Authorization": currentUser.token }
            });
            setAppointments(response?.items || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    // Efecto inicial para cargar turnos
    useEffect(() => {
        fetchAppointments();
    }, [getAppointments]);

    // Efecto para cuando cambia el mes
    useEffect(() => {
        if (month) {
            console.log("cambió el mes:", month);
            fetchAppointments(month);
        }
    }, [month]);

    // Effect para cuando cambia el día
    useEffect(() => {
        if (selectedDate) {
            console.log("cambió el día:", selectedDate);
        }
    }, [selectedDate]);

    // Procesar eventos para el calendario - FORMATO CORREGIDO
    const calendarEvents = useMemo(() => {
        if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
            return [];
        }
        
        // Crear un array de strings de fechas con formato que espera el calendario
        const eventDates = [];
        
        appointments.forEach(appointment => {
            if (appointment.date) {
                try {
                    const appointmentDate = new Date(appointment.date);
                    if (!isNaN(appointmentDate.getTime())) {
                        // Formatear la fecha como string en formato ISO (YYYY-MM-DD)
                        const dateString = appointmentDate.toISOString().split('T')[0];
                        if (!eventDates.includes(dateString)) {
                            eventDates.push(dateString);
                        }
                    }
                } catch (error) {
                    console.warn('Error parsing date:', appointment.date, error);
                }
            }
        });

        return eventDates;
    }, [appointments]);

    // Obtener turnos para la fecha seleccionada
    const appointmentsForSelectedDate = useMemo(() => {
        if (!selectedDate || !appointments || !Array.isArray(appointments) || appointments.length === 0) {
            return [];
        }
        
        const selectedDateString = new Date(selectedDate).toDateString();
        return appointments.filter(appointment => {
            if (!appointment.date) return false;
            try {
                return new Date(appointment.date).toDateString() === selectedDateString;
            } catch (error) {
                console.warn('Error comparing dates:', appointment.date, error);
                return false;
            }
        });
    }, [selectedDate, appointments]);

    // Agrupar turnos por usuario
    const appointmentsByUser = useMemo(() => {
        if (!appointmentsForSelectedDate || appointmentsForSelectedDate.length === 0) {
            return [];
        }
        
        const userGroups = {};
        
        appointmentsForSelectedDate.forEach(appointment => {
            const userId = appointment.user?._id;
            if (!userId) return;
            
            if (!userGroups[userId]) {
                userGroups[userId] = {
                    user: appointment.user,
                    appointments: []
                };
            }
            userGroups[userId].appointments.push(appointment);
        });

        // Filtrar por búsqueda si existe
        const filtered = Object.values(userGroups);
        if (search && search.trim()) {
            return filtered.filter(group => {
                const fullName = `${group.user.name || ''} ${group.user.last_name || ''} ${group.user.email || ''}`.toLowerCase();
                return fullName.includes(search.toLowerCase().trim());
            });
        }
        
        return filtered;
    }, [appointmentsForSelectedDate, search]);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            console.warn('Error formatting date:', dateString, error);
            return 'Fecha inválida';
        }
    };

    const formatTime = (dateString) => {
        try {
            return new Date(dateString).toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.warn('Error formatting time:', dateString, error);
            return 'Hora inválida';
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { class: 'bg-warning text-warning', text: 'Pendiente', icon: 'bi-clock' },
            finished: { class: 'bg-success text-success', text: 'Finalizado', icon: 'bi-check-circle' },
            cancelled: { class: 'bg-danger text-danger', text: 'Cancelado', icon: 'bi-x-circle' }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        return (
            <span className={`badge ${config.class} bg-opacity-25`}>
                <i className={`${config.icon} me-1`}></i>
                {config.text}
            </span>
        );
    };

    return (
        <div className="container-fluid p-0">
            {/* Encabezado */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded border-start border-success border-4">
                    <h3 className="text-success fw-bold mb-0">Gestión de Turnos</h3>
                </div>
            </div>

            <div className="row m-0">
                {/* Columna del Calendario */}
                <div className="col-lg-6 mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom border-success border-2">
                            <h5 className="text-success fw-bold mb-0">
                                <i className="bi bi-calendar3 me-2"></i>
                                Calendario de Turnos
                            </h5>
                        </div>
                        <div className="card-body p-0">
                            <Calendar 
                                context={{ 
                                    events: calendarEvents, 
                                    setMonth, 
                                    setDate: setSelectedDate 
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Columna de Turnos */}
                <div className="col-lg-6 mb-3">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white border-bottom border-success border-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="text-success fw-bold mb-0">
                                    <i className="bi bi-list-ul me-2"></i>
                                    Turnos del Día
                                </h5>
                                {selectedDate && (
                                    <span className="badge bg-success">
                                        {appointmentsForSelectedDate.length}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {!selectedDate ? (
                                <div className="text-center text-muted py-5">
                                    <i className="bi bi-calendar-check display-1 mb-3"></i>
                                    <p className="fs-5">Selecciona una fecha del calendario para ver los turnos</p>
                                </div>
                            ) : (
                                <>
                                    {/* Información de la fecha seleccionada */}
                                    <div className="alert alert-success bg-opacity-10 border-success mb-3">
                                        <h6 className="text-success fw-bold mb-1">
                                            <i className="bi bi-calendar-event me-2"></i>
                                            {formatDate(selectedDate)}
                                        </h6>
                                        <small className="text-muted">
                                            Total de turnos: <strong>{appointmentsForSelectedDate.length}</strong>
                                        </small>
                                    </div>

                                    {/* Búsqueda */}
                                    {appointmentsForSelectedDate.length > 0 && (
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                placeholder="Buscar por nombre o email..."
                                                className="form-control border-success"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {/* Loading */}
                                    {isMutating && (
                                        <div className="text-center py-4">
                                            <div className="spinner-border text-success" role="status">
                                                <span className="visually-hidden">Cargando...</span>
                                            </div>
                                            <p className="text-success mt-2">Cargando turnos...</p>
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="alert alert-danger">
                                            <i className="bi bi-exclamation-triangle me-2"></i>
                                            Error al cargar los turnos
                                        </div>
                                    )}

                                    {/* Lista de turnos agrupados por usuario */}
                                    {!isMutating && !error && (
                                        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                            {appointmentsByUser.length === 0 ? (
                                                <div className="text-center text-muted py-4">
                                                    <i className="bi bi-calendar-x display-4 mb-3"></i>
                                                    <p>No hay turnos para esta fecha</p>
                                                </div>
                                            ) : (
                                                appointmentsByUser.map((userGroup, index) => (
                                                    <div key={userGroup.user._id} className="mb-4">
                                                        {/* Información del Usuario */}
                                                        <div className="bg-light p-3 rounded border-start border-success border-4 mb-2">
                                                            <div className="d-flex align-items-center">
                                                                <img
                                                                    src={userGroup.user.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"}
                                                                    alt={`${userGroup.user.name || ''} ${userGroup.user.last_name || ''}`}
                                                                    className="rounded-circle border border-success me-3"
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                />
                                                                <div className="flex-grow-1">
                                                                    <h6 className="mb-1 text-success fw-bold">
                                                                        {userGroup.user.name || ''} {userGroup.user.last_name || ''}
                                                                    </h6>
                                                                    <small className="text-muted">
                                                                        <i className="bi bi-envelope me-1"></i>
                                                                        {userGroup.user.email || ''}
                                                                    </small>
                                                                </div>
                                                                <span className="badge bg-success">
                                                                    {userGroup.appointments.length} turno{userGroup.appointments.length !== 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Turnos del Usuario */}
                                                        {userGroup.appointments.map((appointment) => (
                                                            <div key={appointment._id} className="bg-white border rounded p-3 mb-2 ms-3">
                                                                <div className="row">
                                                                    <div className="col-md-6 mb-2">
                                                                        <h6 className="text-primary fw-bold mb-1">
                                                                            <i className="bi bi-clock me-1"></i>
                                                                            {formatTime(appointment.date)}
                                                                        </h6>
                                                                        <div className="mb-2">
                                                                            {getStatusBadge(appointment.status)}
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-md-6 mb-2">
                                                                        <h6 className="text-info fw-bold mb-1">
                                                                            <i className="bi bi-person-badge me-1"></i>
                                                                            Profesional:
                                                                        </h6>
                                                                        <p className="mb-0 small">
                                                                            {appointment.professional ? 
                                                                                `${appointment.professional.name || ''} ${appointment.professional.last_name || ''}` : 
                                                                                'No asignado'
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Servicios */}
                                                                <div className="mt-2">
                                                                    <h6 className="text-success fw-bold mb-2">
                                                                        <i className="bi bi-spa me-1"></i>
                                                                        Servicios:
                                                                    </h6>
                                                                    <div className="row">
                                                                        {appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0 ? (
                                                                            appointment.services.map((service, serviceIndex) => (
                                                                                <div key={serviceIndex} className="col-12 mb-2">
                                                                                    <div className="d-flex align-items-center bg-light p-2 rounded">
                                                                                        <img
                                                                                            src={service.image || "https://via.placeholder.com/40"}
                                                                                            alt={service.name || 'Servicio'}
                                                                                            className="rounded me-2"
                                                                                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                                        />
                                                                                        <div className="flex-grow-1">
                                                                                            <p className="mb-0 fw-bold">{service.name || 'Servicio sin nombre'}</p>
                                                                                            <small className="text-muted">
                                                                                                ${service.props?.price?.toLocaleString('es-AR') || '0'}
                                                                                            </small>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))
                                                                        ) : (
                                                                            <div className="col-12">
                                                                                <p className="text-muted mb-0">No hay servicios asignados</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        
                                                        {/* Separador entre usuarios */}
                                                        {index < appointmentsByUser.length - 1 && (
                                                            <hr className="text-success opacity-25" />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}