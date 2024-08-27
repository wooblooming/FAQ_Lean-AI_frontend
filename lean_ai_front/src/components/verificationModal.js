// components/verificationModal.js
import React from 'react';

const VerificationModal = ({ isOpen, onClose, onSubmit, verificationCode, onChange, errorMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-10/12">
                <h2 className="text-2xl font-bold mb-4">인증번호 확인</h2>
                <input
                    type="text"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={onChange}
                    placeholder="인증번호 입력"
                    className="w-full p-2 border border-gray-300 rounded mb-4 font-normal text-base"
                />
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <div className="flex justify-center">
                    <button
                        onClick={onSubmit}
                        className=" text-blue-500 px-4 py-2 rounded mr-2"
                    >
                        확인
                    </button>
                    <button
                        onClick={onClose}
                        className=" text-red-500 px-4 py-2 rounded"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
