import React from 'react';
import { X } from 'lucide-react';

const LogoutModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center relative" style={{ width: '350px' }}>
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 z-20 "
          aria-label="Close"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1"/>
        </button>
        <h2 className="text-2xl text-left font-bold mb-4" style={{ fontFamily: 'NanumSquareExtraBold' }}>Logout</h2>
        <p className="mb-4 text-center">로그아웃하시겠습니까?</p>
        <div className="flex space-x-4 mt-2 items-center justify-center">
          <button
            className="text-red-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-red-400"
            onClick={onConfirm}
          >
            로그아웃
          </button>
          <button
            className="text-gray-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-gray-400"
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
