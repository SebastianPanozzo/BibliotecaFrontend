import { useState } from "react";
import Calendar from "../../../components/Calendar"
import useFetchData from "../../../hooks/useFetchData";


export default function CalendarList({ setValue }) {
    const [date, setDate] = useState();
    console.log("date in calendar", date);

    function getNextBusinessDays() {
        const businessDays = [];
        let currentDate = new Date();
        while (businessDays.length < 3) {
            const dayOfWeek = currentDate.getDay(); // 0 = domingo, 6 = sábado
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays.push(new Date(currentDate).toISOString());
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
                    <div className="card shadow-sm p-2 mb-3 bg-success bg-opacity-75 text-white">
                        <h5>Servicios Seleccionados: </h5>
                    </div>
                    <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                        < Schedules context={{ date, setDate, dates: getNextBusinessDays() }} />
                    </div>
                </div>
            </div>
        </div>
    );
}

const Schedules = ({ context }) => {
    const { date, setDate, dates } = context;
    const datesFormat = dates.map((d) => { return d.split('T')[0] })
    const [hs, setHs] = useState();

    function TimeButtons() {
        const startHour = 8;
        const endHour = 16;
        const buttons = [];

        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minutes of [0, 30]) {
                if (hour === endHour && minutes > 0) break; // evita generar 16:30
                const time = `${hour.toString().padStart(2, '0')}:${minutes === 0 ? '00' : minutes}`;
                buttons.push(
                    <button key={time} className="btn btn-outline-success fw-bolder mb-2 w-100">
                        {time}
                    </button>
                );
            }
        }

        return <>{buttons}</>;
    }

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" >
            {!date ? (
                <div className="card shadow-sm w-100 p-3 text-center fw-bolder text-success bg-success bg-opacity-25">
                    <p>Selecciona una fecha para ver los Hoarios disponibles</p>
                </div>
            ) : !datesFormat.includes(date.toISOString().split('T')[0]) ? (
                <div className="card shadow-sm w-100 p-3 text-center fw-bolder text-success bg-success bg-opacity-25">
                    <p>Solo se puede realizar la reserva hasta 48 hs antes de la fecha del servicio</p>
                </div>
            ) : (
                <TimeButtons />
            )}
        </div>
    )
}