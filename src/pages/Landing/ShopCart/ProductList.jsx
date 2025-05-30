import { useNavigate } from "react-router-dom";
import useStore from "../../../hooks/useStore";

export default function ProductList() {
    const { get, save } = useStore();
    const { ShopCart } = get();
    const navigateTo = useNavigate()

    const removeItem = (index) => {
        ShopCart.splice(index, 1);
        save({ ShopCart }); //mirar acá despues
        localStorage.setItem("ShopCart", JSON.stringify(ShopCart));
    };

    return (
        <>
            {(ShopCart.length === 0) ? (
                <div className=" d-flex align-items-center justify-content-center" style={{ minHeight: "25vh" }}>
                    <div className="d-flex flex-column align-items-center justify-content-center text-center">
                        <h4 className="text-white mb-3">No hay servicios seleccionados</h4>
                        <button className="btn btn-success fw-bolder" onClick={() => navigateTo("/serviceTypes")}>Ver lista de Servicios</button>
                    </div>
                </div>
            ) : (
                <div className="" style={{ minHeight: "25vh" }}>
                    <div className="card shadow-sm p-2 mb-3 bg-success bg-opacity-75 text-white border-light">
                        <h5>Servicios Seleccionados: </h5>
                    </div>
                    {ShopCart.map((item, index) => (
                        <div key={index} className="row col-12 m-0 mb-3 bg-white shadow border rounded p-2 py-3 py-sm-2">

                            <div className="col-sm-2 col-lg-1 d-flex justify-content-center p-sm-0 mb-3 mb-sm-0" style={{ height: "100px" }}>
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="img-fluid rounded"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            </div>

                            <div className="col-sm-8 col-lg-10 mb-3 mb-sm-0">
                                <h5 className="mb-1">{item.name}</h5>
                                <p className="m-0">
                                    <strong>Categoría:</strong> <span className="text-muted">{item.categorie}</span>
                                </p>
                                <p className="m-0">
                                    <strong>Duración:</strong> <span>{item.props.duration} min</span>
                                </p>
                                <p className="m-0">
                                    <strong>Precio:</strong> <span>${item.props.price.toLocaleString()}</span>
                                </p>
                            </div>
                            <div className="col-sm-2 col-lg-1  d-flex align-items-center justify-content-center p-3 p-sm-0">
                                <button
                                    className="btn btn-outline-success w-100"
                                    onClick={() => removeItem(index)}
                                >
                                    Quitar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
};