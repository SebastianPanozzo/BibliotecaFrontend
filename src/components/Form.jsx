import { useState } from "react";

function Form({ context }) {
    const { title, inputs, style, className, setData, buttonState} = context;
    
    const [inputValues, setInputValues] = useState(() => {
        const initialValues = {};
        inputs.forEach(input => {
            initialValues[input.name] = input.value || '';
        });
        return initialValues;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputValues(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setData({...inputValues});
    }

    return (
        <form className={`d-flex flex-column bg-white text-center border border-2 rounded-2 p-3 ${className.form || ""}`}
            style={style}
            onSubmit={handleSubmit}>
            {title ? (<h3 className={`mb-3 ${className.title || ""}`}>{title}</h3>) : null}
            {inputs.map((item, index) => (
                <div key={index} className="mb-3 d-flex flex-column align-items-start">
                    {/* Mostrar título del campo si existe */}
                    {item.title && (
                        <label htmlFor={item.id} className={`form-label ${className.label || ""}`}>
                            {item.title}
                        </label>
                    )}
                    {item.tag === 'input' ? (
                        <input 
                            type={item.type} 
                            id={item.id} 
                            name={item.name} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            value={inputValues[item.name] || ''}
                            onChange={!item.readOnly ? handleInputChange : undefined}
                            readOnly={item.readOnly || false}
                            className={`form-control ${className.input || ""}`} 
                        />
                    ) : item.tag === 'textarea' ? (
                        <textarea 
                            name={item.name} 
                            id={item.id} 
                            placeholder={item.placeholder} 
                            required={item.required} 
                            value={inputValues[item.name] || ''}
                            onChange={!item.readOnly ? handleInputChange : undefined}
                            readOnly={item.readOnly || false}
                            className={`form-control ${className.textarea || ""}`} 
                            style={{ height: "100px" }} 
                        ></textarea>
                    ) : null}
                </div>
            ))}
            <button type="submit" className={`form-control btn btn-primary ${className.button || ""}`}>{buttonState}</button>
        </form>
    );
}

export default Form;