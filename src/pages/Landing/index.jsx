import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"
import Error from "../../components/LoadAndErr/Error";
import image from "../../../public/img/bgDark.webp"
import Loader from "../../components/LoadAndErr/Loader";
import useFetchData from "../../hooks/useFetchData";
import useStore from "../../hooks/useStore";

const LandingLayout = () => {
    const { save, get } = useStore();
    const { spaData } = get();
    const { trigger, error, isMutating } = useFetchData('/api/findObjects');

    useEffect(() => {
        const fetch = async () => {
            try {
                const body = [{ "$match": { "_id": { "$eq": import.meta.env.VITE_SPA_ID } } }]

                const data = await trigger({
                    method: 'POST',
                    body: body
                });

                save({ spaData: data.items[0] });
                sessionStorage.setItem('spaData', JSON.stringify(data.items[0]));

            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }

        }
        if (!sessionStorage.getItem('spaData')) {
            fetch()
        } else {
            const spaData = JSON.parse(sessionStorage.getItem('spaData'));
            save({ spaData: spaData });
        }

    }, [save, trigger]);

    //Agregar acá lo del carrito
    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            save({ currentUser: JSON.parse(currentUser) });
        }

        const ShopCart = localStorage.getItem("ShopCart");
        if (ShopCart) {
            save({ ShopCart: JSON.parse(ShopCart) });
        } else {
            localStorage.setItem("ShopCart", JSON.stringify([]));
            save({ ShopCart: [] });
        }

    }, [save]);

    return (
        <>
            <Header />
            {isMutating && <Loader context={{ image }} />}
            {error && < Error backgroundImage={image} />}
            {spaData && <Outlet />}
        </>
    );
};

export default LandingLayout;