import { useState, useEffect } from "react"
import Calendar from "../../../components/Calendar"

export default function AppointmentManagement() {
    const [date, setDate] = useState();
    const [month, setMonth] = useState();
    //console.log({ data: date, month: month });

    //Effect to Date
    useEffect(() => {
        console.log("cambió el día")
    },[date])
    
    //Effect to Month
    useEffect(() => {
        console.log("cambió el mes")
    },[month])

    return (
        <div className="row m-0 col-12 text-center bg-danger ">
            <div className="col-lg-6 mb-2">
                <div className="card">
                    <Calendar context={{ events: [], setMonth, setDate }} />
                </div>
            </div>
            <div className="col-lg-6 mb-2">
                <div className="card ">
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptate consequatur dolores magnam deserunt a tenetur harum at ipsa vel quisquam minus voluptatibus dicta quidem laboriosam ea, saepe illum nam praesentium!</p>
                </div>
            </div>
        </div>
    )
}