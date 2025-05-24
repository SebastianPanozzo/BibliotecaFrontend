import { useState } from "react";

export default function Menu() {
  const btnList = [
    { name: "Analíticas" },
    { name: "Gestión de Servicios" },
    { name: "Gestión de Personal" },
    { name: "Gestion de Turnos" }
  ];
  const [btnSelected, setBtnSelected] = useState(btnList[0].name);

  return (
    <nav className="navbar bg-success bg-opacity-25">
      <div className="container-fluid">
        <a className="navbar-brand">
          <img style={{ width: '45px' }} className="me-2" src="/img/planta.png" alt="Logo" />
          Panel de Gestion
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="offcanvas offcanvas-end px-3" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
          {/* Header de menu */}
          <div className="offcanvas-header border-bottom">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">Menú Principal</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          {/* Body del menu */}
          <div className="offcanvas-body">
            <div>
              {btnList.map((btn, idx) => (
                <button
                  key={idx}
                  className={`
                btn  bg-opacity-75 w-100 shadow mb-3 
                ${btn.name === btnSelected ? "bg-success" : "bg-body-tertiary"} 
                ${btn.name === btnSelected ? "text-success" : "text-muted"}
                text-white`}
                  onClick={() => setBtnSelected(btn.name)}>
                  {btn.name}
                </button>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </nav>
  );
}