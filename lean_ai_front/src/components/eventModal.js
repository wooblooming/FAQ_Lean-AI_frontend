import React from 'react';

const EventAlertModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        <button
          onClick={() => onClose(false)}  // "아니오"를 누르면 false 전달
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <img src="/event.png" alt="알림 이미지" className="w-16 h-16" />
          </div>
          <h2 className="text-xl font-bold mb-4">알림 설정 안내</h2>
          <p className="text-sm text-gray-600 mb-6">
            이벤트 및 프로모션 알림을 받으시겠습니까? 언제든지 설정에서 알림을 변경하실 수 있습니다.
          </p>
          <div className="flex justify-between w-full">
            <button className="px-4 py-2 text-red-500 rounded" onClick={() => onClose(false)}>
              아니오
            </button>
            <button className="px-4 py-2 text-blue-500 rounded" onClick={() => onClose(true)}>
              예
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAlertModal;

