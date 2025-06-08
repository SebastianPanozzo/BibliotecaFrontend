import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import useStore from "../../../hooks/useStore";
import ProductList from "./ProductList";
import CalendarList from "./CalendarList";
import CreditCard from "./CreditCard";
const service_unit = import.meta.env.VITE_SPA_ID;

/* 
    {
        datetime = date,
        services = [],
        professional = id,
        service_unit = id,
        pay:{
            isPaid = true,
            cradData = {
                name = name,
                number = number,
                expiration = expiration,
                cvv = cvv
            }
            discount = [
                {    
                    type: "percentage" | "amount",
                    value: 10,
                    reason: "Descuento por fidelidad"
                }
            ]
        }
    }
*/

// agregar servicios, service_unit  al handlerSubmit

export default function ShopCart2() {
    const navigateTo = useNavigate();
    const { ShopCart, currentUser: { token }, spaData } = useStore().get();

    // React hook form
    const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm({
        defaultValues: {
            datetime: "",
            professional: "",
            service_unit: "",
            isPaid: false,
            discount: [],
            cardData: {},
        },
    });

    const onSubmit = (data) => {
        console.log("Formulario enviado", data);
    };

    console.log("SapaData: ", { token, useForm: watch() });

    //console.log("Fecha:", selectedDate)

    return (
        <div className="min-vh-100 pb-2 px-2 bg-spa-img" /* id="services" */>
            <div className="container">
                <div className="row card bg-body-tertiary shadow-lg border-0 p-3 mb-3" >
                    {/*Título de la card */}
                    <div className="col-12 bg-white d-flex justify-content-between align-items-center shadow-sm p-3 rounded border-start border-success border-4">
                        <h4 className="text-success fw-bold mb-0">Hacé tu reservación online</h4>
                        <h4 className="bg-success rounded text-white p-1 px-3"><i className ="bi bi-send"></i></h4>
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

                </div>

                {/* <div className="row card-custom p-3 mb-3 rounded border border-light-subtle" >
                    <CreditCard />
                </div> */}
            </div>
        </div>
    );
}

