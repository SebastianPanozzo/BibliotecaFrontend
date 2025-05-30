import { useState } from 'react';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';

export default function CreditCardForm() {
    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');
    const [focus, setFocus] = useState('');

    return (
        <div className="container">
            <div className="row m-0 g-4 align-items-center">
                {/* Tarjeta a la izquierda */}
                <div className="col-12 col-lg-6 d-flex justify-content-center m-0 my-5 my-lg-0"
                    style={{
                        transform: 'scale(1.5)',
                        transformOrigin: 'center',
                    }}>
                    <div>
                        
                    </div>
                    <Cards
                        number={number}
                        name={name}
                        expiry={expiry}
                        cvc={cvc}
                        focused={focus}
                    />
                </div>

                {/* Formulario a la derecha */}
                <div className="col-12 col-lg-6 m-0 mt-3 mt-lg-0">
                    <div className="card shadow-sm p-4">
                        <h4 className="mb-4">Datos de la Tarjeta</h4>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="number" className="form-label">Número</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="number"
                                    name="number"
                                    placeholder="1234 5678 9012 3456"
                                    value={number}
                                    onChange={(e) => setNumber(e.target.value)}
                                    onFocus={(e) => setFocus(e.target.name)}
                                />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    placeholder="Nombre en la tarjeta"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    onFocus={(e) => setFocus(e.target.name)}
                                />
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="expiry" className="form-label">Vencimiento</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="expiry"
                                        name="expiry"
                                        placeholder="MM/YY"
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        onFocus={(e) => setFocus(e.target.name)}
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="cvc" className="form-label">CVC</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="cvc"
                                        name="cvc"
                                        placeholder="123"
                                        value={cvc}
                                        onChange={(e) => setCvc(e.target.value)}
                                        onFocus={(e) => setFocus(e.target.name)}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-success w-100">
                                Confirmar Pago
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

