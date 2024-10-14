import React from 'react';

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative" style={{ width: '350px' }}>
        <button
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-60"
          aria-label="Close"
        >
          &times;
        </button>
        <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
        <div className="flex space-x-4 mt-2 items-center justify-center">
          <button
            className="bg-red-300 text-white px-4 py-2 rounded focus hover:bg-red-500"
            onClick={onConfirm}
          >
            로그아웃
          </button>
          <button
            className="bg-gray-300 text-white px-4 py-2 rounded focus hover:bg-gray-500"
            onClick={onCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
