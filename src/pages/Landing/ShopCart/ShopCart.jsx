import { useState, useEffect } from "react";
import img from "../../../../public/img/bgDark.webp"
import useStore from "../../../hooks/useStore";
import Form from "../../../components/Form"

import useFetchData from "../../../hooks/useFetchData";

const Table = ({ context }) => {
    const { items, removeItem } = context;
    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Servicios Selecionados</th>
                    <th scope="col">Duración</th>
                    <th scope="col">Precio</th>
                    <th scope="col" className="text-center">Eliminar Servicio</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td >{item.name}</td>
                            <td >{item.props.duration} minutos</td>
                            <td >$ {item.props.price}</td>
                            <td><button onClick={() => removeItem(index)} style={{ fontSize: '0.9rem' }} className="btn btn-danger">Eliminar</button></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    )
};

const ShopCart = () => {
    const { get, save } = useStore();
    const { ShopCart, currentUser, spaData } = get();

    const { trigger, error } = useFetchData('/services/createAppointment');
    const { trigger: trigerEmail, error: errorEmail } = useFetchData('/services/sendEmail');

    const [data, setData] = useState();
    const [resApmt, setResApmt] = useState(false);
    const [resEmail, setResEmail] = useState();


    const [buttonState, setButtonState] = useState("Enviar");

    const removeItem = (index) => {
        ShopCart.splice(index, 1);
        save({ ShopCart }); //mirar acá despues
        localStorage.setItem("ShopCart", JSON.stringify(ShopCart));
    };

    const calculateDuration = () => {
        const totalMinutes = ShopCart.reduce((acc, item) => acc + item.props.duration, 0);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        const hourStr = hours === 1 ? '1 hora' : `${hours} horas`;
        const minStr = minutes === 1 ? '1 minuto' : `${minutes} minutos`;

        return `${hourStr} y ${minStr}`;
    };

    const turnoConfirmacion = (datetimeLocalStr) => {
        const [fecha, hora] = datetimeLocalStr.split("T");
        const [año, mes, día] = fecha.split("-");

        return `Tu turno ha sido reservado para el ${día}/${mes}/${año} a las ${hora}.`;
    }

    //appointment
    useEffect(() => {
        if (data) {
            setButtonState("Enviando...")
            const services = ShopCart.map((item) => item._id);
            const body = {
                ...data,
                services,
                duration: ShopCart.reduce((acc, item) => {
                    return acc + item.props.duration
                }, 0),
                service_unit: spaData
            }

            const fetch = async () => {
                try {
                    const res = await trigger({ method: "POST", body, headers: { "Authorization": currentUser.token } });
                    setResApmt(res)
                    setButtonState("Enviar")
                    localStorage.setItem("ShopCart", JSON.stringify([]));
                    save({ ShopCart: [] });
                    console.log("response: ", res);
                } catch (error) {
                    setButtonState("Enviar Nuevamente")
                    console.log("Error in create apointment: ", error);
                }
            }
            fetch();
        }
    }, [data])

    //Email
    useEffect(() => {
        if (resApmt) {
            const fetch = async () => {
                try {
                    const body = {
                        title: "Turno en Spa Senirse Bien",
                        email: data.email,
                        html: `<p>${currentUser.name} ${currentUser.last_name},<br/>${turnoConfirmacion(data.datetime_local)}</p>`
                    };
                    await trigerEmail({ method: "Post", headers: { "Authorization": currentUser.token }, body })
                    setResEmail(true);
                } catch (error) {
                    console.log("Error in send Email: ", error);
                }
            }
            fetch()
        }
    }, [resApmt])


    const context = {
        title: "Datos Extras del Registro",
        style: {},
        className: { form: "col-12 text-dark justify-content-start", button: "btn-success", title: "fw-bold text-success" },
        setData,
        buttonState,
        inputs: [
            {
                tag: "input",
                type: "email",
                id: "email",
                name: "email",
                title: "Correo electrónico:",
                value: `${currentUser.email || ""}`,
                required: true,
                readOnly: true
            },
            {
                tag: "input",
                type: "datetime-local",
                id: "datetime_local",
                name: "datetime_local",
                title: "Fecha del Turno:",
                required: true
            },
            {
                tag: "input",
                type: "number",
                id: "phone_number",
                name: "phone_number",
                title: "Numero Celular: ",
                placeholder: "Numero de celular opcional para avisos..."
            },
            {
                tag: "textarea",
                id: "custom_requests",
                name: "custom_requests",
                title: "Solicitudes Personalizadas:",
                placeholder: "En caso de que tenga alguna solicitud personalizada, escriba aquí...."
            }
        ]
    }

    return (
        <div className="bg-light min-vh-100 pt-5 px-3" id="services"
            style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}>
            <div className="container pt-5">
                <div className="row ">
                    <div className="card col-12 mb-2 shadow-sm p-4 text-center border border-2">
                        <h2 className="text-success fw-bold mb-2">Haga su reservación</h2>
                    </div>
                    <div className="col-12 col-lg-6 pe-lg-2 p-0 my-2">
                        <div className="card p-2 border-2">
                            <h4 className="text-center text-success fw-bold my-2">Lista de Productos</h4>
                            <Table context={{ items: ShopCart, removeItem }} />
                        </div>
                        <div className="row-col bg-white px-2 border border-2 rounded my-3">
                            <div className="col-12 d-flex justify-content-between align-items-center my-2 border-bottom">
                                <p className="m-0 fw-bolder">Tiempo del Servicio</p>
                                <span className="fw-bold text-success"> {calculateDuration()} </span>
                            </div>
                            <div className="col-12 d-flex justify-content-between align-items-center my-2">
                                <p className="m-0 fw-bolder">Total a Pagar</p>
                                <span className="fw-bold text-success">$ {ShopCart.reduce((acc, item) => { return acc + item.props.price }, 0)}</span>
                            </div>
                        </div>
                        {(resApmt && !error) && (
                            <div className="alert alert-success mt-2 mb-0 text-center">
                                <h5>{resApmt.ok?.message || "Turno Creado con Éxito"}</h5>
                                <p>
                                    {errorEmail
                                        ? 'Hubo un error al enviar el correo de confirmación'
                                        : resEmail
                                            ? 'El correo de confirmación ha sido enviado'
                                            : 'Se te notificará del turno por correo electrónico'}
                                </p>
                            </div>
                        )}
                        {error &&
                            <div className="alert alert-danger mt-2 mb-0 text-center">
                                {`${error.message}`}
                            </div>
                        }
                    </div>
                    <div className="col-12 col-lg-6 ps-lg-2 p-0 my-2">
                        <Form context={context} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShopCart;