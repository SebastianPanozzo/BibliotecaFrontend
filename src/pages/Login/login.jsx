import Form from "../../components/form";
import { useState, useEffect } from "react";
import login from "../../utiles/login";
import useStore from "../../hooks/useStore";

function Login() {
  const [data, setData] = useState();
  const { save } = useStore();

  useEffect(() => {
    if (data) {
      console.log("Log in Login", data);
      localStorage.setItem('currentUser', JSON.stringify(data));
      save({ currentUser: data });
    }
  }, [data]);

  const context = {
    title: "Login",
    service: login,
    style: {},
    className: { form: "col-12 text-success", button: "btn-success", title: "fw-bold" },
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
    <div className=""
      style={{
        backgroundImage: `url('./public/img/bgDark.webp')`,
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
export default Login;