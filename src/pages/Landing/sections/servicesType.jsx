import { services } from "../../../utiles/data";
import Slider from "../../../components/Slider"
import Card from "../../../components/Card"

function Services() {
    return (
        <div className="bg-light" id="services" 
        style={{
            backgroundImage: `url('./public/img/bgAbout.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            scrollMarginTop: '70px',
        }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-white">
                <div className="row text-center mb-4">
                    <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">Nuestros Servicios</h1>
                    <p className="fs-5 fw-bolder my-2">Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.</p>
                </div>
                <div className="row col-12">
                    <Slider context={{Component: Card, items: services}}/>
                </div>
                <div>
                    <button className="btn btn-outline-light btn-lg mt-4">Explorar los tipos de servicios</button>
                </div>
            </div>
        </div>
    )
}

export default Services;
