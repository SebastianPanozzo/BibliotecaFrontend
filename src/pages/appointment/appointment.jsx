import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useFetchData from "../../hooks/useFetchData";
import Loader from "../../components/LoadAndErr/Loader";
import Error from "../../components/LoadAndErr/Error";
import Calendar from "../../components/Calendar";
import Form from "../../components/form";

import img from "../../../public/img/bgDark.webp"

import useStore from "../../hooks/useStore";

import generateAppointment from "../../utiles/generateAppointment"
import { useNavigate } from "react-router-dom";

const idSpa = import.meta.env.VITE_SPA_ID;

const Appointment = () => {
    const navigateTo = useNavigate();
    const { get } = useStore()
    const { id } = useParams();
    let context = {}

    const { trigger, error, isMutating } = useFetchData(`https://back-production-3d53.up.railway.app/api/findObjects`);
    const [globalError, setGlobalError] = useState(false);

    const storage = get()

    const [service, setService] = useState(null);

    const [date, setDate] = useState(new Date())


    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = [
                    {
                        "$match": {
                            "_id": { "$eq": id }
                        }
                    }
                ];
                const data = await trigger({
                    method: 'POST',
                    body: body
                });

                if (!data.items[0]) {
                    setGlobalError(true);
                    throw new Error("Services not Found");
                }

                setService(data.items[0]);

            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        }

        fetchData()
    }, [id, trigger]);

    const [form, setform] = useState(null);


    if (form) {
        console.log("form: ", form)
    }

    if (service) {
        context = {
            title: "Datos Extras del Registro",
            service: generateAppointment,
            moreData: { service, storage, date, idSpa },
            style: {},
            className: { form: "col-12 text-dark justify-content-start", button: "btn-success", title: "fw-bold text-success" },
            setData: setform,
            inputs: [
                {
                    tag: "input",
                    type: "email",
                    id: "email",
                    name: "email",
                    title: "Correo electrónico:",
                    value: `${storage.currentUser.props.email || ""}`,
                    required: true,
                    readOnly: true
                },
                {
                    tag: "input",
                    type: "text",
                    id: "service",
                    name: "service",
                    title: "Servicio solicitado:",
                    value: `${service.name || "undefined"}`,
                    required: true,
                    readOnly: true
                },
                {
                    tag: "input",
                    type: "text",
                    id: "price",
                    name: "price",
                    title: "Precio del servicio:",
                    value: `$ ${service.props.price || "undefined"}`,
                    required: true,
                    readOnly: true
                },
                {
                    tag: "input",
                    type: "time",
                    id: "time",
                    name: "time",
                    title: "Hora del turno:",
                    required: true
                },
                {
                    tag: "textarea",
                    id: "custom_requests",
                    name: "custom_requests",
                    title: "Solicitudes Personalizadas:"
                }
            ]
        }
    }

    const navegate = () => {
        const str = "/";
        navigateTo(str);
    };

    return (
        <div className="">
            {isMutating && (<Loader context={{ image: img }} />)}
            {service && (
                <div className="bg-light" id="services"
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundAttachment: "fixed",
                        scrollMarginTop: '70px',
                    }}>
                    {!form ? (
                        <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                            <div className="row text-center mb-4">
                                <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">
                                    Genera tu reservación
                                </h1>
                            </div>
                            <div className="row col-12">
                                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center mb-4 mb-lg-0">
                                    <Calendar context={{ date, setDate }} />
                                </div>
                                <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
                                    <Form context={context} />
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="">
                            <div className=" container">
                                <div className="row min-vh-100 d-flex justify-content-center align-items-center">
                                    <div className="col-11 col-md-8 col-lg-5 col-xxl-4">
                                        <div className="col-12 d-flex flex-column align-items-center justify-content-center bg-white p-4 rounded-3" >
                                            <h3 className="">Turno Creado con éxito!</h3>
                                            <p className="mb-4">Los esperamos pronto para tu cita.</p>
                                            <button type="button" className="form-control btn btn-success" onClick={navegate}>Volver al inicio</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {(error || globalError) && (<Error backgroundImage={img} />)}
        </div>
    );
};

export default Appointment;