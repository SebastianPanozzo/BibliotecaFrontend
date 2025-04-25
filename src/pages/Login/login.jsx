import Form from "../../components/form";
import { useState } from "react";

const log = async (o) => {
  console.log("Log out Login", o)
  if(o.password === "1234") return {ok: {message: "Acceso concedido"}}
  return {err: "Acceso denegado, contraseña incorrecta"}
}



function Login() {
  const [data, setData] = useState();
  if(data){console.log("Log in Login", data);}

  const context = {
    title: "Login",
    service: log,
    style: {},
    className: { form: "col-4" },
    setData: setData,
    path: "/",
    inputs: [
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
        id: "password",
        name: "password",
        placeholder: "Contraseña",
        required: true
      }
    ]
  }


  return (
    <div className="py-4">
      <div className="min-vh-100 container d-flex align-items-center justify-content-center">
        <Form context={context} />
      </div>
    </div>
  );
}
export default Login;