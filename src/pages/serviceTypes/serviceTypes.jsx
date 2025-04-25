import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import Card from "../../components/Card"
import Error from "../../components/LoadAndErr/Error";
import Loader from "../../components/LoadAndErr/Loader";


import img from "../../../public/img/bgAbout.webp";

const ServiceTypes = () => {
  const { id } = useParams();
  const [globalError, setGlobalError] = useState(false);

  const [services, setServices] = useState(null);
  const [serviceType, setServiceType] = useState(null);
  const { trigger: getTypeData, error: errorType, isMutating: awaitType } = useFetchData(`https://back-production-3d53.up.railway.app/api/findObjectsTypes`);
  const { trigger: getObjectData, error: errorObject, isMutating: awaitObject  } = useFetchData(`https://back-production-3d53.up.railway.app/api/findObjects`);

  useEffect(() => {

    const fetchData = async () => {
      try {
        //query del tipo de servicio
        const bodyType = [{ "$match": { "_id": { "$eq": id } } }, { "$project": { "name": 1, "description": 1 } }]
        const dataType = await getTypeData({
          method: 'POST',
          body: bodyType
        });
        if (!dataType.items[0]) { 
          setGlobalError(true);
          throw new Error("Service Type not Found"); 
        }
        setServiceType(dataType.items[0]);

        //query de los servicios de este tipo
        const body = [
          {
            "$match": {
              "type": id
            }
          },
          {
            "$project": {
              "name": 1,
              "description": 1,
              "image": 1,
              "info": {
                "Duración del servicio": "$props.duration",
                "Áreas a trata": "$props.target_areas",
                "Productos usados": "$props.products_used",
                "Tecnologías usadas": "$props.technology_used",
                "Sesiones requeridas": "$props.sessions_required",
                "Es terapéutico": {
                  "$cond": {
                    "if": {
                      "$ifNull": [
                        "$props.is_therapeutic",
                        null
                      ]
                    },
                    "then": {
                      "$cond": {
                        "if": "$props.is_therapeutic",
                        "then": "Sí",
                        "else": "No"
                      }
                    },
                    "else": "$$REMOVE"
                  }
                },
                "Requiere reservación": {
                  "$cond": {
                    "if": {
                      "$ifNull": [
                        "$props.is_therapeutic",
                        null
                      ]
                    },
                    "then": {
                      "$cond": {
                        "if": "$props.is_therapeutic",
                        "then": "Sí Requiere",
                        "else": "No Requiere"
                      }
                    },
                    "else": "$$REMOVE"
                  }
                },
                "Precio": "$props.price"
              }
            }
          }
        ]
        const data = await getObjectData({
          method: 'POST',
          body: body
        });
        if (!data.items.length > 0) { 
          setGlobalError(true);
          throw new Error("Services not Found"); 
        }
        setServices(data.items);

      } catch (err) {
        console.error('Error al hacer la request:', err.message);
      }
    };

    fetchData();
  }, [id]);

  const className = {}
  const button = { name: "Reservar un turno", path: "serviceTypes" }

  return (
    <>
      {(awaitType || awaitObject) && (<Loader context={{ image: img }} />)}
      {(serviceType && services) && (
        <div className="bg-light" id="services"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            scrollMarginTop: '70px',
          }}>
          <div className="container min-vh-100 d-flex flex-column align-items-center justify-content-center text-white">

            <>
              <div className="row text-center mb-4">
                <h1 style={{ fontFamily: 'Lato, sans-serif', fontSize: '3.5rem', fontWeight: "1000" }} className="mt-3">{serviceType && serviceType.name}</h1>
                <p className="fs-5 fw-bolder my-2">{serviceType && serviceType.description}</p>
              </div>
              <div className="row">
                {services && services.map((item, index) => (
                  <div key={index} className="col-12 col-md-6 col-xl-4 d-flex justify-content-center align-items-center mb-4">
                    <Card context={{ item, className, button }} />
                  </div>
                ))}
              </div>
            </>

          </div>
        </div>
      )}
      {(errorType || errorObject || globalError ) && (<Error backgroundImage={img} />)}
    </>
  );
};
export default ServiceTypes;