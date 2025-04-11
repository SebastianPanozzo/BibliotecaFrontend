function Header() {
    return (
        <div
            className="fixed-top"
            style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)', // para Safari
                backgroundColor: 'rgba(255, 255, 255, 0.2)', // blanco translúcido
                borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}>
            <div className="container ">
                <header className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3">
                    <div className="col-md-3 mb-2 mb-md-0">
                        <a href="/" className="d-inline-flex link-body-emphasis text-decoration-none">
                            {/* Si tenés un ícono de Bootstrap o querés usar uno de FontAwesome, colocalo aquí */}
                            <svg className="bi" width="40" height="32" role="img" aria-label="Bootstrap">
                                <use xlinkHref="#bootstrap" />
                            </svg>
                        </a>
                    </div>

                    <ul className="nav col-12 col-md-auto mb-2 justify-content-center mb-md-0 align-items-center">
                        <li><a href="#home" className="nav-link px-2 link-dark fw-bolder fs-5">Inicio</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Quienes Somos</a></li>
                        <li><a href="#services" className="nav-link px-2 link-dark">Servicios</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Ubicación</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Contacto</a></li>
                        <li><a href="#" className="nav-link px-2 link-dark">Referencias</a></li>
                    </ul>

                    <div className="col-md-3 text-end">
                        <button type="button" className="btn btn-outline-primary me-2">Login</button>
                        <button type="button" className="btn btn-primary">Sign-up</button>
                    </div>
                </header>
            </div>
        </div>
    )
}
export default Header;