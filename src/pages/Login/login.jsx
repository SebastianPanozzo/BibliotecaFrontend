import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "../../components/Form";
import useStore from "../../hooks/useStore";

import useFetchData from "../../hooks/useFetchData";

function Login() {
  const navigateTo = useNavigate();
  const [data, setData] = useState();
  const [buttonState, setButtonState] = useState("Enviar");
  const [acces, setAcces] = useState();

  const { trigger, error } = useFetchData("/loginUser");
  const { save, get } = useStore();

  useEffect(() => {
    if (data) {
      setButtonState("Ingresando")

      const fetch = async () => {
        try {
          const res = await trigger({ method: "POST", body: data });
          if (res) {
            const currentUser = res.ok.data;
            save({ currentUser }); 
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            setButtonState("Enviar");
            setAcces("Login exitoso");
            setTimeout(() => { navigateTo('/') }, 2000);
          }
        } catch (error) {
          setButtonState("Enviar Nuevamente")
          console.log("Error de login", error);
        }
      }
      fetch()
    }
  }, [data, trigger, save, navigateTo]);

  const context = {
    title: "Login",
    style: {},
    className: { form: "col-12 text-success", button: "btn-success", title: "fw-bold" },
    setData,
    buttonState,
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
    <div className="bg-home-img pt-0">
      <div className="container">
        <div className="row min-vh-100 d-flex justify-content-center align-items-center">
          <div className="col-11 col-md-8 col-lg-5 col-xxl-4">
            <Form context={context} />
            {error &&
              <div className="alert alert-danger mt-2 mb-0 text-center">
                {error.message || "Hubo un error al enviar el formulario."}
              </div>
            }
            {acces &&
              <div className="alert alert-success mt-2 mb-0 text-center">
                <h5>{`${acces}`}</h5>
                <p>Redirigiendo a la pagina principal...</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;