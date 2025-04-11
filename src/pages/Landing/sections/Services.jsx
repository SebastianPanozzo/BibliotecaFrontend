function Card() {
    return (
        <div className="col-4">
            <div className="card" style={{ width: '18rem' }}>
                <img src="https://semantic-ui.com/images/wireframe/image.png" className="card-img-top" alt="..." />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="btn btn-primary">Go somewhere</a>
                </div>
            </div>
        </div>
    )
}


function Services() {
    return (
        <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center">
            <div className="row text-center">
                <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }}>Nuestros Servicios</h1>
                <p className="fs-5 fw-bolder text-secondary my-2">Descubre nuestra amplia gama de tratamientos diseñados para rejuvenecer, relajar y revitalizar.</p>
            </div>
            <div className="row">
                <Card />
                <Card />
                <Card />
                <Card />
            </div>
        </div>
    )
}

export default Services;
