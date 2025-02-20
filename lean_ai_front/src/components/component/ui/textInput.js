import React from 'react';

// TextInput Component
const TextInput = ({ id, name, label, placeholder, value, onChange, isTextarea = false, style }) => {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
            {isTextarea ? (
                <textarea
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    style={style}
                />
            ) : (
                <input
                    id={id}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    style={style}
                />
            )}
        </div>
    );
};

export default TextInput;