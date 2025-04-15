import img from "./../../../../public/svg/img1.svg"

function Home() {
    return (
        <div className="pt-5 pt-lg-0" id="home"
            style={{
                backgroundImage: `url('./public/img/bgDark.webp')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-6 text-center text-lg-start">
                        <h3 className="text-success fw-bold text-uppercase mb-2 d-block">Bienestar & Relax !!!!</h3>
                        <h1 className="display-4 fw-bold text-white mb-3">
                            Descubre la Experiencia de Bienestar Total
                        </h1>
                        <p className="lead text-white mb-4">
                            Te brindamos un oasis de tranquilidad, donde cada detalle ha sido cuidadosamente pensado para ofrecerte una experiencia de relajación profunda y renovación integral.
                        </p>
                        <div className="d-flex justify-content-center justify-content-lg-start gap-2">
                            <button className="btn btn-success btn-lg">Explorar Servicios</button>
                            <button className="btn btn-outline-light btn-lg">Conócenos</button>
                        </div>
                    </div>
                    <div className="col-12 col-lg-6 d-flex justify-content-center mt-4 mt-lg-0">
                        <img className="img-fluid" src={img} alt="imagen de spa" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;