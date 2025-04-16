import Form from "../../../components/form"

const context = {
    title: "Contacto",
    service: "https://nubiant.com/api/service/live/test_joa",
    style: "col-4",
    inputs: [
        {
            tag: "input",
            type:"text",
            id: "name",
            name: "name",
            placeholder: "Nombre"
        },
        {
            tag: "input",
            type:"password",
            id: "password",
            name: "password",
            placeholder: "Contraseña"
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
        <div className="row min-vh-100 py-4">
            <div className="col-12 d-flex align-items-center justify-content-center">
               <Form context={context} /> 
            </div>
        </div>
    )
}

export default Contacts;