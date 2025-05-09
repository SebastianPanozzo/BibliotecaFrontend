import Form from "../../components/Form";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import bgDark from '../../../public/img/bgDark.webp'


function Register() {
  const navigateTo = useNavigate();
  const [data, setData] = useState();
  const [acces, setAcces] = useState();
  const [buttonState, setButtonState] = useState("Enviar");
  const { trigger, error } = useFetchData("/registerUser");

  useEffect(() => {
    if (data) {
      setButtonState("Registrando")
      const fetch = async () => {
        try {
          const res = await trigger({method: "POST", body: data});
          if (res) {

            setButtonState("Enviar");
            setAcces("Registro exitoso, redirigiendo al login...");
            setTimeout(() => { navigateTo('/login')}, 2500);
          } 
        } catch {
          setButtonState("Enviar Nuevamente");
        }
      }
      fetch()
    }
  }, [data]);
  

  const context = {
    title: "Registro",
    style: {},
    className: { form: "col-12 text-success", button: "btn-success", title: "fw-bold" },
    setData,
    buttonState,
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
            {error && 
              <div className="alert alert-danger mt-2 mb-0 text-center">
                {error.message || "Hubo un error al enviar el formulario."}
              </div>
            }
            {acces && 
              <div className="alert alert-success mt-2 mb-0 text-center">
                {`${acces}`}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
export default Register;