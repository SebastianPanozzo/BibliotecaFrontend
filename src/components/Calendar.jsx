import { Calendar } from 'rsuite';
import { useState } from 'react';

const cellClassName = (date, dates, style) => {
    const day = date.toISOString().split('T')[0];  
    if(dates.includes(day)){
        return `${style ?? "bg-primary bg-opacity-25 fw-bold"}`
    } else {
        return "";
    }
}

const CalendarComponent = ({ context }) => {
    const [localMonth, setLocalMonth] = useState(new Date());
    const { events, setMonth, date, setDate, style } = context;
    
    let dates = [];
    if(Array.isArray(events) && events.length > 0){
        dates = events.map((d) => {return d.split('T')[0]})
    }

    const handelSetMonth = (date) => {
        if (setMonth !== null) {
            if (date.getMonth() !== localMonth.getMonth()) {
                setLocalMonth(date);
                setMonth(date);
            }
        }
    };

    const handelSetDate = (date) => {
        if(setDate !== null){
            setDate(date)
        }
    }

    return (
        <Calendar
            compact
            bordered
            cellClassName={(d) => cellClassName(d, dates, style)}
            value={date}
            onSelect={handelSetDate}
            onChange={handelSetMonth}
            style={{ height: '350px' }}
        />
    );
};

export default CalendarComponent;