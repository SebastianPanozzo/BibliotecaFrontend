import team from "../../../../public/img/team.webp"
function About() {
  return (
    <div className="bg-color-1" id="about">
      <div className="container d-flex flex-column align-items-center justify-content-center px-4 px-md-0" style={{ minHeight: "65dvh" }}>
        <div className="row text-center my-4">
          <h2 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.25rem', fontWeight: "1000" }}
            className="color-4 mb-4">
            Quienes Somos
          </h2> 
          <p className="fs-5">
            Fundado en 2010, 
            Spa Sentirse Bien nació con la visión de crear un espacio donde nuestros clientes puedan 
            reconectar con la naturaleza y encontrar un equilibrio perfecto entre cuerpo y mente.
          </p>
        </div>
        <div className="row mt-lg-4 mb-5">
          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
            <img className="img-fluid rounded rounded-4 shadow-sm" src={team} alt="imagen de spa" />
          </div>

          <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-between mt-4 mt-lg-0 text-center text-lg-start">
            <div>
              <p className="fs-4 fw-bolder color-4 mb-0"><i className="bi bi-tree-fill"></i> Nuestra Filosofía</p>
              <p className="m-0 mb-4">Creemos en un enfoque holístico del bienestar, inspirado en la sabiduría de la naturaleza, donde cada tratamiento está diseñado para nutrir tanto el cuerpo como el espíritu.</p>
            </div>
            <div>
              <p className="fs-4 fw-bolder color-4 mb-0"><i className="bi bi-heart-fill"></i> Nuestro Equipo</p>
              <p className="m-0 mb-4">Contamos con terapeutas certificados y altamente capacitados, dedicados a proporcionar experiencias personalizadas de la más alta calidad, respetando los ritmos naturales del cuerpo.</p>
            </div>
            <div>
              <p className="fs-4 fw-bolder color-4 mb-0"><i className="bi bi-droplet-half"></i> Nuestro Compromiso</p>
              <p className="m-0 mb-4">Nos comprometemos a utilizar productos orgánicos y técnicas inspiradas en tradiciones ancestrales para garantizar resultados excepcionales en cada visita, siempre en armonía con el medio ambiente.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default About;