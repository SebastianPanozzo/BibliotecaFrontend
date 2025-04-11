import img from "./../../../../public/img/imagenPrimary.webp"

function Primary() {
    return (
        <div className="bg-light" id="home">
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="row">
                    <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center">
                        <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }}>
                            Descubre la Experiencia de Bienestar Total
                        </h1>
                        <p className="fs-5 fw-bolder text-secondary my-2">En Serenity Spa, nos dedicamos a brindarte un oasis de tranquilidad y rejuvenecimiento para el cuerpo y la mente.</p>
                        <div className="col-12 d-flex my-2 mb-4">
                            <button className="btn btn-dark btn-lg me-2">Explorar Servicios</button>
                            <button className="btn btn-dark btn-lg">Explorar Servicios</button>
                        </div>

                    </div>
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-0">
                        <img className="img-fluid rounded rounded-4 shadow-sm" src={img} alt="imagen de spa" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Primary;