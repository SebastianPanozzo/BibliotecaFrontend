import useStore from "../../../hooks/useStore";

export default function ProductList() {
    const { get, save } = useStore();
    const { ShopCart } = get();

    const removeItem = (index) => {
        ShopCart.splice(index, 1);
        save({ ShopCart }); //mirar acá despues
        localStorage.setItem("ShopCart", JSON.stringify(ShopCart));
    };

    return (
        <div className="col-12 p-0">
            {ShopCart.map((item, index) => (
                <div key={index} className="row col-12 m-0 mt-3 bg-white shadow border rounded p-2 py-3 py-sm-2">

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
                            className="btn btn-sm btn-outline-success w-100"
                            onClick={() => removeItem(index)}
                        >
                            Quitar
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
};