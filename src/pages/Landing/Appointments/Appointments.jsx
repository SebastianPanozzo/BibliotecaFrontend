import { useEffect, useState } from "react";
import DropAppointment from "../..//../components/DropAppointment";
import useFetchData from "../../../hooks/useFetchData";
import useStore from "../../../hooks/useStore";
import image from "../../../../public/img/bgDark.webp"
import Error from "../../../components/LoadAndErr/Error";
import Loader from "../../../components/LoadAndErr/Loader";
import { appointmentQuery } from "../../../utiles/querys";

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

const Appointment = () => {
    const [appointments, setAppointments] = useState();
    const [orderBy, setOrderBy] = useState("createdAt");

    const { currentUser } = useStore().get();
    const { trigger, error, isMutating } = useFetchData('/api/findRelations');

    useEffect(() => {
        const fetch = async () => {
            const data = await trigger({
                method: 'POST',
                body: appointmentQuery,
                headers: { "Authorization": currentUser.token }
            });
            setAppointments(data);
        };
        fetch();
    }, [currentUser]);

    const appointmentSorted = appointments?.items?.length > 0 ? orderByStr(orderBy, appointments.items) : [];

    return (
        <>
            {isMutating && <Loader context={{ image }} />}
            {(appointments && !isMutating) && (

                <div className="bg-light min-vh-100 pt-5 px-2" id="services"
                    style={{
                        overflow: 'visible',
                        backgroundImage: `url(${image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "scroll",
                    }}>
                    <div className="container pt-5">
                        <div className="row mb-2">
                            <div className="col-12">
                                <div className="card-custom p-3 text-white rounded border d-flex align-items-center justify-content-between"
                                    style={{ position: 'relative', zIndex: 1050 }}>
                                    <h3>Tu lista de turnos: </h3>
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
                        </div>
                        <div className="row">
                            <div className="col-12">
                                {appointmentSorted.length > 0 ? (
                                    < DropAppointment context={{ appointments: appointmentSorted }} />
                                ) : (
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="card p-5 rounded border d-flex align-items-center justify-content-between">
                                                <p>Todavía no tienes turnos asignados para mostar</p>
                                                <small>Reserva un turno y te avisaremos cuando esté disponible</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {error && < Error backgroundImage={image} />}
        </>
    );
};

export default Appointment;