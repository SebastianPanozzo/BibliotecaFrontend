const fetchData = async (url, body) => {
    const api_key = import.meta.env.VITE_API_KEY;
    let res = await fetch(url, { method: 'POST', headers: { 'api-key': api_key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    let response = await res.json();
    return response.item;
}

function sumarHoraArgentinaEnUTC(fechaUTCString, horaArgentina) {
    const fechaUTC = new Date(fechaUTCString);
    const [horasArgentina, minutosArgentina] = horaArgentina.split(':').map(Number);
    const horasUTC = horasArgentina + 3;
    fechaUTC.setUTCHours(fechaUTC.getUTCHours() + horasUTC);
    fechaUTC.setUTCMinutes(fechaUTC.getUTCMinutes() + minutosArgentina);
    return fechaUTC.toISOString();
}

const generateAppointment = async (context) => {

    const idService = context.moreData?.service?._id;
    const idSpa = context.moreData?.idSpa
    const idUser = context.moreData?.storage?.currentUser?._id;
    const hour = context.time;
    const date = context.moreData?.date;
    const custom_requests = context.custom_requests ?? "";

    if (!idService || !idSpa || !idUser || !hour || !date ) {
        return { err: "Error: Datos insuficientes para generar cita." }
    }

    try {
        const time = sumarHoraArgentinaEnUTC(date, hour);
        const appointment = await fetchData("https://back-production-3d53.up.railway.app/api/createEvent",
            {
                "type": "spa_appointment",
                "name": "Turno spa",
                "props": {
                    "service_unit": idSpa,
                    "custom_requests": custom_requests
                },
                "duration.start": time
            }
        );

        const has_appointment = await fetchData("https://back-production-3d53.up.railway.app/api/createRelation",
            {
                "type": "has_appointment",
                "props": {
                  "user": idUser,
                  "appointment": appointment._id
                }
              }
        );

        const assigned_service = await fetchData("https://back-production-3d53.up.railway.app/api/createRelation",
            {
                "type": "assigned_service",
                "props": {
                  "service": idService,
                  "appointment": appointment._id
                }
              }
        );

        return {ok: {message: "Turno generado con éxito", data: {appointment, has_appointment, assigned_service}}}

    } catch (err) {
        return { err: err.message }
    }
}
export default generateAppointment;

