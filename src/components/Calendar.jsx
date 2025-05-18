import { Calendar } from 'rsuite';
import { useState } from 'react';

const cellClassName = (date, events) => {
    const day = date.getDate();
    let found = false;
    events.forEach(item => {
        if(item.duration?.start){
            const itemdate = new Date(item.duration.start).getDate();
            if (itemdate === day) found = true;
        }
    })

    if(found){
        return "bg-success rounded-circle fw-bold "
    }

    return "";
}

const CalendarComponent = ({context}) => {
    const[localMonth, setLocalMonth] = useState(new Date());
    const {events, setMonth, setDate} = context;

    const handelSetMonth = (date) => {
        if(date.getMonth() !== localMonth.getMonth()){
            setLocalMonth(date);
            setMonth(date);
        }
    };

    return (
        <Calendar
            compact
            bordered
            cellClassName={(date) => cellClassName(date, events)}
            onSelect={(date) => setDate(date)}
            onChange={handelSetMonth}
            style={{ height: '350px' }}
        />
    );
};

export default CalendarComponent;