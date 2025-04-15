import img from "./../../../../public/img/imgHome.webp"

function Home() {
    return (
        <div className="pt-5 pt-lg-0"  id="home"
            style={{
                backgroundImage: `url('./public/img/bgDark.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="row">
                    <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-between text-center text-lg-start">
                        <div>
                            <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }}
                                className="text-white mb-1 mb-xl-3">
                                Descubre la Experiencia de Bienestar Total
                            </h1>
                            <p className="fs-5 fw-bolder text-white mb-xxl-5 mb-lg-2">
                            nos dedicamos a brindarte un oasis de tranquilidad, 
                            donde cada detalle ha sido cuidadosamente pensado para ofrecerte 
                            una experiencia de relajación profunda y renovación integral.
                            </p>
                        </div>

                        <div className="col-12 d-flex mb-4 mb-lg-0 justify-content-center justify-content-lg-start">
                            <button className="btn btn-success btn-lg me-2">Explorar Servicios</button>
                            <button className="btn btn-success btn-lg">Explorar Servicios</button>
                        </div>

                    </div>
                    <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-2">
                        <img className="img-fluid rounded rounded-4 shadow-sm" src={img} alt="imagen de spa" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;