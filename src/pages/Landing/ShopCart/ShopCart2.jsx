import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useStore from "../../../hooks/useStore";
import useFetchData from "../../../hooks/useFetchData";
import ProductList from "./ProductList";
import CalendarList from "./CalendarList";
import CreditCard from "./CreditCard";

/* new object
{
    "datetime": "2025-06-11T11:00:00.000Z",
    "professional": "6817ded1a881b7d0a35e25ad",
    "service_unit": "6819fccf6b483e8f69f3ca15",
    "isPaid": true,
    "discount": [
        {
            "type": "percentage",
            "value": 10,
            "reason": "Descuento por reservar 48h antes: "
        }
    ],
    "services": [
        "681a162abf0d1ef4fb57827b",
        "681a1d17bf0d1ef4fb57828c"
    ],
    "cardData": {
        "number": "1234567890876878",
        "name": "joa",
        "expiry": "12/26",
        "cvc": "200"
    }
} */


export default function ShopCart2() {
    const modalRef = useRef(null);
    const [pay, setPay] = useState();
    const { trigger, isMutating, error } = useFetchData("/services/createAppointmentNew")
    const navigateTo = useNavigate();
    const { save, get } = useStore()
    const { ShopCart, currentUser: { token }, } = get();

    // React hook form
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            datetime: "",
            professional: "",
            service_unit: import.meta.env.VITE_SPA_ID,
            isPaid: false,
            discount: [],
            services: [],
            cardData: {
                number: null,
                name: "",
                expiry: "",
                cvc: ""
            },
        },
    });
    const appointmentData = watch()
    console.log("SapaData: ", { token, appointmentData });

    const onSubmit = (data) => {
        console.log("Formulario enviado", { ...data, isPaid: true });
        const modal = new window.bootstrap.Modal(modalRef.current);
        modal.show();
    };

    const handlePay = async () => {
        try {
            const data = await trigger({
                method: 'POST',
                body: appointmentData,
                headers: { "Authorization": token }
            });
            setPay(data.ok.message);
            save({ ShopCart: [] })
            localStorage.setItem("ShopCart", JSON.stringify([]));
        } catch (error) {
            console.log(" de pago: ", error);
            setPay("Error al realizar el Pago")
        }
    }

    return (
        <div className="min-vh-100 pb-2 px-2 bg-spa-img" /* id="services" */>
            <div className="container">
                <div className="row card bg-body-tertiary shadow-lg border-0 p-3 mb-3" >
                    {/*Título de la card */}
                    <div className="col-12 bg-white d-flex justify-content-between align-items-center shadow-sm p-3 rounded border-start border-success border-4">
                        <h4 className="text-success fw-bold mb-0">Hacé tu reservación online</h4>
                        <h4 className="bg-success rounded text-white p-1 px-3"><i className="bi bi-send"></i></h4>
                    </div>
                    {/* Carrito de compras */}
                    <div className="row col-12 bg-white m-0 shadow-sm p-3 rounded mt-3">
                        <div className="col-12 p-0 border-bottom border-success border-3 d-flex justify-content-between align-items-center">
                            <h4 className="text-success fw-bold mb-0">Carrito de compras</h4>
                            <h4 className="bg-success rounded text-white p-1 px-2 mb-1"><i className="bi bi-cart3"> {ShopCart.length}</i></h4>
                        </div>
                        {ShopCart.length !== 0 ? (
                            <ProductList />
                        ) : (
                            <div className="col-12 p-0  mt-3">
                                <div className="p-5 alert alert-warning text-center mb-0 shadow-sm" role="alert">
                                    <p className="fs-6 fw-bold mb-3">Lista de servicios vacía</p>
                                    <button type="button" className="btn btn-sm btn-outline-warning" onClick={() => navigateTo("/serviceTypes")}>Explorar nuestros servicios</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {ShopCart.length !== 0 && (
                        <CalendarList setValue={setValue} />
                    )}
                    {appointmentData.datetime && ShopCart.length !== 0 && (
                        <CreditCard
                            register={register}
                            setValue={setValue}
                            watch={watch}
                            errors={errors}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                        />
                    )}
                </div>
            </div>
            <div class="modal fade" id="miModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="miModalLabel" aria-hidden="true" ref={modalRef}>
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="miModalLabel">Confirmar Pago</h5>
                        </div>
                        <div class="modal-body">
                            {(!isMutating && !pay) && (
                                <div class="alert alert-info text-center mb-0" role="alert">
                                    <p className="fs-6">Está seguro que desea realizar el pago?</p>
                                </div>
                            )}
                            {isMutating && (
                                <div class="alert alert-warning text-center mb-0" role="alert">
                                    <p className="mb-2 fs-6">Realizando el Pago</p>
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}
                            {pay && !error && (
                                <div class="alert alert-success text-center mb-0" role="alert">
                                    <p className="fs-6">{pay}</p>
                                </div>
                            )}
                            {error && !isMutating && (
                                <div class="alert alert-danger text-center mb-0" role="alert">
                                    <p className="fs-6">{pay}</p>
                                </div>
                            )}

                        </div>
                        <div class={`modal-footer d-flex align-items-center ${pay && !error ? "justify-content-center" : "justify-content-between"}`}>
                            {pay && !error ? (
                                <button type="button" class="btn btn-outline-success" data-bs-dismiss="modal" onClick={() => navigateTo("/profile")}>Ir a mi Perfil</button>
                            ) : (
                                <>
                                    <button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="button" class="btn btn-outline-success" onClick={handlePay}>Confirmar</button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}