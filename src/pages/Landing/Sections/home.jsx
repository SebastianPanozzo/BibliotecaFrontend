import img from "./../../../../public/svg/img1.svg"

import useStore from '../../../hooks/useStore'

import imgBg from '../../../../public/img/bgDark.webp'

function Home() {
    const { get } = useStore();
    const { spaData } = get();
    return (
        <div className="pt-5 pt-lg-0" id="home"
            style={{
                backgroundImage: `url(${imgBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center mt-4 mt-lg-0">
                <div className="row align-items-center">
                    <div className="col-12 col-lg-6 text-center text-lg-start">
                        <h1
                            style={{
                                background: 'linear-gradient(90deg, #DEE063, #a8e063, #56ab2f)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}
                            className="fw-bold display-3">
                            {spaData.name}
                        </h1>

                        <h2 className="fw-bold text-white mb-3">
                            Descubre la Experiencia de Bienestar Total
                        </h2>
                        <p className="lead text-white mb-4">
                            {spaData.description}

                        </p>
                        <div className="d-flex justify-content-center justify-content-lg-start gap-2">
                            <button className="btn btn-success btn-lg" >
                                <a className="nav-link" href="/serviceTypes">Explorar Servicios</a>
                            </button>
                            <button className="btn btn-outline-light btn-lg">
                                <a className="nav-link" href="/#about">Conócenos</a>
                            </button>
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