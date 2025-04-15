function Card({ service }) {
    const { title, description, img } = service
    return (
        <div className="col-12 col-md-6 col-xl-4 d-flex justify-content-center align-items-center mb-4">
            <div className="card shadow-sm" style={{ width: '20rem' }}>
                <img src={img} className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title fw-bolder">{title}</h5>
                    <p className="card-text">{description}</p>
                    <a href="#" className="btn btn-dark">Ver más</a>
                </div>
            </div>
        </div>
    )
}

import { services } from "../../../utiles/data";


function Services() {
    return (
        <div className="bg-light" id="services" 
        style={{
            backgroundImage: `url('./public/img/bgServices.webp')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            scrollMarginTop: '70px',
        }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="row text-center mb-4">
                    <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">Nuestros Servicios</h1>
                    <p className="fs-5 fw-bolder my-2">Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.</p>
                </div>
                <div className="row">
                    {services.map((service, index) => {
                        return (
                            <Card key={index} service={service} />
                        )
                    }
                    )}
                </div>
            </div>
        </div>
    )
}

export default Services;
