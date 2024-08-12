//modal.jsx
import React from 'react';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center ">
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-4 relative max-h-[80vh] overflow-auto overflow-hidden">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>
                {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
                <div className="overflow-auto max-h-[calc(80vh-4rem)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
