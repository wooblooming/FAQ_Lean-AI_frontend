import React from 'react';

const ConfirmModal = ({ show, onClose, message }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">확인</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => onClose(true)}  // 탈퇴 확정 시
          >
            탈퇴하기
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => onClose(false)}  // 탈퇴 취소 시
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
