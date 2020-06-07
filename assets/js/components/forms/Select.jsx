import React from 'react';
const Select = (
    {
    name,
    value,
    error="",
    label,
    onChange
    ,children}) => 
    (
        <div className="form-group">
          <label htmlFor={name}>{label}</label>
            <select onChange={onChange}  value={value} name={name}  className={ "form-control " + (error && "is-invalid")}>
                {children} 
            </select>
            <p className="invalid-feedback">{error}</p>
        </div>
     );
 
export default Select;