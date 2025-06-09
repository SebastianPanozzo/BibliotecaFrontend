import { useState, useEffect } from "react"
import useFetchData from "../../../hooks/useFetchData"

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

export default function Index() {
    const { trigger: getAppointments, isMutating: loadingAppointments } = useFetchData("/api/findAppointments");
    const { trigger: getServices } = useFetchData("/api/findServices");
    const { trigger: getProfessionals } = useFetchData("/api/findProfessionals");
    const { trigger: getUsers } = useFetchData("/api/findUsers");
    
    const [appointments, setAppointments] = useState([]);
    const [services, setServices] = useState([]);
    const [professionals, setProfessionals] = useState([]);
    const [users, setUsers] = useState([]);
    const [analytics, setAnalytics] = useState({
        topServices: [],
        topProfessionals: [],
        topClients: [],
        totalAppointments: 0,
        totalRevenue: 0
    });

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [appointmentsRes, servicesRes, professionalsRes, usersRes] = await Promise.all([
                    getAppointments({
                        method: 'POST',
                        body: [],
                        headers: { "Authorization": currentUser.token }
                    }),
                    getServices({
                        method: 'POST',
                        body: [],
                        headers: { "Authorization": currentUser.token }
                    }),
                    getProfessionals({
                        method: 'POST',
                        body: [],
                        headers: { "Authorization": currentUser.token }
                    }),
                    getUsers({
                        method: 'POST',
                        body: [],
                        headers: { "Authorization": currentUser.token }
                    })
                ]);

                setAppointments(appointmentsRes.items || []);
                setServices(servicesRes.items || []);
                setProfessionals(professionalsRes.items || []);
                setUsers(usersRes.items || []);
            } catch (err) {
                console.error('Error al obtener datos:', err.message);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        if (appointments.length > 0 && services.length > 0) {
            calculateAnalytics();
        }
    }, [appointments, services, professionals, users]);

    const calculateAnalytics = () => {
        // Servicios más solicitados
        const serviceCount = {};
        const professionalCount = {};
        const clientCount = {};
        let totalRevenue = 0;

        appointments.forEach(appointment => {
            // Contar servicios
            if (appointment.services && Array.isArray(appointment.services)) {
                appointment.services.forEach(serviceId => {
                    serviceCount[serviceId] = (serviceCount[serviceId] || 0) + 1;
                });
            }

            // Contar profesionales
            if (appointment.professional_id) {
                professionalCount[appointment.professional_id] = (professionalCount[appointment.professional_id] || 0) + 1;
            }

            // Contar clientes
            if (appointment.client_id) {
                clientCount[appointment.client_id] = (clientCount[appointment.client_id] || 0) + 1;
            }

            // Calcular ingresos totales
            if (appointment.total_price) {
                totalRevenue += appointment.total_price;
            }
        });

        // Top servicios
        const topServices = Object.entries(serviceCount)
            .map(([serviceId, count]) => {
                const service = services.find(s => s._id === serviceId);
                return {
                    id: serviceId,
                    name: service?.name || 'Servicio no encontrado',
                    count,
                    price: service?.props?.price || 0
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Top profesionales
        const topProfessionals = Object.entries(professionalCount)
            .map(([professionalId, count]) => {
                const professional = professionals.find(p => p._id === professionalId);
                return {
                    id: professionalId,
                    name: professional ? `${professional.name} ${professional.last_name}` : 'Profesional no encontrado',
                    count,
                    email: professional?.email || ''
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Top clientes
        const topClients = Object.entries(clientCount)
            .map(([clientId, count]) => {
                const client = users.find(u => u._id === clientId);
                return {
                    id: clientId,
                    name: client ? `${client.name} ${client.last_name}` : 'Cliente no encontrado',
                    count,
                    email: client?.email || ''
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        setAnalytics({
            topServices,
            topProfessionals,
            topClients,
            totalAppointments: appointments.length,
            totalRevenue
        });
    };

    const StatCard = ({ title, value, icon, color = "success" }) => (
        <div className="col-md-6 col-lg-3 mb-4">
            <div className={`card border-${color} shadow-sm h-100`}>
                <div className="card-body text-center">
                    <i className={`bi ${icon} fs-1 text-${color} mb-3`}></i>
                    <h5 className={`card-title text-${color} fw-bold`}>{title}</h5>
                    <h3 className={`text-${color} fw-bold`}>{value}</h3>
                </div>
            </div>
        </div>
    );

    const RankingCard = ({ title, items, icon, getSubtitle }) => (
        <div className="col-lg-4 mb-4">
            <div className="card border-success shadow-sm h-100">
                <div className="card-header bg-success text-white text-center">
                    <h5 className="mb-0 fw-bold">
                        <i className={`bi ${icon} me-2`}></i>
                        {title}
                    </h5>
                </div>
                <div className="card-body p-0">
                    {items.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {items.map((item, index) => (
                                <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <span className={`badge ${index === 0 ? 'bg-warning' : index === 1 ? 'bg-secondary' : index === 2 ? 'bg-warning' : 'bg-success'} rounded-pill me-3 fs-6`}>
                                            {index + 1}
                                        </span>
                                        <div>
                                            <div className="fw-bold text-success">{item.name}</div>
                                            {getSubtitle && (
                                                <small className="text-muted">{getSubtitle(item)}</small>
                                            )}
                                        </div>
                                    </div>
                                    <span className="badge bg-success rounded-pill fs-6">
                                        {item.count} {item.count === 1 ? 'vez' : 'veces'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-muted">
                            No hay datos disponibles
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-fluid py-4">
            {/* Encabezado */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card bg-success text-white shadow-sm">
                        <div className="card-body text-center">
                            <h2 className="fw-bold mb-2">
                                <i className="bi bi-graph-up me-3"></i>
                                Panel de Analíticas
                            </h2>
                            <p className="mb-0">Estadísticas y métricas del spa</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tarjetas de estadísticas generales */}
            <div className="row mb-5">
                <StatCard 
                    title="Total Citas" 
                    value={analytics.totalAppointments} 
                    icon="bi-calendar-check" 
                />
                <StatCard 
                    title="Ingresos Totales" 
                    value={`$${analytics.totalRevenue.toLocaleString()}`} 
                    icon="bi-currency-dollar" 
                />
                <StatCard 
                    title="Servicios Activos" 
                    value={services.length} 
                    icon="bi-stars" 
                />
                <StatCard 
                    title="Profesionales" 
                    value={professionals.length} 
                    icon="bi-people" 
                />
            </div>

            {/* Estado de carga */}
            {loadingAppointments ? (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-info text-center" role="alert">
                            <i className="bi bi-arrow-clockwise me-2 spin"></i> 
                            Cargando datos analíticos...
                        </div>
                    </div>
                </div>
            ) : (
                /* Rankings */
                <div className="row">
                    <RankingCard 
                        title="Servicios Más Solicitados"
                        items={analytics.topServices}
                        icon="bi-star-fill"
                        getSubtitle={(item) => `$${item.price.toLocaleString()}`}
                    />
                    
                    <RankingCard 
                        title="Profesionales Más Solicitados"
                        items={analytics.topProfessionals}
                        icon="bi-person-check-fill"
                        getSubtitle={(item) => item.email}
                    />
                    
                    <RankingCard 
                        title="Clientes Más Frecuentes"
                        items={analytics.topClients}
                        icon="bi-heart-fill"
                        getSubtitle={(item) => item.email}
                    />
                </div>
            )}

            {/* Mensaje cuando no hay datos */}
            {!loadingAppointments && appointments.length === 0 && (
                <div className="row">
                    <div className="col-12">
                        <div className="alert alert-warning text-center" role="alert">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            No se encontraron datos para generar analíticas.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}