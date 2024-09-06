import React from 'react';

const ModalText = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-sans">
            <div className="bg-white rounded-lg shadow-lg w-10/12 h-5/6 max-min-screen p-4 relative overflow-scroll"
                 style={{ maxWidth: '390px'}}
            >
                <button 
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >   
                    &times;
                </button>
                {title && <h2 className="text-2xl font-bold mb-4 ">{title}</h2>}
                <div
                    className=" max-h-[calc(80vh-4rem)] font-normal text-base"
                >
                    {children}  {/* 모달의 본문 내용 */}
                </div>
            </div>
        </div>
    );
};

export default ModalText;
