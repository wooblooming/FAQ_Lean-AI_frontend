import React from 'react';
import { X } from 'lucide-react';

const ModalErrorMSG = ({ show, onClose, title = 'ERROR', children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center" style={{ zIndex: 1000 }}>
            <div 
                className="relative bg-white rounded-lg shadow-lg w-10/12 p-4" 
                style={{ maxWidth: '470px', zIndex: 1001 }}
            >
                <div className="" style={{ zIndex: 1002 }}>
                    <X 
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-indigo-500 rounded-full text-white p-1 cursor-pointer transition-colors"
                        aria-label="Close"
                    />
                </div>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="text-base text-center">
                    {children}
                </div>
                <div className="flex justify-center mt-4">
                    <button 
                        onClick={onClose} 
                        className="text-white bg-indigo-500 rounded-md px-4 py-2 transition-colors" 
                        style={{ zIndex: 1002 }}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ModalErrorMSG;