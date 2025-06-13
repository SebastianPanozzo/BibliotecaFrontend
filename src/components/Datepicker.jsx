import { DatePicker, InputGroup } from 'rsuite';

export default function DatePickerComponent ({context}) {
    const {fromDate, setFromDate, toDate, setToDate} = context;
    return (
        <InputGroup style={{ width: 300 }}>
            <DatePicker  format="yyyy-MM-dd" block cleanable={false} style={{ width: 150 }} value={fromDate} onChange={setFromDate}/>
            <InputGroup.Addon>to</InputGroup.Addon>
            <DatePicker format="yyyy-MM-dd" block cleanable={false} style={{ width: 150 }} value={toDate} onChange={setToDate}/>
        </InputGroup>
    )
};