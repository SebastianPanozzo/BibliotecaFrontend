import { useState } from 'react';

const GetStatus = ({ status }) => {
    switch (status) {
        case 'pending':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-warning bg-opacity-75'>
                    <i className="bi bi-clock"></i><p className='m-0 ms-2'>Pendiente</p>
                </div>
            );
        case 'inProgress':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-secondary bg-opacity-75'>
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

export default function DropAppointment({ context }) {
    const { appointments } = context;
    const [openAccordion, setOpenAccordion] = useState();

    return (
        <div className="accordion" id="accordionTurnos">
            {appointments.map((turno) => (
                <div className="accordion-item shadow-sm border-0 mt-3 bg-body-secondary rounded" key={turno._id}>
                    <div className="accordion-header rounded">
                        <button
                            className={`py-3 px-3 rounded-3 bg-light shadow-sm accordion-button ${openAccordion === turno._id ? '' : 'collapsed'}`}
                            type="button"
                            onClick={() => setOpenAccordion(openAccordion === turno._id ? null : turno._id)}
                            aria-expanded={openAccordion === turno._id}
                            aria-controls={`collapse-${turno._id}`}
                        >
                            {/* Acá va el botón */}
                            <div className="row d-flex justify-content-between w-100 me-2">
                                <div className='col-12'>
                                    <div className='d-flex align-items-center'>
                                        <GetStatus status={turno.status} />
                                        <p className='text-muted m-0 ms-2 lh-base'>Turno creado el {formatDate(turno.createdAt)}</p>
                                    </div>
                                    <div className='lh-base mt-2'>
                                        <p className='m-0 fs-5'><i className="bi bi-calendar3 me-2"></i>{formatDate(turno.duration.start)}</p>
                                        <p className='m-0 text-muted'><i className="bi bi-clock-fill me-2"></i>{formatTimeRange(turno.duration)}</p>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div
                        id={`collapse-${turno._id}`}
                        className={`accordion-collapse collapse ${openAccordion === turno._id ? 'show' : ''}`}
                    >
                        <div className="accordion-body p-3">
                            {turno.services.map((servicio) => (
                                <div className="card border-0 mb-3 bg-white shadow-sm rounded-3 overflow-hidden" key={servicio._id}>
                                    <div className="card-body p-3">
                                        <div className="row">
                                            <div className="col-12 col-md-4 col-lg-3 text-center">
                                                <img
                                                    src={servicio.image || "https://via.placeholder.com/150x100?text=Servicio"}
                                                    alt={servicio.name}
                                                    className='img-fluid rounded-3 shadow-sm'
                                                    style={{
                                                        maxHeight: "150px",
                                                        width: "100%",
                                                        objectFit: "cover",
                                                        backgroundPosition: "center",
                                                        backgroundRepeat: "no-repeat"
                                                    }}
                                                />
                                            </div>
                                            <div className="col-12 col-md-8 col-lg-9 mt-3 mt-md-0">
                                                <div>
                                                    <h4 className="card-title fw-bold text-dark mb-3">{servicio.name}</h4>
                                                </div>
                                                <div>
                                                    <p className="text-muted m-0 mb-1">
                                                        <strong className='text-dark'>Descripción: </strong>{servicio.description}
                                                    </p>

                                                    <p className="text-muted m-0 mb-1">
                                                        <strong className='text-dark'>Duración: </strong>{servicio.props.duration} min
                                                    </p>

                                                    <p className="text-muted m-0 mb-1">
                                                        <strong className='text-dark'>Precio: </strong>${servicio.props.price.toLocaleString()}
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
                                ) : (
                                    <button disabled className='btn btn-secondary btn-sm mt-2'>Cancelar Turno</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}