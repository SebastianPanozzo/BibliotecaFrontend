const Footer = () => {
    return (
        <footer className="bg-success text-white border-top">
            <div className="container py-4 d-flex flex-column align-items-center gap-2">
                <p className="fw-bold fs-6 mb-0">Creado por el Grupo: Error 404 - Not Found</p>
                <p className="mb-0">
                    Contacto del Spa: 
                    <a href="tel:+541123456789" className="text-white text-decoration-underline fw-medium">
                        +54 11 2345-6789
                    </a>
                </p>
                <p className="mb-0 text-white-50 small">&copy; 2025 Spa Sentirse Bien — Todos los derechos reservados</p>
            </div>
        </footer>
    );
};

export default Footer;