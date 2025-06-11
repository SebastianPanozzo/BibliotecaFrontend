const Footer = () => {
    return (
        <footer className="bg-success text-white border-top">
            <div className="container py-4">
                <div className="row justify-content-center text-center">
                    <div className="col-12 col-md-8">
                        <h5 className="fw-bold mb-3">Sentirse Bien Spa</h5>
                        
                        {/* Información de contacto con iconos */}
                        <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-3">
                            <div className="d-flex align-items-center gap-2">
                                <svg width="16" height="16" fill="currentColor" className="bi bi-telephone-fill" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
                                </svg>
                                <a href="tel:+541123456789" className="text-white text-decoration-none fw-medium">
                                    +54 11 2345-6789
                                </a>
                            </div>
                            
                            <div className="d-flex align-items-center gap-2">
                                <svg width="16" height="16" fill="currentColor" className="bi bi-envelope-fill" viewBox="0 0 16 16">
                                    <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                </svg>
                                <a href="mailto:info@sentirsebien.spa" className="text-white text-decoration-none fw-medium">
                                    info@sentirsebien.spa
                                </a>
                            </div>
                        </div>
                        
                        {/* Redes sociales */}
                        <div className="d-flex justify-content-center gap-3 mb-3">
                            <a href="https://facebook.com/sentirsebien.spa" 
                               className="text-white text-decoration-none d-flex align-items-center gap-2 px-3 py-2 rounded border border-white-50"
                               target="_blank" rel="noopener noreferrer">
                                <svg width="18" height="18" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                                </svg>
                                <span className="small">Síguenos</span>
                            </a>
                        </div>
                        
                        {/* Separador */}
                        <hr className="border-white-50 my-3" />
                        
                        {/* Información del grupo */}
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                            <svg width="16" height="16" fill="currentColor" className="bi bi-code-slash" viewBox="0 0 16 16">
                                <path d="M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294l4-13zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0z"/>
                            </svg>
                            <p className="fw-bold mb-0">Creado por el Grupo: Error 404 - Not Found</p>
                        </div>
                        
                        {/* Copyright */}
                        <p className="mb-0 text-white-50 small">
                            <svg width="14" height="14" fill="currentColor" className="bi bi-c-circle me-1" viewBox="0 0 16 16">
                                <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8Zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0ZM9.146 4.992c-1.212 0-1.927.92-1.927 2.502v1.06c0 1.571.703 2.462 1.927 2.462.979 0 1.641-.586 1.729-1.418h1.295v.093c-.1 1.448-1.354 2.467-3.03 2.467-2.091 0-3.269-1.336-3.269-3.603V7.482c0-2.261 1.201-3.638 3.27-3.638 1.681 0 2.935 1.054 3.029 2.572v.088H9.875c-.088-.879-.768-1.512-1.729-1.512Z"/>
                            </svg>
                            2025 Spa Sentirse Bien — Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;