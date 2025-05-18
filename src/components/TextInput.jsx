
import React from 'react';


const TextInput = ({ label, value, onChange, placeholder = "" }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="create-event-input"
      />
    </div>
  );
};

export default TextInput;
