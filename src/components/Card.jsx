function Card( {context} ) {
    const { title, description, image, alt } = context;
    return (
        <div className="card shadow-sm rounded-3 p-3 h-100" >
            <img src={image} className="card-img-top rounded-2" alt={alt} />
            <div className="card-body px-0">
                <h5 className="card-title fw-bolder">{title}</h5>
                <p className="card-text">{description}</p>
            </div>
        </div>
    )
}

export default Card;