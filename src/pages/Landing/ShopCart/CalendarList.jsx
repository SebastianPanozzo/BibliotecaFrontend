import { useState, useEffect } from "react";
import useStore from "../../../hooks/useStore";
import Calendar from "../../../components/Calendar"
import useFetchData from "../../../hooks/useFetchData";
import { getProfessionals, getAppointments } from "../../../utiles/querys"
const service_unit = import.meta.env.VITE_SPA_ID;



export default function CalendarList({ setValue }) {
    const [date, setDate] = useState();
    const { trigger } = useFetchData("/api/findUsers");
    const { currentUser } = useStore().get()
    const [professionals, setProfessionals] = useState([]);
    const [professionalSelected, setProfessionalSelected] = useState();

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await trigger({
                    method: 'POST',
                    body: getProfessionals(service_unit),
                    headers: { "Authorization": currentUser.token }
                });
                setProfessionals(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        }
        fetch();
    }, [trigger, currentUser]);

    const handleSelect = (prof) => {
        setProfessionalSelected(prof);
    };

    function getNextBusinessDays() {
        const businessDays = [];
        //let currentDate = new Date(new Date().setHours(new Date().getHours() - 3));
        let currentDate = new Date();
        while (businessDays.length < 3) {
            const dayOfWeek = currentDate.getDay();
            //console.log("dayOfWeek",{dayOfWeek, currentDate});
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays.push(currentDate.toISOString());
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return businessDays;
    }

    return (
        <div className="row col-12 m-0 mt-3 p-0">
            <div className="col-md-6 px-0 pe-md-2 mb-3 mb-md-0 ">
                <div className="card shadow-sm">
                    <Calendar context={{
                        events: getNextBusinessDays(),
                        setMonth: null,
                        setDate,
                        date,
                        style: "bg-success bg-opacity-25 rounded-pill"
                    }} />
                </div>
            </div>
            <div className="col-md-6 px-0 ps-md-2">
                <div className="card p-3 shadow-sm" style={{ height: "352px" }}>
                    <div className="dropdown mb-3">
                        <button
                            className="btn btn-outline-success dropdown-toggle w-100 text-start"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {professionalSelected ? `${professionalSelected.name} ${professionalSelected.last_name}` : "Seleccione una Profecional"}
                        </button>
                        <ul className="dropdown-menu w-100 p-2 pb-0">
                            {professionals.map((prof) => (
                                <li key={prof._id}>
                                    <button className="btn btn-sm w-100 btn-outline-secondary rounded mb-2 text-start"
                                        onClick={() => handleSelect(prof)}
                                    >
                                        {`${prof.name} ${prof.last_name}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                        < Schedules setValue={setValue} context={{ date, dates: getNextBusinessDays(), professionalSelected }} />
                    </div>
                </div>
            </div>
        </div>
    );
}


const Schedules = ({ context, setValue }) => {
    const { date, dates, professionalSelected } = context;
    const datesFormat = dates.map((d) => { return d.split('T')[0] })

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" >
            {!date ? (
                <div className="p-3 alert alert-success text-center mb-0 shadow-sm w-100" role="alert">
                    <p>Seleccione una Fecha</p>
                </div>
            ) : !datesFormat.includes(date.toISOString().split('T')[0]) ? (
                <div className="p-3 alert alert-warning text-center mb-0 shadow-sm w-100" role="alert">
                    <p>Solo se puede realizar una reservación de lunes a viernes y con un máximo de 48hs previas</p>
                </div>
            ) : !professionalSelected ? (
                <div className="p-3 alert alert-warning text-center mb-0 shadow-sm w-100" role="alert">
                    <p>Seleccione una Profesional para ver los Hoarios disponibles</p>
                </div>
            ) : (
                <TimeButtons date={date} professionalSelected={professionalSelected} setValue={setValue} />
            )}
        </div>
    )
}

function TimeButtons({ date, professionalSelected, setValue }) {
    const { currentUser, ShopCart } = useStore().get();
    const { trigger, isMutating } = useFetchData("/api/findEvents");
    const [appointments, setAppointments] = useState([]);

    let duration = 0;
    ShopCart.forEach(element => {
        duration += element.props?.duration ?? 0;
    });

    //console.log("log", { ShopCart, duration, appointments });

    const start = date.toISOString();
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    const endISO = end.toISOString();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await trigger({
                    method: 'POST',
                    body: getAppointments(start, endISO, professionalSelected._id),
                    headers: { "Authorization": currentUser.token }
                });
                setAppointments(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        };
        fetchAppointments();
    }, [date, professionalSelected, start, endISO, currentUser.token, trigger]);

    const startHour = 8;
    const endHour = 16;
    const buttons = [];


    const doesOverlap = (rangeStart, rangeEnd, apptStart, apptEnd) => {
        return (rangeStart < apptEnd && rangeEnd > apptStart);
    };

    const selectedTime = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        const servicesList = ShopCart.map(service => service._id);
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hours, minutes, 0, 0);
        setValue('datetime', selectedDateTime.toISOString());
        setValue('professional', professionalSelected._id);
        setValue('services', servicesList);
        if (new Date().getDay() <= selectedDateTime.getDay() - 2) {
            setValue('discount', [
                {
                    type: "percentage",
                    value: 10,
                    reason: "Descuento por reservar 48h antes: "
                }
            ]);
        } else {
            setValue('discount', []);
        }
    };

    for (let hour = startHour; hour <= endHour; hour++) {
        for (let minutes of [0, 30]) {
            if (hour === endHour && minutes > 0) break;

            const timeString = `${hour.toString().padStart(2, '0')}:${minutes === 0 ? '00' : minutes}`;

            const currentSlotStart = new Date(date);
            currentSlotStart.setHours(hour, minutes, 0, 0);

            const serviceEndsAt = new Date(currentSlotStart);
            serviceEndsAt.setMinutes(currentSlotStart.getMinutes() + duration);

            const maxEndTime = new Date(date);
            maxEndTime.setHours(endHour, 0, 0, 0);

            let isBookedDirectly = false;
            let willServiceOverlapAnAppointment = false;

            for (const appointment of appointments) {
                const apptStart = new Date(appointment.start);
                const apptEnd = new Date(appointment.end);

                const buttonSlotEnd = new Date(currentSlotStart);
                buttonSlotEnd.setMinutes(currentSlotStart.getMinutes() + 30);
                if (doesOverlap(currentSlotStart, buttonSlotEnd, apptStart, apptEnd)) {
                    isBookedDirectly = true;
                }

                if (doesOverlap(currentSlotStart, serviceEndsAt, apptStart, apptEnd)) {
                    willServiceOverlapAnAppointment = true;
                }
            }

            let buttonClass = 'btn-outline-success';
            let buttonText = timeString;
            let isDisabled = false;

            if (isBookedDirectly) {
                buttonClass = 'btn-outline-secondary';
                buttonText = `${timeString} no disponible`;
                isDisabled = true;
            }

            else if (willServiceOverlapAnAppointment || serviceEndsAt.getTime() > maxEndTime.getTime()) {
                buttonClass = 'btn-outline-warning';
                buttonText = `${timeString} espacio insuficiente`;
                isDisabled = true;
            }

            buttons.push(
                <button
                    key={timeString}
                    className={`btn ${buttonClass} fw-semibold mb-2 w-100`}
                    disabled={isDisabled}
                    onClick={() => !isDisabled && selectedTime(timeString)}
                >
                    {buttonText}
                </button>
            );
        }
    }

    if (isMutating) {
        return (
            <div className="p-3 alert alert-info text-center mb-0 text-info shadow-sm w-100" role="alert">
                <p className="m-3">Cargando Horarios Disponibles</p>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            {buttons}
        </>
    );
}