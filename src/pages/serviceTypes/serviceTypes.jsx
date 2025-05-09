import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetchData from "../../hooks/useFetchData";
import CardLarge from "../../components/CardLarge";
import Error from "../../components/LoadAndErr/Error";
import Loader from "../../components/LoadAndErr/Loader";

import img from "../../../public/img/bgAbout.webp";

const queryTypeServices = (objectType) => {
  const query = [
    {
      "$match": {
        "_id": objectType
      }
    },
    {
      "$lookup": {
        "from": "objects",
        "localField": "_id",
        "foreignField": "type",
        "pipeline": [
          {
            "$project": {
              "name": true,
              "description": true,
              "image": true,
              "props": true
            }
          }
        ],
        "as": "services"
      }
    },
    {
      "$project": {
        "name": true,
        "description": true,
        "services": true
      }
    }
  ]
  return query;
}

const queryServices = () => {
  const query = [
    {
      "$lookup": {
        "from": "objecttypes",
        "localField": "type",
        "foreignField": "_id",
        "as": "object_type"
      }
    },
    {
      "$unwind": "$object_type"
    },
    {
      "$match": {
        "object_type.parent": "service"
      }
    },
    {
      "$project": {
        "name": true,
        "description": true,
        "image": true,
        "props": true
      }
    }
  ]
  return query;
}

const ServiceTypes = () => {
  const { id } = useParams();
  const [serviceType, setServiceType] = useState(null);
  const [services, setServices] = useState(null);

  const { trigger, error, isMutating } = useFetchData(`${id ? '/api/findObjectsTypes' : '/api/findObjects'}`);

  useEffect(() => {

    const fetchData = async () => {
      try {
        const res = await trigger({
          method: 'POST',
          body: id ? queryTypeServices(id) : queryServices()
        });

        const serviceObjectType = id ? res.items[0] : { name: "Servicios", description: "Todos nuestros servicios disponibles" };
        setServiceType(serviceObjectType);
        const services = id ? res.items[0]?.services : res.items;
        setServices(services);
      } catch (err) {
        console.error('Error al hacer la request:', err.message);
      }
    };

    fetchData();
  }, [id, trigger]);

  return (
    <>
      {isMutating && <Loader context={{ image: img }} />}
      {services && (
        <div className="bg-light pt-5 px-3" id="services"
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            scrollMarginTop: '100px',
          }}>
          <div className="container mt-5 min-vh-100 d-flex flex-column align-items-center justify-content-center text-white">
            <div className="row">
              <div className="card mb-3 shadow-sm border-0 p-4">
                <h2 className="text-success fw-bold mb-2">{`Tipos de ${serviceType.name}`}</h2>
                <p className="text-muted mb-0">{serviceType.description}</p>
              </div>
              {services.map((service) => (
                <CardLarge key={service._id} context={service} />
              ))}
            </div>
          </div>
        </div>
      )}
      {(error || !services && !isMutating) && <Error backgroundImage={img} />}
    </>
  );
};

export default ServiceTypes;