// FileInput Component
import React from 'react';

const FileInput = ({ id, name, label, onChange }) => {
    const handleFileChange = (e) => {
        onChange(e.target.files[0]);
    };

    return (
        <div className="space-y-1">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</label>
            <input
                id={id}
                name={name}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 hover:file:bg-indigo-100 cursor-pointer
                           file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                           file:text-sm file:font-semibold file:bg-indigo-50 file:text-gray-700"
            />
        </div>
    );
};

export default FileInput;
