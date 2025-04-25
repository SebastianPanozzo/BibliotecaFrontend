import team from "../../../../public/img/team.webp"
function About() {
  return (
    <div className="" id="about" style={{background: 'rgba(87, 184, 42, 0.2)'}}>
      <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="row text-center my-4">
          <h2 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.25rem', fontWeight: "1000" }}
            className="text-success">
            Quienes Somos
          </h2>
          <p className="fs-5 fw-bolder">
            Fundado en 2010, 
            Spa Sentirse Bien nació con la visión de crear un espacio donde nuestros clientes puedan 
            reconectar con la naturaleza y encontrar un equilibrio perfecto entre cuerpo y mente.
          </p>
        </div>
        <div className="row mt-lg-4">
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
            <img className="img-fluid rounded rounded-4 shadow-sm" src={team} alt="imagen de spa" />
          </div>

          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-between mt-4 mt-lg-0 text-center text-lg-start">
            <div>
              <p className="fs-4 fw-bolder text-success mb-0"><i className="bi bi-tree-fill"></i> Nuestra Filosofía</p>
              <p className="fw-medium">Creemos en un enfoque holístico del bienestar, inspirado en la sabiduría de la naturaleza, donde cada tratamiento está diseñado para nutrir tanto el cuerpo como el espíritu.</p>
            </div>
            <div>
              <p className="fs-4 fw-bolder text-success mb-0"><i className="bi bi-heart-fill"></i> Nuestro Equipo</p>
              <p className="fw-medium">Contamos con terapeutas certificados y altamente capacitados, dedicados a proporcionar experiencias personalizadas de la más alta calidad, respetando los ritmos naturales del cuerpo.</p>
            </div>
            <div>
              <p className="fs-4 fw-bolder text-success mb-0"><i className="bi bi-droplet-half"></i> Nuestro Compromiso</p>
              <p className="fw-medium">Nos comprometemos a utilizar productos orgánicos y técnicas inspiradas en tradiciones ancestrales para garantizar resultados excepcionales en cada visita, siempre en armonía con el medio ambiente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;