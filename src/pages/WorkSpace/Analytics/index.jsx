import { useState, useEffect, useMemo, useRef } from "react";
import useFetchData from "../../../hooks/useFetchData";
import { analyticsQuery } from "./analyticsQuery";
import DatePickerComponent from "../../../components/Datepicker"
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
import html2pdf from "html2pdf.js";

export default function Index() {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const [fromDate, setFromDate] = useState(from);
    const [toDate, setToDate] = useState(to);

    const { trigger: getAnalytics, isMutating, error } = useFetchData("/api/findEvents");
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [analytics] = await Promise.all([
                    getAnalytics({
                        method: 'POST',
                        body: analyticsQuery(fromDate, toDate),
                        headers: { "Authorization": currentUser.token }
                    })
                ]);
                setData(analytics.items || []);
            } catch (err) {
                console.error('Error al obtener datos:', err.message);
            }
        };

        fetchAllData();
    }, [fromDate, toDate, getAnalytics]);


    // Procesamiento de datos para las tarjetas de analíticas
    const {
        totalAppointments,
        totalRevenue,
        appointmentsByStatus,
        mostRequestedServices,
        mostRequestedProfessionals,
        mostFrequentClients
    } = useMemo(() => {
        let totalAppointments = 0;
        let totalRevenue = 0;
        const appointmentsByStatus = { pending: 0, finished: 0, cancelled: 0 };
        const servicesCount = {};
        const professionalsStats = {}; // { id: { count: 0, revenue: 0, professional: {} } }
        const clientsStats = {}; // { id: { count: 0, spent: 0, client: {} } }

        data.forEach(appointment => {
            totalAppointments++;

            // Contar citas por estado
            if (appointment.status && Object.prototype.hasOwnProperty.call(appointmentsByStatus, appointment.status)) {
                appointmentsByStatus[appointment.status]++;
            }

            // Calcular ingresos y procesar servicios
            let appointmentRevenue = 0;
            const appliedDiscounts = {}; // Para evitar aplicar el mismo descuento varias veces a un servicio si se duplica en el array services o discount

            appointment.services.forEach(service => {
                let servicePrice = service.props?.price || 0;
                let netPrice = servicePrice;

                // Aplicar descuentos del array "discount" al precio del servicio
                if (appointment.discount && Array.isArray(appointment.discount)) {
                    appointment.discount.forEach(discount => {
                        // Solo aplica si el descuento no ha sido aplicado a este servicio ya (puede que no sea necesario si los descuentos son por turno y no por servicio individual)
                        if (!appliedDiscounts[`${service._id}-${discount.type}-${discount.value}`]) {
                            if (discount.type === "percentage") {
                                netPrice -= servicePrice * (discount.value / 100);
                            } else if (discount.type === "amount") {
                                netPrice -= discount.value;
                            }
                            appliedDiscounts[`${service._id}-${discount.type}-${discount.value}`] = true;
                        }
                    });
                }

                appointmentRevenue += netPrice;

                // Servicios más solicitados
                if (service.name) {
                    servicesCount[service.name] = (servicesCount[service.name] || 0) + 1;
                }
            });
            totalRevenue += appointmentRevenue;

            // Profesionales más solicitados y su facturación
            if (appointment.professional) {
                const profId = appointment.professional._id;
                if (!professionalsStats[profId]) {
                    professionalsStats[profId] = {
                        count: 0,
                        revenue: 0,
                        professional: appointment.professional
                    };
                }
                professionalsStats[profId].count++;
                professionalsStats[profId].revenue += appointmentRevenue; // Suma el revenue total del turno al profesional
            }

            // Clientes más frecuentes y cuánto gastaron
            if (appointment.user) { // Usamos 'user' en lugar de 'client'
                const userId = appointment.user._id;
                if (!clientsStats[userId]) {
                    clientsStats[userId] = {
                        count: 0,
                        spent: 0,
                        client: appointment.user
                    };
                }
                clientsStats[userId].count++;
                clientsStats[userId].spent += appointmentRevenue; // Suma el revenue total del turno al cliente
            }
        });

        // Convertir objetos a arrays para ordenar
        const sortedServices = Object.entries(servicesCount)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Top 3

        const sortedProfessionals = Object.values(professionalsStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Top 3

        const sortedClients = Object.values(clientsStats)
            .sort((a, b) => b.count - a.count)
            .slice(0, 3); // Top 3

        return {
            totalAppointments,
            totalRevenue,
            appointmentsByStatus,
            mostRequestedServices: sortedServices,
            mostRequestedProfessionals: sortedProfessionals,
            mostFrequentClients: sortedClients
        };
    }, [data]);

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
    const sectionRef = useRef();


    return (
        <div ref={sectionRef} className="container-fluid p-0">
            {/* Encabezado */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded border-start border-success border-4 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-md-between">
                    <h3 className="text-success fw-bold mb-0">Analíticas del Spa</h3>
                    <DatePickerComponent context={{ fromDate, setFromDate, toDate, setToDate }} />
                </div>
            </div>

            {isMutating && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-info text-center mb-0 text-info shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Cargando analíticas</p>
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="col-12 mt-3">
                    <div className="p-5 alert alert-danger text-center mb-0 text-danger shadow-sm" role="alert">
                        <p className="fs-6 fw-bold">Error al cargar analíticas</p>
                    </div>
                </div>
            )}

            {!isMutating && !error && (
                <>
                    <div className="row mt-3">
                        <div className="col-lg-4 col-md-6 mb-3">
                            <div className="card shadow-sm h-100 border-0 rounded bg-white">
                                <div className="row d-flex m-0 p-3">
                                    <div className="col-12 p-0 d-flex align-items-center">
                                        <div className="bg-primary bg-opacity-10 text-primary rounded p-1 me-2">
                                            <i className="bi bi-calendar-check fs-1 m-2"></i>
                                        </div>
                                        <div className="d-flex flex-column align-items-between lh-sm">
                                            <p className="text-uppercase fw-bolder text-muted fs-6">Número de turnos</p>
                                            <p className="fw-bold text-dark fs-3">{totalAppointments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-6 mb-3">
                            <div className="card shadow-sm h-100 border-0 rounded bg-white">
                                <div className="row d-flex m-0 p-3">
                                    <div className="col-12 p-0 d-flex align-items-center">
                                        <div className="bg-success bg-opacity-10 text-success rounded p-1 me-2">
                                            <i className="bi bi-currency-dollar fs-1 m-2"></i>
                                        </div>
                                        <div className="d-flex flex-column align-items-between lh-sm">
                                            <p className="text-uppercase fw-bolder text-muted fs-6">Total Ingresos</p>
                                            <p className="fw-bold text-dark fs-3">${totalRevenue.toLocaleString('es-AR')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 col-md-12 mb-3">
                            <div className="card shadow-sm h-100 border-0 rounded bg-white">
                                <div className="row d-flex m-0 p-3">
                                    <div className="col-12 p-0 d-flex align-items-center">
                                        <div className="bg-info bg-opacity-10 text-info rounded p-1 me-2">
                                            <i className="bi bi-info-circle fs-1 m-2"></i>
                                        </div>
                                        <ul className="list-group list-group-flush w-100 m-1">
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 p-0 bg-white">
                                                Turnos Pendientes:
                                                <span className="badge bg-warning text-warning px-3 rounded bg-opacity-25">
                                                    {Object.prototype.hasOwnProperty.call(appointmentsByStatus, 'pending') ? appointmentsByStatus.pending : 0}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 p-0 bg-white">
                                                Turnos Finalizados:
                                                <span className="badge bg-success text-success px-3 rounded bg-opacity-25">
                                                    {Object.prototype.hasOwnProperty.call(appointmentsByStatus, 'finished') ? appointmentsByStatus.finished : 0}
                                                </span>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between align-items-center border-0 p-0 bg-white">
                                                Turnos Cancelados:
                                                <span className="badge bg-danger text-danger px-3 rounded bg-opacity-25">
                                                    {Object.prototype.hasOwnProperty.call(appointmentsByStatus, 'cancelled') ? appointmentsByStatus.cancelled : 0}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Servicios más solicitados */}
                    <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded mt-3">
                        <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center">
                            <h4 className="text-success fw-bold mb-0 lh-1">Servicios más solicitados</h4>
                            <h5 className="bg-success rounded text-white p-2 mb-1 flex-shrink-0">
                                <i className="bi bi-star"></i> {mostRequestedServices.length}
                            </h5>
                        </div>
                        <div className="col-12 p-0">
                            {mostRequestedServices.length > 0 ? (
                                mostRequestedServices.map((service, index) => (
                                    <div key={index} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">
                                        <div className="col-sm-2 col-lg-1 d-flex justify-content-center p-sm-0 mb-3 mb-sm-0" style={{ height: '80px' }}>
                                            {/* Usar la imagen del servicio si está disponible */}
                                            <img alt={service.name} className="img-fluid rounded" src={data.find(app => app.services.some(s => s.name === service.name))?.services.find(s => s.name === service.name)?.image || "https://via.placeholder.com/100"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="col-sm-8 col-lg-10 mb-3 mb-sm-0">
                                            <h5 className="mb-1">{service.name}</h5>
                                            <p className="m-0 text-muted">Solicitudes: <strong>{service.count}</strong></p>
                                        </div>
                                        <div className="col-sm-2 col-lg-1 d-flex align-items-center justify-content-center p-2 p-sm-0">
                                            <span className="badge bg-success fs-5">{service.count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-3 text-muted">No hay servicios solicitados en este período.</p>
                            )}
                        </div>
                    </div>

                    {/* Profesionales más solicitados */}
                    <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded mt-3">
                        <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center">
                            <h4 className="text-success fw-bold mb-0 lh-1">Profesionales más solicitados</h4>
                            <h5 className="bg-success rounded text-white p-2 mb-1 flex-shrink-0">
                                <i className="bi bi-person-badge"></i> {mostRequestedProfessionals.length}
                            </h5>
                        </div>
                        <div className="col-12 p-0">
                            {mostRequestedProfessionals.length > 0 ? (
                                mostRequestedProfessionals.map((profStats, index) => (
                                    <div key={index} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">
                                        <div className="col-sm-2 col-lg-1 d-flex justify-content-center p-sm-0 mb-3 mb-sm-0" style={{ height: '80px' }}>
                                            {/* Foto de perfil por defecto y cuadrada */}
                                            <img alt={`${profStats.professional.name} ${profStats.professional.last_name}`} className="img-fluid rounded" src={profStats.professional.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="col-sm-8 col-lg-10 mb-3 mb-sm-0">
                                            <h5 className="mb-1">{profStats.professional.name} {profStats.professional.last_name}</h5>
                                            <p className="m-0 text-muted"><strong>Email:</strong> {profStats.professional.email}</p>
                                            <p className="m-0 text-muted"><strong>Facturación:</strong> ${profStats.revenue.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="col-sm-2 col-lg-1 d-flex align-items-center justify-content-center p-2 p-sm-0">
                                            <span className="badge bg-success fs-5">{profStats.count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-3 text-muted">No hay profesionales con turnos en este período.</p>
                            )}
                        </div>
                    </div>

                    {/* Clientes más frecuentes */}
                    <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded mt-3 mb-3">
                        <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center">
                            <h4 className="text-success fw-bold mb-0 lh-1">Clientes más frecuentes</h4>
                            <h5 className="bg-success rounded text-white p-2 mb-1 flex-shrink-0">
                                <i className="bi bi-people"></i> {mostFrequentClients.length}
                            </h5>
                        </div>
                        <div className="col-12 p-0">
                            {mostFrequentClients.length > 0 ? (
                                mostFrequentClients.map((clientStats, index) => (
                                    <div key={index} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">
                                        <div className="col-sm-2 col-lg-1 d-flex justify-content-center p-sm-0 mb-3 mb-sm-0" style={{ height: '80px' }}>
                                            {/* Foto de perfil por defecto y cuadrada */}
                                            <img alt={`${clientStats.client.name} ${clientStats.client.last_name}`} className="img-fluid rounded" src={clientStats.client.image || "https://t3.ftcdn.net/jpg/00/64/67/80/360_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div className="col-sm-8 col-lg-10 mb-3 mb-sm-0">
                                            <h5 className="mb-1">{clientStats.client.name} {clientStats.client.last_name}</h5>
                                            <p className="m-0 text-muted"><strong>Email:</strong> {clientStats.client.email}</p>
                                            <p className="m-0 text-muted"> <strong>Gastado:</strong> ${clientStats.spent.toLocaleString('es-AR')}</p>
                                        </div>
                                        <div className="col-sm-2 col-lg-1 d-flex align-items-center justify-content-center p-2 p-sm-0">
                                            <span className="badge bg-success fs-5">{clientStats.count}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center mt-3 text-muted">No hay clientes frecuentes en este período.</p>
                            )}
                        </div>
                    </div>
                </>
            )}
            {!isMutating && (
                <div className="d-flex justify-content-end mt-3">
                    <button className="btn btn-outline-primary me-2" onClick={handleDownloadPDF}>
                        Descargar como PDF
                    </button>
                </div>
            )}
        </div>
    );
}