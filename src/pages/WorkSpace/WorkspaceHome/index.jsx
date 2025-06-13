export default function WorkspaceHome() {
  return (
    <div className="min-vh-100">
      <div className="container">

        {/* Encabezado */}
        <div className="text-center mb-5">
          <img src="/img/planta.png" alt="Logo" style={{ width: "60px" }} className="mb-3" />
          <h1 className="h3 text-success fw-bold">Bienvenido al Panel de Administración</h1>
          <p className="text-secondary mb-1">Gestión Integral de tu Spa</p>
          <p className="text-muted">Controlá turnos, clientes y servicios desde un solo lugar</p>
        </div>

        {/* Tarjeta de bienvenida */}
        <div className="card shadow-sm mb-5">
          <div className="card-body text-center">
            <h5 className="card-title text-success fw-semibold">¡Comenzá a gestionar tu spa de manera eficiente!</h5>
            <p className="card-text text-secondary">
              Desde este panel podés administrar todos los aspectos de tu negocio.
              Usá el menú lateral para acceder a las distintas funciones.
            </p>
          </div>
        </div>

        {/* Tarjetas de funcionalidades */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-success fs-4">
                  <i className="bi bi-calendar3"></i>
                </div>
                <h5 className="card-title text-success">Gestión de Turnos</h5>
                <p className="card-text text-muted">
                  Programá, modificá y controlá los turnos de tus clientes fácilmente.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-success fs-4">
                  <i className="bi bi-people-fill"></i>
                </div>
                <h5 className="card-title text-success">Administración de Clientes</h5>
                <p className="card-text text-muted">
                  Mantené un registro completo de tus clientes y sus servicios.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="mb-3 text-success fs-4">
                  <i className="bi bi-gear-fill"></i>
                </div>
                <h5 className="card-title text-success">Configuración</h5>
                <p className="card-text text-muted">
                  Personalizá los servicios, horarios y otras configuraciones del sistema.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer simple */}
        <div className="text-center mt-5 text-muted small">
          Tip: Usá el menú lateral izquierdo para acceder rápidamente a las secciones
        </div>
      </div>
    </div>
  );
}