import Form from "../../../components/form";

const context = {
    title: "Contacto",
    service: "https://nubiant.com/api/service/live/joa_test",
    style: {},
    className: "col-4",
    messages: {
        success: { show: true, text: "Gracias por contactarte con nosotros." },
        error: { show: true, text: "Error al enviar el formulario."}
    },
    inputs: [
        {
            tag: "input",
            type:"text",
            id: "name",
            name: "name",
            placeholder: "Nombre",
            required: true
        },
        {
            tag: "input",
            type:"password",
            id: "password",
            name: "password",
            placeholder: "Contraseña",
            required: true
        }, {
            tag: "textarea",
            id: "text",
            name: "text",
            placeholder: "Ingrese texto aqui"
        }
    ]
}


function Contacts() {
    return (
        <div className="py-4">
            <div className="min-vh-100 container d-flex align-items-center justify-content-center">
               <Form context={context} /> 
            </div>
        </div>
    )
}

export default Contacts;