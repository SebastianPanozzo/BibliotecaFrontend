import { useNavigate } from "react-router-dom";
import useStore from "../hooks/useStore";

const Header = () => {
    const navigateTo = useNavigate();
    const { get, remove } = useStore();
    const { currentUser, ShopCart } = get();

    const handleLogout = () => {
        remove("currentUser")
        localStorage.removeItem("currentUser");
        navigateTo('/login');
    }

    return (
        <div className="fixed-top"
            style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // para Safari
                backgroundColor: 'rgba(0, 40, 20, 0.4)', // blanco translúcido
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <div className="container text-white">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid ">
                        <a className="navbar-brand fw-bolder fs-5 text-white" href="#home" onClick={() => navigateTo('/#home')}>
                            <img style={{width: '45px'}} className="me-2" src="/img/planta.png" alt="Logo" />
                            Sentirse Bien Spa
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="" onClick={() => navigateTo('/serviceTypes')}>Nuestros servicios</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active text-white" href="#about" onClick={() => navigateTo('/#about')}>Sobre Nosotros</a>
                                </li>

                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#services" onClick={() => navigateTo('/#services')}>Tipos de Servicios</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-white" href="#location" onClick={() => navigateTo('/#location')}>Ubicación</a>
                                </li>
                            </ul>
                            {currentUser ?
                                <>
                                    <button className="btn btn-outline-light me-2 px-5" type="button" onClick={() => navigateTo('/shopCart')}>
                                        {`${ShopCart.length > 0 ? '+' : ''}${ShopCart.length > 0 ?  ShopCart.length : ''}`}<i className="bi bi-cart-check"></i>
                                    </button>
                                    {/* <button className="btn btn-outline-success me-2" type="button" onClick={() => navigateTo('/')}>Mis Turnos</button> */}
                                    <button className="btn btn-success" type="button" onClick={handleLogout} >Salir</button>
                                </>
                                :
                                <>
                                    <button className="btn btn-outline-light me-2 px-5" type="button" onClick={() => navigateTo('/login')}>Ingresar</button>
                                    <button className="btn btn-success" type="button" onClick={() => navigateTo('/register')} >Registrarse</button>
                                </>
                            }
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;
