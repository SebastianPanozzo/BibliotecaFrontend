import { useState, useRef } from 'react';
import DinamicModal from '../../../components/DinamicModal';
import useFetchData from "../../../hooks/useFetchData"
import html2pdf from "html2pdf.js";

function AppointmentList({ appointments, error, isMutating }) {
    const sectionRef = useRef();
    const [orderBy, setOrderBy] = useState("createdAt");
    const [orderDirection, setOrderDirection] = useState("asc"); // 'asc' para ascendente, 'desc' para descendente

    // Utilizamos una variable para el array ordenado que se recalcula cuando cambian las dependencias
    const appointmentSorted = appointments?.length > 0 ? orderByStr(orderBy, appointments, orderDirection) : [];

    const handleDownloadPDF = () => {
        const element = sectionRef.current;

        const opt = {
            margin: 0.5,
            filename: 'mi-seccion.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div className="row m-0 py-3 ">
            <div className="col-12">
                <div className="shadow-sm bg-light p-3 text-success rounded d-flex align-items-center justify-content-between">
                    <h4>Tu lista de turnos: </h4>
                    <div className="dropdown-center">
                        {appointmentSorted && appointmentSorted.length > 0 && (
                            <button className="btn btn-outline-primary me-2" onClick={handleDownloadPDF}>
                                Descargar como PDF
                            </button>
                        )}

                        <button className="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Ordenar por:
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("createdAt"); setOrderDirection("asc"); }}>Fecha de Creación (Asc)</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("createdAt"); setOrderDirection("desc"); }}>Fecha de Creación (Desc)</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("duration.start"); setOrderDirection("asc"); }}>Fecha del Turno (Asc)</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("duration.start"); setOrderDirection("desc"); }}>Fecha del Turno (Desc)</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("status"); setOrderDirection("asc"); }}>Estado del Turno (Asc)</a></li>
                            <li><a className="dropdown-item" href="#" onClick={() => { setOrderBy("status"); setOrderDirection("desc"); }}>Estado del Turno (Desc)</a></li>
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
            {(!error && !isMutating) && (
                <div className="col-12">
                    {appointmentSorted.length > 0 ? (
                        <div ref={sectionRef}>
                            < DropAppointment appointments={appointmentSorted} />
                        </div>
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
    const sectionRef = useRef();
    const [openAccordion, setOpenAccordion] = useState();

    function total(reserva) {
        const subtotal = reserva.services.reduce((total, servicio) => {
            return total + servicio.props.price;
        }, 0);
        return subtotal;
    }

    function calcularTotalConDescuentos(reserva) {
        const subtotal = reserva.services.reduce((total, servicio) => {
            return total + servicio.props.price;
        }, 0);

        let totalConDescuentos = subtotal;
        if (reserva.discount && reserva.discount.length > 0) {
            reserva.discount.forEach(descuento => {
                if (descuento.type === 'percentage') {
                    totalConDescuentos -= totalConDescuentos * (descuento.value / 100);
                } else if (descuento.type === 'mount') {
                    totalConDescuentos -= descuento.value;
                }
            });
        }

        totalConDescuentos = Math.max(0, totalConDescuentos);
        return totalConDescuentos;
    }

    const handleDownloadPDF = () => {
        const element = sectionRef.current;

        const opt = {
            margin: 0.5,
            filename: 'mi-seccion.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    return (
        <div ref={sectionRef} className="accordion" id="accordionTurnos">
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
                                    <h6 className='mb-2'>Profecional:</h6>
                                    <div className='d-flex align-items-center'>
                                        <i className="bi bi-person-circle me-2"></i>
                                        <p className='fs-6'>{turno.professional.name} {turno.professional.last_name}</p>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <i className="bi bi-envelope me-2"></i>
                                        <p className='fs-6'>{turno.professional.email}</p>
                                    </div>
                                </div>
                            )}
                            {turno.user && (
                                <div className='card border-0 mb-3 bg-white shadow-sm rounded p-3'>
                                    <h6 className='mb-2'>Usuario:</h6>
                                    <div className='d-flex align-items-center'>
                                        <i className="bi bi-person-circle me-2"></i>
                                        <p className='fs-6'>{turno.user.name} {turno.user.last_name}</p>
                                    </div>
                                    <div className='d-flex align-items-center'>
                                        <i className="bi bi-envelope me-2"></i>
                                        <p className='fs-6'>{turno.user.email}</p>
                                    </div>
                                </div>
                            )}
                            <div className='card border-0 mb-3 bg-white shadow-sm rounded p-3'>
                                <h6 className='border-bottom pb-1 mb-1'>Observación:</h6>
                                <p>{turno.description ? turno.description : "Todavía no tienes una observación."}</p>
                            </div>

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
                                                        <i className="bi bi-clock-history me-2"></i>
                                                        {servicio.props.duration} min
                                                    </p>
                                                    <p className="m-0 fs-5 fw-bold">
                                                        <strong className='text-dark'>$ </strong>
                                                        {servicio.props.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className='card border-0 mb-3 bg-white shadow-sm rounded p-3'>
                                <div className='d-flex align-items-center justify-content-between border-bottom pb-1 mb-1'>
                                    <h6>Subtotal:</h6>
                                    <p className='fs-6'>$ {total(turno).toLocaleString()}</p>
                                </div>
                                <div className='border-bottom pb-1 mb-1'>
                                    <h6>Descuentos:</h6>
                                    {(turno.discount && turno.discount.length !== 0) ? turno.discount.map(discount => (
                                        <div key={discount.reason} className='d-flex justify-content-between align-items-center'>
                                            <p>{discount.reason}:</p>
                                            <p className='fs-6 m-0'>{`${discount.type === 'percentage' ? '%' : '$'} ${discount.value}`}</p>
                                        </div>
                                    )) : (
                                        <div className='d-flex justify-content-between align-items-center'>
                                            <p>Sin descuentos:</p>
                                            <p className='fs-6 m-0'>-</p>
                                        </div>
                                    )}
                                </div>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <h6>Total:</h6>
                                    <p className='fs-6'>$ {calcularTotalConDescuentos(turno).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className='col-12 d-flex justify-content-center justify-content-md-end align-items-center border-top border-2 mt-3'>
                                <button className="btn btn-sm btn-outline-primary me-2 mt-2" onClick={handleDownloadPDF}>
                                    Descargar detalle como PDF
                                </button>
                                {turno.status === 'pending' ? (
                                    <div className='d-flex'>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target={`#finished-${turno._id}`}
                                            className='btn btn-sm btn-success mt-2 me-2'
                                        >Finalizar Atención</button>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target={`#cancelled-${turno._id}`}
                                            className='btn btn-sm btn-danger mt-2'
                                        >Cancelar Atención</button>
                                    </div>
                                ) : turno.status === 'cancelled' ? (
                                    <button disabled className='btn btn-danger btn-sm mt-2'>Turno Cancelado</button>
                                ) : turno.status === 'finished' ? (
                                    <button disabled className='btn btn-success btn-sm mt-2'>Atención finalizada</button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <DinamicModal id={`finished-${turno._id}`} title={"Finalizar Atención"}>
                        <FinishedModal appointmentId={turno._id} />
                    </DinamicModal>
                    <DinamicModal id={`cancelled-${turno._id}`} title={"Cancelar Atención"}>
                        <CanceledModal appointmentId={turno._id} />
                    </DinamicModal>
                </div>
            ))}
        </div>
    );
}

const FinishedModal = ({ appointmentId }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [update, setUpdate] = useState(false);
    const { trigger, error, isMutating } = useFetchData("/api/updateEvent");
    const [input, setInput] = useState('');

    const handlerFinished = async () => {
        try {
            await trigger({
                method: 'PUT',
                id: `/${appointmentId}`,
                body: { "status": "finished", "description": input },
                headers: { "Authorization": currentUser.token }
            });
            setUpdate(true);
            setTimeout(() => window.location.reload(), 1500); // Recargar para ver los cambios
        } catch (error) {
            console.error("Error al finalizar la atención:", error);
        }
    }

    return (
        <div className=''>
            <h6 className='mb-2'>Observación:</h6>
            <textarea
                className='form-control '
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            {isMutating && (
                <div className="col-12 mt-2">
                    <div className="p-4 alert alert-warning text-center mb-0 text-warning shadow-sm" role="alert">
                        <p className="fs-6 fw-bold mb-3">Actualizando el estado del turno...</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="col-12 mt-2">
                    <div className="p-5 alert alert-danger text-center mb-0 text-danger shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Error al finalizar la atención</p>
                    </div>
                </div>
            )}
            {update && (
                <div className="col-12 mt-2">
                    <div className="p-5 alert alert-success text-center mb-0 text-success shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Atención finalizada</p>
                    </div>
                </div>
            )}
            <button className='btn btn-outline-success mt-2 w-100' onClick={handlerFinished}>Finalizar Atención</button>
        </div>
    );
};

const CanceledModal = ({ appointmentId }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const [update, setUpdate] = useState(false);
    const { trigger, error, isMutating } = useFetchData("/api/updateEvent");
    const [input, setInput] = useState('');

    const handlerFinished = async () => {
        try {
            await trigger({
                method: 'PUT',
                id: `/${appointmentId}`,
                body: { "status": "cancelled", "description": input },
                headers: { "Authorization": currentUser.token }
            });
            setUpdate(true);
            setTimeout(() => window.location.reload(), 1500); // Recargar para ver los cambios
        } catch (error) {
            console.error("Error al finalizar la atención:", error);
        }
    }

    return (
        <div className=''>
            <h6 className='mb-2'>Observación:</h6>
            <textarea
                className='form-control '
                value={input}
                onChange={(e) => setInput(e.target.value)}
            ></textarea>
            {isMutating && (
                <div className="col-12 mt-2">
                    <div className="p-4 alert alert-warning text-center mb-0 text-warning shadow-sm" role="alert">
                        <p className="fs-6 fw-bold mb-3">Actualizando el estado del turno...</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
            {error && (
                <div className="col-12 mt-2">
                    <div className="p-5 alert alert-danger text-center mb-0 text-danger shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Error al cancelar la atención</p>
                    </div>
                </div>
            )}
            {update && (
                <div className="col-12 mt-2">
                    <div className="p-5 alert alert-success text-center mb-0 text-success shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Atención cancelada</p>
                    </div>
                </div>
            )}
            <button className='btn btn-outline-danger mt-2 w-100' onClick={handlerFinished}>Cancelar Atención</button>
        </div>
    );
};

const GetStatus = ({ status }) => {
    switch (status) {
        case 'pending':
            return (
                <div className='d-flex badge rounded-pill p-2 px-3 bg-warning bg-opacity-75 '>
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

//Funciones Auxiliares
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

const orderByStr = (orderStr, list, orderDirection) => {
    return [...list].sort((a, b) => {
        const valA = getNestedValue(a, orderStr);
        const valB = getNestedValue(b, orderStr);

        let comparison = 0;

        // Manejo de comparaciones de fechas
        if (orderStr === "createdAt" || orderStr === "duration.start") {
            const dateA = new Date(valA);
            const dateB = new Date(valB);
            comparison = dateA.getTime() - dateB.getTime();
        }
        // Manejo de comparaciones de cadenas
        else if (typeof valA === 'string' && typeof valB === 'string') {
            comparison = valA.localeCompare(valB);
        }
        // Manejo de comparaciones de números (si los hubiera)
        else if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        }

        // Aplicar la dirección de ordenamiento
        return orderDirection === 'asc' ? comparison : -comparison;
    });
};

export default AppointmentList;