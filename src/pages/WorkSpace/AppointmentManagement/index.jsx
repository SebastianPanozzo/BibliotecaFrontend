import { useState, useEffect, useMemo } from "react"
import Calendar from "../../../components/Calendar"
import useFetchData from '../../../hooks/useFetchData';
import { appointmentsData } from "./query"
import AppointmentList from "./AppointmentList";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

export default function AppointmentManagement() {
    const [isMobile, setIsMobile] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [month, setMonth] = useState(new Date());
    const [appointments, setAppointments] = useState([]);
    const { trigger: getAppointments, isMutating, error } = useFetchData('/api/findEvents');

    // Función para obtener turnos
    const fetchAppointments = async (selectedMonth) => {
        try {
            const response = await getAppointments({
                method: 'POST',
                body: appointmentsData(selectedMonth),
                headers: { "Authorization": currentUser.token }
            });
            setAppointments(response?.items || []);
        } catch (err) {
            console.error('Error fetching appointments:', err);
        }
    };

    useEffect(() => {
        fetchAppointments(month);
    }, [month]);

    const calendarEvents = useMemo(() => {
        if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
            return [];
        }

        // Crear un array de strings de fechas con formato que espera el calendario
        const eventDates = [];

        appointments.forEach(appointment => {
            if (appointment.duration?.start) {
                try {
                    const appointmentDate = new Date(appointment.duration.start);
                    if (!isNaN(appointmentDate.getTime())) {
                        // Formatear la fecha como string en formato ISO (YYYY-MM-DD)
                        const dateString = appointmentDate.toISOString().split('T')[0];
                        if (!eventDates.includes(dateString)) {
                            eventDates.push(dateString);
                        }
                    }
                } catch (error) {
                    console.warn('Error parsing date:', appointment.duration.start, error);
                }
            }
        });
        return eventDates;
    }, [appointments]);

    const appointmentsForSelectedDate = useMemo(() => {
        if (!selectedDate || !appointments || !Array.isArray(appointments) || appointments.length === 0) {
            return [];
        }

        const selectedDateString = new Date(selectedDate).toDateString();
        return appointments.filter(appointment => {
            if (!appointment.duration?.start) return false;
            try {
                return new Date(appointment.duration.start).toDateString() === selectedDateString;
            } catch (error) {
                console.warn('Error comparing dates:', appointment.duration.start, error);
                return false;
            }
        });
    }, [selectedDate, appointments]);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 750);
        };
        
        // Verificar al montar el componente
        checkScreenSize();
        
        // Escuchar cambios en el tamaño de la ventana
        window.addEventListener('resize', checkScreenSize);
        
        // Limpiar el event listener al desmontar
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return (
        <div className="container-fluid p-0">
            {/* Encabezado */}
            <div className="row m-0 mb-3">
                <div className="col-12 bg-white shadow-sm p-3 rounded border-start border-success border-4">
                    <h3 className="text-success fw-bold mb-0">Gestión de Turnos</h3>
                </div>
            </div>

            <div className="row">
                {/* Columna del Calendario */}
                <div className=" mb-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white border-bottom border-success border-2">
                            <h5 className="text-success fw-bold mb-0">
                                <i className="bi bi-calendar3 me-2"></i>
                                Calendario de Turnos
                            </h5>
                        </div>
                        <div className="card-body p-0 pb-lg-5 px-lg-5">
                            <Calendar
                                context={{
                                    events: calendarEvents,
                                    setMonth,
                                    date: selectedDate,
                                    setDate: setSelectedDate,
                                    style: "bg-success bg-opacity-25 fw-bold",
                                    compact: isMobile
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Columna de Turnos */}
                <div className=" mb-3">
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
                        <AppointmentList appointments={appointmentsForSelectedDate} error={error} isMutating={isMutating} />
                    </div>
                </div>
            </div>
        </div>
    );
}