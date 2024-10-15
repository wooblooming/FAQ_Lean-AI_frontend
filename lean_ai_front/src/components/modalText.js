import React from 'react';

const ModalText = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-sans">
      <div
        className="bg-white rounded-lg shadow-lg w-10/12 md:w-1/2 max-h-[80vh] p-4 relative overflow-y-auto"
        style={{ height: 'auto' }} // 높이를 auto로 설정하여 내용에 맞게 자동 조정되도록 설정
      >
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-bold"
        >
          X
        </button>
        {/* 모달의 제목이 있을 경우 렌더링 */}
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        {/* 모달 본문 내용 */}
        <div className="font-normal text-left">{children}</div>
      </div>
    </div>
  );
};

export default ModalText;
