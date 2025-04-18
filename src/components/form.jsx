import { useState } from "react";

function Form({ context }) {
    const { title, inputs, service, style, className, messages } = context;
    const [buttonState, setButtonState] = useState("Enviar");
    const [status, setStatus] = useState({ type: null, message: "" }); 

    


    const handleSubmit = async (e) => {
        e.preventDefault();

        setButtonState("Enviando...");

        const formData = new FormData(e.target);
        const body = {};
        inputs.forEach((input) => {
            body[input.name] = formData.get(input.name);
        });

        console.log("Body: ", body)

        try {
            const res = await fetch(service, { body, method: "POST" })
            if (res.ok) {
                setButtonState("Enviando");
                setStatus({...status, type: "success"})
                e.target.reset();
            } else {
                setButtonState("Enviar");
                try {
                    const response = await res.json();
                    if(response.err) {
                        setStatus({type: "error", message: response.err})
                    } else{
                        setStatus({...status, type: "error"})
                    }
                } catch{
                    setStatus({...status, type: "error"})
                }                
            }

        } catch (e) {
            console.error("Error al enviar el formulario: ", e)
            setButtonState("Enviar");
            setStatus("error")
        }
    }

    return (
        <form className={`cd-flex flex-column bg-white text-center border border-2 rounded-2 p-3 ${className}`}
            style={style}
            onSubmit={handleSubmit}>
            {title ? (<h3 className="mb-3">{title}</h3>) : null}
            {inputs.map((item, index) => (
                <div key={index}>
                    {item.tag === 'input' ? (
                        <input type={item.type} id={item.id} name={item.name} placeholder={item.placeholder} required={item.required} className="form-control mb-2" />
                    ) : item.tag === 'textarea' ? (
                        <textarea name={item.name} id={item.id} placeholder={item.placeholder} required={item.required} className="form-control mb-2" style={{ height: "100px" }} ></textarea>
                    ) : null}
                </div>
            ))}
            <button type="submit" className="form-control btn btn-primary">{buttonState}</button>
            {status.type === "success" && messages.success?.show && (
                <div className="alert alert-success mt-3">
                    {messages.success.text ? messages.success.text : "Formulario enviado correctamente." }
                </div>
            )}
            {status.type === "error" && messages.error?.show && (
                <div className="alert alert-danger mt-3">
                    {status.message ? status.message : messages.error.text ? messages.error.text : "Hubo un error al enviar el formulario." }
                </div>
            )}

        </form>
    );
}

export default Form;