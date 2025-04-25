import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form({ context }) {
    const navigateTo = useNavigate();
    const { title, inputs, service, style, className, setData, path , moreData} = context;
    const [buttonState, setButtonState] = useState("Enviar");
    const [status, setStatus] = useState({ type: null, message: "" });
    const [inputValues, setInputValues] = useState(() => {
        const initialValues = {};
        inputs.forEach(input => {
            initialValues[input.name] = input.value || '';
        });
        return initialValues;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setButtonState("Enviando...");

        const body = {...inputValues};

        const res = await service({...body, moreData});
        const { err, ok } = res;
        //console.log(res);

        if(err) { 
            setStatus({type: "error", message: err })
            setButtonState("Volver a enviar");
        }
        if(ok) {
            if(ok.message){
                setStatus({type: "success", message: ok.message })
            }
            setButtonState("Enviar");
            e.target.reset();
            setData(ok.data);
            if(path) {navigateTo(path)}
        }
    }

    return (
        <form className={`d-flex flex-column bg-white text-center border border-2 rounded-2 p-3 ${className.form || ""}`}
            style={style}
            onSubmit={handleSubmit}>
            {title ? (<h3 className={`mb-3 ${className.title || ""}`}>{title}</h3>) : null}
            {inputs.map((item, index) => (
                <div key={index} className="mb-3 d-flex flex-column align-items-start">
                    {/* Mostrar título del campo si existe */}
                    {item.title && (
                        <label htmlFor={item.id} className={`form-label ${className.label || ""}`}>
                            {item.title}
                        </label>
                    )}
                    {item.tag === 'input' ? (
                        <input 
                            type={item.type} 
                            id={item.id} 
                            name={item.name} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            value={inputValues[item.name] || ''}
                            onChange={!item.readOnly ? handleInputChange : undefined}
                            readOnly={item.readOnly || false}
                            className={`form-control ${className.input || ""}`} 
                        />
                    ) : item.tag === 'textarea' ? (
                        <textarea 
                            name={item.name} 
                            id={item.id} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            value={inputValues[item.name] || ''}
                            onChange={!item.readOnly ? handleInputChange : undefined}
                            readOnly={item.readOnly || false}
                            className={`form-control ${className.textarea || ""}`} 
                            style={{ height: "100px" }} 
                        ></textarea>
                    ) : null}
                </div>
            ))}
            <button type="submit" className={`form-control btn btn-primary ${className.button || ""}`}>{buttonState}</button>

            {status.type === "success" && status.message && (
                <div className="alert alert-success mt-3 mb-0">
                    {status.message}
                </div>
            )}
            {status.type === "error" && (
                <div className="alert alert-danger mt-2 mb-0">
                    {status.message || "Hubo un error al enviar el formulario."}
                </div>
            )}
        </form>
    );
}

export default Form;