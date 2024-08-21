import React from 'react';

// ModalMSG 컴포넌트: 짧은 메시지가 있는 모달 창을 렌더링하는 컴포넌트
const ModalMSG = ({ show, onClose, title, children }) => {
    // 모달이 보이지 않아야 할 때(null 반환)
    title='Error';
    if (!show) return null;

    return (
        // 모달의 배경과 위치를 설정하는 컨테이너
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-sans">
            {/* 모달의 콘텐츠를 담는 컨테이너 */}
            <div className="bg-white rounded-lg shadow-lg w-1/3 p-4 relative max-h-fit">
                {/* 모달 닫기 버튼 */}
                <button 
                    onClick={onClose}  // 버튼 클릭 시 onClose 함수를 호출하여 모달을 닫음
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >   
                    {/* X 문자로 표시되는 닫기 아이콘 */}
                    &times;  
                </button>
                {/* 모달의 제목이 있을 경우 렌더링 */}
                {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
                {/* 모달의 자식 요소들을 표시하는 영역 */}
                <div className="max-h-[calc(80vh-4rem)] font-normal text-base">
                    {children}  {/* 모달의 본문 내용 */}
                </div>
            </div>
        </div>
    );
};

export default ModalMSG;
