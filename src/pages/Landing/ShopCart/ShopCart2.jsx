import { useState, useEffect } from "react";
import useStore from "../../../hooks/useStore";
import ProductList from "./ProductList";
import CalendarList from "./CalendarList";
import CreditCard from "./CreditCard";
import img from "../../../../public/img/bgDark.webp"


export default function ShopCart2() {
    const { get } = useStore();
    const [selectedDate, setSelectedDate] = useState();
    const { ShopCart, currentUser, spaData } = get();
    console.log("SapaData: ", {spaData, currentUser});

    console.log("Fecha:", selectedDate)

    return (
        <div className="bg-light min-vh-100 pt-5 pb-2 px-3" id="services"
            style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}>
            <div className="container pt-5">
                <div className="row card-custom border rounded p-3 mb-3 border-light-subtle">
                    <div className="col-12 d-flex justify-content-start align-items-center p-0">
                        <h4 className="text-success me-3"><i className="bi bi-cart3 bg-success text-white p-2 rounded"></i></h4>
                        <h4 className="text-white m-0">Hacé tu reservación online: </h4>
                    </div>
                </div>
                <div className="row card-custom p-3 mb-3 rounded border border-light-subtle" >
                    <ProductList />
                </div>
                {ShopCart.length !== 0 && (
                    <CalendarList context={{setSelectedDate}} />
                )}
                <div className="row card-custom p-3 mb-3 rounded border border-light-subtle" >
                    <CreditCard />
                </div>
            </div>
        </div>
    );
}

