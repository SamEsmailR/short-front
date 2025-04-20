// src/components/ui/Input.jsx
import React from 'react';

const Input = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder = '', 
  value, 
  onChange, 
  error, 
  required = false 
}) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={name} className="form-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default Input;