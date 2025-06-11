//import { services } from "../../../utiles/data";
import { useEffect, useState } from "react";
import Slider from "../../../components/Slider"
import Card from "../../../components/Card"
import useFetchData from "../../../hooks/useFetchData";
import bgAbout from "../../../../public/img/bgAbout.webp"

function Services() {
    const [services, setServices] = useState(null);
    const { trigger, error } = useFetchData('/api/findObjectsTypes');
    const button = {name: "Ver más", path: "serviceTypes" }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const body = [
                    {
                        "$match": {
                            "parent": "service"
                        }
                    },
                    {
                        "$project": {
                            "name": 1,
                            "description": 1,
                            "image": 1
                        }
                    }
                ]
                const data = await trigger({
                    method: 'POST',
                    body: body
                });
                setServices(data.items);
            } catch (err) {
                console.error('Error al hacer la request:', err.message);
            }
        };
        fetchData();
    }, []);


    return (
        <div className="bg-light" id="services"
            style={{
                backgroundImage: `url(${bgAbout})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
                scrollMarginTop: '70px',
            }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-white px-4 px-md-0">
                <div className="row text-center mb-4">
                    <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">Nuestros Servicios</h1>
                    <p className="fs-5 fw-bolder my-2">Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.</p>
                </div>
                <div className="row col-12">
                    {services && <Slider context={{ Component: Card, items: services, button }} />}
                    {error && <p>{error}</p>}
                </div>
            </div>
        </div>
    )
}

export default Services;
