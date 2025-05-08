import useStore from "../hooks/useStore";

const CardLarge = ({ context }) => {
    const { save, get } = useStore();
    const { ShopCart } = get();
    const { name, description, image, props, _id } = context;

    const addToShopCart = () => {
        const currentUser = localStorage.getItem("currentUser");

        if (!currentUser) {
            const modal = new window.bootstrap.Modal(document.getElementById("loginModal"));
            modal.show();
            return;
        }

        const ShopCartLS = JSON.parse(localStorage.getItem("ShopCart")) || [];
        ShopCartLS.push(_id);
        localStorage.setItem("ShopCart", JSON.stringify(ShopCartLS));

        ShopCart.push(_id);
        save(ShopCart);
        console.log(get().ShopCart);
    };

    return (
        <>
            <div className="card mb-3 shadow-sm border-0 p-0">
                <div className="row g-0">
                    <div className="col-md-3 position-relative">
                        <img
                            src={image || "/placeholder.svg"}
                            className="img-fluid rounded-start h-100 w-100 object-fit-cover"
                            alt={name}
                            style={{ maxHeight: "250px" }}
                        />
                    </div>
                    <div className="col-md-9 d-flex flex-column">
                        <div className="card-body d-flex flex-column h-100 py-2">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h4 className="card-title fw-bold text-success mb-0">{name}</h4>
                                <span className="badge bg-success text-white p-2 fs-5">
                                    ${props.price.toLocaleString()}
                                </span>
                            </div>

                            <p className="card-text text-muted mb-3">{description}</p>

                            <div className="mt-auto">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="badge bg-light text-dark p-2">
                                        <i className="bi bi-clock me-1"></i> {props.duration} minutos
                                    </span>

                                    <div className="card bg-light border-0 py-0 px-2">
                                        <small className="text-muted">
                                            <strong>Materiales:</strong> {props.materials_included.join(", ")}
                                        </small>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center justify-content-md-end align-items-center">
                                    <button className="btn btn-success" onClick={addToShopCart}>
                                        <i className="bi bi-cart-plus me-2"></i>Agregar al carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de advertencia para login */}
            <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="loginModalLabel">Inicio de sesión requerido</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                        </div>
                        <div className="modal-body">
                            Debes estar logueado para agregar productos al carrito.
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-success" data-bs-dismiss="modal">Cerrar</button>
                            <a href="/login" className="btn btn-success">Iniciar sesión</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardLarge;