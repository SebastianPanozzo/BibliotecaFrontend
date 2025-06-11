import useStore from '../../../hooks/useStore'

import imgBg from '../../../../public/img/bgHome.webp'

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
            <div className="container min-vh-100 d-flex align-items-md-end px-4 py-5" >
                <div className="mb-md-5">
                    <h1
                        className="mb-3"
                        style={{
                            background: 'linear-gradient(90deg, #DEE063, #a8e063, #56ab2f)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontSize: "5em",
                            fontWeight: "800"
                        }}>
                        {spaData.name}
                    </h1>

                    <h2 className="fw-bold mb-2 text-white lh-sm mb-3">
                        Descubre la Experiencia de Bienestar Total
                    </h2>
                    <p className="lead lh-sm text-white mb-4 truncate-9-lines">
                        {spaData.description}

                    </p>
                    <div className="d-flex flex-column flex-md-row gap-2 mb-md-5">
                        <button className="btn btn-success btn-lg" >
                            <a className="nav-link" href="/serviceTypes">Explorar Servicios</a>
                        </button>
                        <button className="btn btn-outline-light btn-lg">
                            <a className="nav-link" href="/#about">Conócenos</a>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;