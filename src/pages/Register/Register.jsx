import Form from "../../components/form";
import { useState } from "react";
import register from "../../utiles/register";
import bgDark from '../../../public/img/bgDark.webp'


function Register() {
  const [data, setData] = useState();
  if (data) { console.log("Log in Register", data); }

  const context = {
    title: "Registro",
    service: register,
    style: {},
    className: { form: "col-12 text-success", button: "btn-success", title: "fw-bold" },
    setData: setData,
    inputs: [
      {
        tag: "input",
        type: "text",
        id: "name",
        name: "name",
        placeholder: "Nombre",
        required: true
      },
      {
        tag: "input",
        type: "text",
        id: "last_name",
        name: "last_name",
        placeholder: "Apellido",
        required: true
      },
      {
        tag: "input",
        type: "email",
        id: "email",
        name: "email",
        placeholder: "Correo electronico",
        required: true
      },
      {
        tag: "input",
        type: "password",
        id: "password1",
        name: "password1",
        placeholder: "Ingrese una contraseña",
        required: true
      },
      {
        tag: "input",
        type: "password",
        id: "password2",
        name: "password2",
        placeholder: "Repita la contraseña",
        required: true
      }
    ]
  }


  return (
    <div className=""
      style={{
        backgroundImage: `url(${bgDark})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}>
      <div className=" container">
        <div className="row min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-11 col-md-8 col-lg-5 col-xxl-4">
            <Form context={context} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;