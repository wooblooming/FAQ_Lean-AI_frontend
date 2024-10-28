import React from 'react';
import { X } from 'lucide-react';

const EventAlertModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center relative font-sans">
        <button
          onClick={() => onClose(false)}  // "아니오"를 누르면 false 전달
          className="absolute top-4 right-4 z-20"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1"/>
        </button>
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{fontFamily:"NanumSquareExtraBold"}}>알림 설정 안내</h2>
          <p className="text-sm text-gray-600 mb-6">
            이벤트 및 프로모션 알림을 받으시겠습니까?<br/> 언제든지 설정에서 알림을 변경하실 수 있습니다.
          </p>
          <div className="flex justify-center space-x-4 w-full">
            <button className="px-4 py-2 text-blue-500 rounded-md hover:ring-2 ring-blue-400" onClick={() => onClose(true)}>
              예
            </button>
            <button className="px-4 py-2 text-gray-500 rounded-md  hover:ring-2 ring-gray-400" onClick={() => onClose(false)}>
              아니오
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAlertModal;

