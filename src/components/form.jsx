import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Form({ context }) {
    const navigateTo = useNavigate();
    const { title, inputs, service, style, className, setData, path } = context;
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

        const res = await service(body);
        const { err, ok } = res;
        console.log("resinform", res);

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
        <form className={`cd-flex flex-column bg-white text-center border border-2 rounded-2 p-3 ${className.form || ""}`}
            style={style}
            onSubmit={handleSubmit}>
            {title ? (<h3 className={`mb-3 ${className.title || ""}`}>{title}</h3>) : null}
            {inputs.map((item, index) => (
                <div key={index}>
                    {item.tag === 'input' ? (
                        <input type={item.type} id={item.id} name={item.name} placeholder={item.placeholder} required={item.required} className={`form-control mb-2 ${className.input || ""}`} />
                    ) : item.tag === 'textarea' ? (
                        <textarea name={item.name} id={item.id} placeholder={item.placeholder} required={item.required} className={`form-control mb-2 ${className.textarea || ""}}`} mb-2 style={{ height: "100px" }} ></textarea>
                    ) : null}
                </div>
            ))}
            <button type="submit" className={`form-control btn btn-primary ${className.button || ""}`} >{buttonState}</button>

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