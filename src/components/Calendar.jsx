import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarComponent({context}) {
    const { date, setDate } = context;

    const onChange = (newDate) => {
        setDate(newDate);
    };
    return (
        <div className="">
            <div className="text-center mb-2">
                <h5>Fecha seleccionada: {date.toLocaleDateString()}</h5>
            </div>
            <Calendar
                onChange={onChange}
                value={date}
                minDate={new Date()}
            />
        </div>
    );
}

export default CalendarComponent;