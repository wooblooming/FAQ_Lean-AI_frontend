// components/verificationModal.js
import React from 'react';

const VerificationModal = ({ isOpen, onClose, onSubmit, verificationCode, onChange, errorMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-4">인증번호 확인</h2>
                <input
                    type="text"
                    name="verificationCode"
                    value={verificationCode}
                    onChange={onChange}
                    placeholder="인증번호 입력"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                />
                {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
                <div className="flex justify-end">
                    <button
                        onClick={onSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                    >
                        확인
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-black px-4 py-2 rounded"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
