import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../hooks/useStore";

export default function Menu() {
  const { roles } = useStore().get();

  const btnList = [
    { name: "Gestión de Turnos", path: "/workspace/appointmentManagement", icon: "bi-calendar3", role: "Profesional" },
    { name: "Analíticas", path: "/workspace/analytics", icon: "bi-graph-up", role: "Administrador" },
    { name: "Administración de Personal", path: "/workspace/personalManagement", icon: "bi-person-vcard", role: "Administrador" },
    { name: "Administración de Servicios", path: "/workspace/servicesManagement", icon: "bi-stars", role: "Administrador" },
  ];

  const navigateTo = useNavigate();

  const [btnSelected, setBtnSelected] = useState(() => {
    return localStorage.getItem("lastSelectedBtn") || btnList[0].name;
  });

  useEffect(() => {
    localStorage.setItem("lastSelectedBtn", btnSelected);
  }, [btnSelected]);

  return (
    <nav className="navbar bg-success bg-opacity-25 shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <a className="navbar-brand d-flex align-items-center text-success fw-bold">
          <img style={{ width: '45px' }} className="me-2" src="/img/planta.png" alt="Logo" />
          Panel de Gestión
        </a>

        <button
          className="navbar-toggler border border-success"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="offcanvas offcanvas-start border-end border-3 border-success"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header bg-success bg-opacity-10 border-bottom border-success">
            <h5 className="offcanvas-title text-success fw-semibold" id="offcanvasNavbarLabel">Menú</h5>
            <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>

          <div className="offcanvas-body px-3 d-flex flex-column justify-content-between h-100">
            <div>
              {/* Botones del menú principal */}
              {btnList
                .filter(btn => {
                  // Mostrar si no requiere rol o si el usuario tiene ese rol
                  return !btn.role || roles?.some(role => role.name === btn.role);
                })
                .map((btn, idx) => (
                  <button
                    key={idx}
                    className={`btn w-100 mb-2 d-flex align-items-center justify-content-start px-3 border border-success 
        ${btn.name === btnSelected ? "bg-success text-white" : "bg-white text-success"}`}
                    onClick={() => {
                      setBtnSelected(btn.name);
                      navigateTo(btn.path);
                    }}
                  >
                    <i className={`bi ${btn.icon} me-3`}></i>
                    {btn.name}
                  </button>
                ))}
            </div>

            {/* Botón de Home en la parte inferior */}
            <div className="mt-4">
              <hr className="border-success" />
              <button
                className="btn btn-outline-success w-100 d-flex align-items-center justify-content-start px-3"
                onClick={() => navigateTo("/")}
              >
                <i className="bi bi-house-door-fill me-3"></i>
                Regresar al Inicio
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
