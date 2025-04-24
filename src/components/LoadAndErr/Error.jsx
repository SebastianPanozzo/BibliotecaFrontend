export default function Error(context) {
    let {backgroundImage, message} = context;
  
    const backgroundStyle = {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      minHeight: "100vh",
      position: "relative",
    }
  
    const overlayStyle = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(40, 167, 69, 0.2)", // Bootstrap success color with opacity
    }
  
    return (
      <div style={backgroundStyle} className="d-flex align-items-center justify-content-center">
        <div style={overlayStyle}></div>
  
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <div className="bg-white bg-opacity-75 p-5 rounded-3 shadow-lg">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    fill="#28a745"
                    className="bi bi-emoji-frown"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z" />
                  </svg>
                </div>
  
                <h1 className="display-1 fw-bold text-success mb-3">404</h1>
                <h2 className="fw-light text-success mb-4">Recurso no Encontrado</h2>
  
                <div className="border-top border-success pt-4 mt-4">
                  <p className="lead text-muted">{message || "Parece que te has perdido en nuestro oasis de tranquilidad"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }