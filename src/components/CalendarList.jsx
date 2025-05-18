import { useState } from 'react';
import { Calendar, Badge, List } from 'rsuite';


function getTodoList(date) {
    if (!date) {
        return [];
    }
    const day = date.getDate();

    switch (day) {
        case 10:
            return [
                { time: '10:30 am', title: 'Meeting' },
                { time: '12:00 pm', title: 'Lunch' }
            ];
        case 15:
            return [
                { time: '09:30 pm', title: 'Products Introduction Meeting' },
                { time: '12:30 pm', title: 'Client entertaining' },
                { time: '02:00 pm', title: 'Product design discussion' },
                { time: '05:00 pm', title: 'Product test and acceptance' },
                { time: '06:30 pm', title: 'Reporting' },
                { time: '06:30 pm', title: 'Reporting' },
                { time: '06:30 pm', title: 'Reporting' }
            ];
        default:
            return [];
    }
}

function cellClassName(date){
    const list = getTodoList(date);

    if (list.length) {
        return "bg-success rounded fw-bold"
    }

    return "";
}


const TodoList = ({ date }) => {
    const list = getTodoList(date);

    return (

        <List style={{ flex: 1, maxHeight: "350px" }} className='card-custom rounded border mt-2 mt-md-0 p-3 text-white'>
            {!list.length && (
                <div className='d-flex justify-content-center align-items-center h-100 w-100 border border-1 rounded'>
                    <p className='fw-bolder fs-5'>No tines turnos para hoy</p>
                </div>
            )}
            {list.map(item => (
                <List.Item key={item.time} index={item.time} className='text-black rounded p-2 mb-2'>
                    <div>{item.time}</div>
                    <div>{item.title}</div>
                </List.Item>
            ))}
        </List>

    );
};

const CalendarList = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleSelect = date => {
        setSelectedDate(date);
        console.log({ dateIso: date.toISOString() });
        console.log({ dateUTC: date.toUTCString() });
        console.log({ dateLocal: date.toLocaleString() });

    };

    return (
        <div className='row col-12 p-0 m-0'>
            <Calendar
                className='card rounded border fw-semibold col-12 col-md-4 me-md-2'
                compact
                bordered
                cellClassName={cellClassName}
                onSelect={handleSelect}
                onChange={(date)=> console.log({onChange: date.toISOString()})}
                style={{ height: '350px' }}
            />
            <TodoList
                className='col-12 col-md-8'
                date={selectedDate}
            />
        </div>
    );
};

export default CalendarList;