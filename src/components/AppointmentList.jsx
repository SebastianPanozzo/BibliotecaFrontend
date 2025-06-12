import { useState } from 'react';


function AppointmentList({ appointments, error, isMutating }) {
    const [orderBy, setOrderBy] = useState("createdAt");

    const appointmentSorted = appointments?.items?.length > 0 ? orderByStr(orderBy, appointments.items) : [];
    console.log("appointments:", appointments?.items)

    return (
        <div className="row m-0 py-3 card">
            <div className="col-12">
                <div className="shadow-sm bg-light p-3 text-success rounded d-flex align-items-center justify-content-between">
                    <h4>Tu lista de turnos: </h4>
                    <div className="dropdown-center">
                        <button className="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Ordenar por:
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => setOrderBy("createdAt")}>Fecha de Creación</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => setOrderBy("duration.start")}>Fecha del Turno</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => setOrderBy("status")}>Estado del Turno</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            {isMutating && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-info text-center mb-0 text-info shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Buscando Turnos</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {(appointments && !isMutating) && (
                <div className="col-12">
                    {appointmentSorted.length > 0 ? (
                        < DropAppointment appointments={appointmentSorted} />
                    ) : (
                        <div className="col-12 mt-3">
                            <div className="p-5 alert alert-warning text-center mb-0 shadow-sm" role="alert">
                                <p className="fs-6 fw-bold">Lista de turnos vacía</p>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {error && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-danger text-center mb-0 text-danger shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Error al buscar los turnos</p>
                    </div>
                </div>
            )}

        </div>
    );
};

function DropAppointment({ appointments }) {
    const [openAccordion, setOpenAccordion] = useState();

    return (
        <div className="accordion" id="accordionTurnos">
            {appointments.map((turno) => (
                <div className="accordion-item shadow-sm border-0 mt-3 bg-body-secondary rounded" key={turno._id}>
                    <div className="accordion-header rounded">
                        <button
                            className={`p-2 rounded-3 bg-light shadow-sm accordion-button ${openAccordion === turno._id ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === turno._id ? null : turno._id)}
                            aria-expanded={openAccordion === turno._id}
                            aria-controls={`collapse-${turno._id}`}
                        >
                            <div className="row col-12 w-100 pe-2">
                                <div className='col-2 d-flex'>
                                    <GetStatus status={turno.status} />
                                </div>
                                <div className='col-12 col-md-10 text-start text-md-end'>
                                    <p className='text-muted m-0 lh-base'>Turno creado el {formatDate(turno.createdAt)}</p>
                                </div>
                                <div className='col-12 lh-base mt-2'>
                                    <p className='m-0 fs-6'><i className="bi bi-calendar3 me-2"></i>{formatDate(turno.duration.start)}</p>
                                    <p className='m-0 text-muted'><i className="bi bi-clock-fill me-2"></i>{formatTimeRange(turno.duration)}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div
                        id={`collapse-${turno._id}`}
                        className={`accordion-collapse collapse ${openAccordion === turno._id ? 'show' : ''}`}
                    >
                        <div className="accordion-body p-3">
                            {turno.professional && (
                                <div className='card border-0 mb-3 bg-white shadow-sm rounded p-3'>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h6>Profecional:</h6>
                                        <p className='fs-6'>{turno.professional.name} {turno.professional.last_name}</p>
                                    </div>
                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h6>Referencia:</h6>
                                        <p className='fs-6'>{turno.professional.email}</p>
                                    </div>
                                    
                                </div>
                            )}

                            {turno.services.map((servicio) => (
                                <div className="card border-0 mb-3 bg-white shadow-sm rounded" key={servicio._id}>
                                    <div className="card-body p-3">
                                        <div className="row">
                                            <div className="col-md-3 col-lg-2 text-center">
                                                <div style={{ height: "110px" }}>
                                                    <img
                                                        src={servicio.image || "https://via.placeholder.com/150x100?text=Servicio"}
                                                        alt={servicio.name}
                                                        className='img-fluid rounded-3 shadow-sm'
                                                        style={{
                                                            height: "100%",
                                                            width: "100%",
                                                            objectFit: "cover",
                                                            backgroundPosition: "center",
                                                            backgroundRepeat: "no-repeat"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex flex-column justify-content-between col-md-9 col-lg-10 mt-2 mt-md-0">
                                                <div>
                                                    <h4 className="card-title fw-bold text-dark m-0">{servicio.name}</h4>
                                                    <p className="text-muted m-0 fs-6">
                                                        <strong className='text-dark'>Tipo de Servicio: </strong>
                                                        {servicio.type}
                                                    </p>
                                                </div>

                                                <div className='d-flex justify-content-between align-items-end'>
                                                    <p className="text-muted m-0 fs-6">
                                                        <i class="bi bi-clock-history me-2"></i>
                                                        {servicio.props.duration} min
                                                    </p>
                                                    <p className="text-muted m-0 fs-5 fw-bold">
                                                        <strong className='text-dark'>$ </strong>
                                                        {servicio.props.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className='col-12 d-flex justify-content-center justify-content-md-end align-items-center border-top mt-4'>
                                {turno.status === 'pending' ? (
                                    <button className='btn btn-danger btn-sm mt-2'>Cancelar Turno</button>
                                ) : turno.status === 'cancelled' ? (
                                    <button disabled className='btn btn-danger btn-sm mt-2'>Turno Cancelado</button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

const GetStatus = ({ status }) => {
    switch (status) {
        case 'pending':
            return (
                <div className='d-flex badge rounded p-2 px-3 bg-warning bg-opacity-75 '>
                    <i className="bi bi-clock"></i><p className='m-0 ms-2'>Pendiente</p>
                </div>
            );
        case 'inProgress':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-secondary bg-opacity-75 '>
                    <i className="bi bi-clock-history"></i><p className='m-0 ms-2'>En Proceso</p>
                </div>
            );
        case 'finished':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-success bg-opacity-75'>
                    <i class="bi bi-check-circle"></i><p className='m-0 ms-2'>Terminado</p>
                </div>
            );
        case 'cancelled':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-danger bg-opacity-75'>
                    <i className="bi bi-x-circle"></i><p className='m-0 ms-2'>Cancelado</p>
                </div>
            );
        default:
            return status;
    }
}

//Funciones
const formatDate = (fechaIsoUtc) => {
    const fecha = new Date(fechaIsoUtc);
    return `${fecha.getDate()} de ${new Intl.DateTimeFormat(`es-Ar`, { month: 'long' }).format(fecha)} de ${fecha.getFullYear()}`
}

const formatTimeRange = (duration) => {
    const { start, end } = duration;
    const opciones = { hour: '2-digit', minute: '2-digit', hour12: false };
    const startHour = new Intl.DateTimeFormat(undefined, opciones).format(new Date(start));
    const endHour = new Intl.DateTimeFormat(undefined, opciones).format(new Date(end));
    return `${startHour} - ${endHour}`;
}

const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
};

const orderByStr = (orderStr, list) => {
    return [...list].sort((a, b) => {
        const valA = String(getNestedValue(a, orderStr) || "");
        const valB = String(getNestedValue(b, orderStr) || "");
        return valA.localeCompare(valB);
    });
};


export default AppointmentList;