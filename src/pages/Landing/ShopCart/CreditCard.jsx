import { useState } from 'react';
import useStore from "../../../hooks/useStore";
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export default function CreditCard({ register, watch, errors, handleSubmit, onSubmit }) {
    const { ShopCart } = useStore().get();
    const [focus, setFocus] = useState('');
    const cardNumber = watch('cardData.number');
    const cardName = watch('cardData.name');
    const cardExpiry = watch('cardData.expiry');
    const cardCvc = watch('cardData.cvc');
    const datetime = watch('datetime');
    const discount = watch('discount');
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    };

    const subtotal = ShopCart.reduce((total, item) => total + item.props.price, 0);
    const formattedDate = datetime ? new Date(datetime).toLocaleDateString("es-ar", options) : null;

    const calTotal = () => {
        let total = subtotal;
        if (discount.lenght !== 0) {
            discount.forEach(disc => {
                if (disc.type === "percentage") {
                    total = total - (total * (disc.value / 100));
                } else if (disc.type === "mount") {
                    total = total - disc.value;
                }
            })
            return total;
        } else {
            return total;
        }
    }

    return (
        <div className="row col-12 m-0 p-0 mt-3">
            {formattedDate && (
                <div className="col-12 p-0 mb-3">
                    <div className="alert alert-success text-center shadow-sm mb-0 d-flex justify-content-between align-items-center">
                        <strong>Fecha Selecionada: </strong><p className='fs-6'>{formattedDate}</p>
                    </div>
                </div>
            )}

            {/* Tarjeta a la izquierda */}
            <div className="row col-12 col-lg-6 m-0 p-0 pe-md-2 my-lg-0 ">
                {subtotal && (
                    <div className="col-12 p-0 mb-3">
                        <div className="alert alert-success text-center shadow-sm mb-0 ">
                            <div className='d-flex justify-content-between align-items-center'>
                                <strong>Subtotal:</strong><p className='fs-6'>$ {subtotal.toLocaleString()}</p>
                            </div>
                            {(discount && discount.lenght !== 0) && discount.map(discount => (
                                <div key={discount.reason} className='d-flex justify-content-between align-items-center'>
                                    <strong >{discount.reason}:</strong>
                                    <p className='fs-6'>{`${discount.type === 'percentage' ? '%' : '$'} ${discount.value}`}</p>
                                </div>
                            ))}
                            <div className='d-flex justify-content-between align-items-center border-top border-success border-2 mt-2 pt-1'>
                                <strong>Total:</strong><p className='fs-6'>$ {calTotal()}</p>
                            </div>
                        </div>
                    </div>
                )}
                <div className='my-3 my-lg-0'>
                    <Cards
                        number={cardNumber || ''} // Usar el valor del formulario o string vacío
                        name={cardName || ''}
                        expiry={cardExpiry || ''}
                        cvc={cardCvc || ''}
                        focused={focus}
                    />
                </div>

            </div>

            {/* Formulario a la derecha */}
            <div className="col-12 col-lg-6 p-0 ps-md-2 mt-3 mt-lg-0">
                <div className="card shadow-sm p-4">
                    <h4 className="mb-4">Datos de la Tarjeta</h4>
                    {/* El formulario no necesita handleSubmit aquí, ya que el submit es del padre */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <label htmlFor="number" className="form-label">Número</label>
                            <input
                                type="tel"
                                className="form-control"
                                id="number"
                                name="cardData.number" // El nombre del campo debe coincidir con la estructura del formulario
                                placeholder="1234 5678 9012 3456"
                                {...register('cardData.number',
                                    {
                                        required: 'Número de tarjeta es requerido',
                                        pattern: {
                                            value: /^[0-9]{13,18}$/,
                                            message: 'CVC inválido (3 a 5 dígitos)'
                                        }
                                    }

                                )}
                                onFocus={(e) => setFocus(e.target.name)}
                            />
                            {errors.cardData?.number && (
                                <div className="col-12 p-0 mt-1">
                                    <div className="alert alert-danger text-center shadow-sm mb-0 p-1">
                                        <p className="text-danger">{errors.cardData.number.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="cardData.name" // El nombre del campo debe coincidir con la estructura del formulario
                                placeholder="Nombre en la tarjeta"
                                {...register('cardData.name', { required: 'Nombre es requerido' })}
                                onFocus={(e) => setFocus(e.target.name)}
                            />
                            {errors.cardData?.name && (
                                <div className="col-12 p-0 mt-1">
                                    <div className="alert alert-danger text-center shadow-sm mb-0 p-1">
                                        <p className="text-danger">{errors.cardData.name.message}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor="expiry" className="form-label">Vencimiento</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="expiry"
                                    name="cardData.expiry" // El nombre del campo debe coincidir con la estructura del formulario
                                    placeholder="MM/YY"
                                    {...register('cardData.expiry', {
                                        required: 'Vencimiento es requerido',
                                        validate: validateExpiry
                                    })}
                                    onFocus={(e) => setFocus(e.target.name)}
                                />
                                {errors.cardData?.expiry && (
                                    <div className="col-12 p-0 mt-1">
                                        <div className="alert alert-danger text-center shadow-sm mb-0 p-1">
                                            <p className="text-danger">{errors.cardData.expiry.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="col-md-6 mb-3">
                                <label htmlFor="cvc" className="form-label">CVC</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="cvc"
                                    name="cardData.cvc" // El nombre del campo debe coincidir con la estructura del formulario
                                    placeholder="123"
                                    {...register('cardData.cvc',
                                        {
                                            required: 'CVC es requerido',
                                            pattern: {
                                                value: /^[0-9]{3,5}$/,
                                                message: 'CVC inválido (3 a 5 dígitos)'
                                            }
                                        }
                                    )}
                                    onFocus={(e) => setFocus(e.target.name)}
                                />
                                {errors.cardData?.cvc && (
                                    <div className="col-12 p-0 mt-1">
                                        <div className="alert alert-danger text-center shadow-sm mb-0 p-1">
                                            <p className="text-danger">{errors.cardData.cvc.message}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-success w-100">
                            Confirmar Pago
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

function validateExpiry(value) {
    if (!/^\d{2}\/\d{2}$/.test(value)) return "Formato inválido (MM/YY)";
    const [mm, yy] = value.split('/').map(Number);
    if (mm < 1 || mm > 12) return "Mes inválido";

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        return "Tarjeta vencida";
    }

    return true;
}