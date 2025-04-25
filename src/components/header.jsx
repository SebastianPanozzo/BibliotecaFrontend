import { useNavigate } from "react-router-dom";
import useStore from "../hooks/useStore";
import { useEffect } from "react";

const Header = () => {
    const navigateTo = useNavigate();
    const { save, get, remove} = useStore();
    const { currentUser } = get();

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            save({ currentUser: JSON.parse(currentUser) });
        }
    }, []);

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
                backgroundColor: 'rgba(255, 255, 255, 0.3)', // blanco translúcido
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
        >
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid ">
                        <a className="navbar-brand fw-bolder fs-5 text-success" href="#home" onClick={() => navigateTo('/#home')}>
                            <i className="bi bi-suit-spade-fill me-1 fw-bolder" ></i>
                            Sentirse Bien Spa
                        </a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <a className="nav-link active text-success" aria-current="page" href="#home" onClick={() => navigateTo('/#home')}>Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active text-success" href="#about" onClick={() => navigateTo('/#about')}>Sobre Nosotros</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-success" href="#services" onClick={() => navigateTo('/#services')}>Servicios</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link text-success" href="#location" onClick={() => navigateTo('/#location')}>Ubicación</a>
                                </li>
                            </ul>
                            {currentUser ?
                                <button className="btn btn-success px-5" type="button" onClick={handleLogout} >Salir</button>
                                :
                                <>
                                    <button className="btn btn-outline-success me-2 px-5" type="button" onClick={() => navigateTo('/login')}>Ingresar</button>
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
