import React, { useState } from 'react';
import ModalText from '../modal/modalText';
import ModalErrorMSG from '../modal/modalErrorMSG'; // 에러메시지 모달 컴포넌트

const personalInfoModal = ({ show, onClose, onAgree }) => {
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

    const termsOfPersonalInfo = `
- 수집 및 이용 항목 : 성명, 생년월일, 전화번호, 휴대전화번호, 이메일 주소, 민원 내용
- 수집 및 이용 목적 : 본인 의사 확인, 고객 불만 접수 등의 민원 처리, 결과 회신, 사후 조치
    * 고객 불만 접수 처리 이외의 다른 목적으로 사용되지 않습니다.
- 수집 및 이용 기간 : 회신 완료 일로부터 3년 위의 수집 및 이용에 거부할 수 있으며, 
   이에 대한 동의가 없을 경우 상담을 진행 할 수 없음을 알려드립니다.
`;

    // 동의 여부에 따른 함수
    function handleAgree(isAgreed) {
        if (isAgreed) {
            onAgree(isAgreed); // 동의 여부를 상위 컴포넌트에 전달
            onClose(); // 모달 닫기
        } else {
            setErrorMessage("필수 약관에 동의해주셔야 \n 서비스 이용이 가능합니다.");
            setShowErrorMessageModal(true);
        }
    };

    // 에러 메시지 모달 닫기
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage(''); // 에러 메시지 초기화
    };

    return (
        <div>
            <ModalText show={show} onClose={onClose} title="개인정보 수집/이용 동의">
                <div className="h-60 overflow-y-auto border rounded-md p-2 whitespace-pre-wrap font-normal mb-4">
                    <p>{termsOfPersonalInfo}</p>
                </div>

                <div className="flex space-x-2 justify-center my-4">
                    <button
                        onClick={() => handleAgree(true)}
                        className="text-blue-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-blue-400"
                    >
                        동의합니다
                    </button>
                    <button
                        onClick={() => handleAgree(false)}
                        className="text-gray-500 px-4 py-2 font-semibold rounded-md hover:ring-2 ring-gray-400"
                    >
                        동의하지 않습니다
                    </button>
                </div>
            </ModalText>

            {/* 에러 메시지 모달 */}
            <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                <p style={{ whiteSpace: 'pre-line' }}>
                    {typeof errorMessage === 'object' ? (
                        Object.entries(errorMessage).map(([key, value]) => (
                            <span key={key}>
                                {key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br />
                            </span>
                        ))
                    ) : (
                        errorMessage
                    )}
                </p>
            </ModalErrorMSG>
        </div>
    );
};
export default personalInfoModal;
