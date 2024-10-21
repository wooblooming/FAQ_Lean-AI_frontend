import React from 'react';

const ConfirmDeleteAccountModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">확인</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="text-red-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-red-400"
            onClick={() => onClose(true)}
          >
            탈퇴하기
          </button>
          <button
            className="text-gray-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-gray-400"
            onClick={() => onClose(false)}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteAccountModal;
