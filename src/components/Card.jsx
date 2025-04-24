import { useNavigate } from "react-router-dom";

function Card({ context }) {
    const navigateTo = useNavigate();
    const { item: { _id, name, description, image, info }, button, className } = context;

    const navegate = () => {
        const str = `/${button.path}/${_id}`;
        navigateTo(str);
    };
    return (
        <div className="card shadow-sm rounded-4 w-100 h-100" >
            <div className={`w-100 overflow-hidden`}  
            style={{ height: "300px" }}>
                <img
                    src={image}
                    className="rounded-bottom-0" 
                    alt={`Imagen de ${name}`}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                    }}
                />
            </div>
            <div className="card-body p-3">
                <h2 className="fw-bold mb-3">{name}</h2>
                <div className="">
                    <strong>Description: </strong> <span className="text-muted">{description}</span>
                </div>

                {info && Object.entries(info).map(([key, value]) => (
                    <div key={key} className="">
                        <strong>{key}: </strong>
                        <span>{
                            key === "Precio" ? `$ ${value}` : key === "Duración del servicio" ? `${value} minutos` : value}
                        </span>
                    </div>
                ))}

            </div>
            {button && (
                <div className="p-3">
                    <button type="submit" className="form-control btn btn-success" onClick={navegate}>{button.name}</button>
                </div>
            )}
        </div>
    )
}

export default Card;