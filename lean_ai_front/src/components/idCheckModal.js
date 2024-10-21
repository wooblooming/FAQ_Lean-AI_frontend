import React, { useState, useEffect } from 'react';
import ModalMSG from './modalMSG';
import ModalErrorMSG from './modalErrorMSG';  // 에러 메시지 모달 임포트
import config from '../../config';

const IdCheckModal = ({ show, onClose, username, onIdCheckComplete }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);  // 에러 모달 표시 여부

    const handleIdCheck = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${config.apiDomain}/api/check-username/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });

            const result = await response.json();
            // 디버깅: 서버 응답 확인
            console.log(result);  

            if (response.status === 409) {
                // ID가 이미 존재하는 경우
                onIdCheckComplete(false);
                setErrorMessage(result.message || '이미 사용 중인 사용자 아이디입니다.');
                setShowErrorModal(true);  // 에러 모달 표시
            } else if (response.status === 400) {
                // ID가 정규식 조건에 적합하지 않은 경우
                onIdCheckComplete(false);
                let errorMessage = '아이디 조건에 맞지 않습니다.';
                if (result.username && Array.isArray(result.username)) {
                    errorMessage = result.username.join(', ');  // 배열로 반환된 메시지를 합침
                }
                setErrorMessage(errorMessage);
                setShowErrorModal(true);  // 에러 모달 표시
            } else if (response.status === 200) {
                // ID가 사용 가능한 경우
                onIdCheckComplete(true);
                setMessage(result.message); 
            } else {
                // 기타 알 수 없는 오류
                onIdCheckComplete(false);
                setErrorMessage('아이디 중복 검사 중 알 수 없는 오류가 발생했습니다.');
                setShowErrorModal(true);  // 에러 모달 표시
            }
        } catch (error) {
            console.log('Error:', error);  // 에러 로그 출력
            setErrorMessage('아이디 중복 검사 중 오류가 발생했습니다.');
            setShowErrorModal(true);  // 에러 모달 표시
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (show) {
            handleIdCheck();
        }
    }, [show]);

    return (
        <>
            {show && !showErrorModal && (
                <ModalMSG show={show} onClose={onClose} title="ID 확인">
                    {loading ? (
                        <p>확인 중...</p>
                    ) : (
                        <p className='text-center mt-2'>{message}</p>
                    )}
                </ModalMSG>
            )}
            {showErrorModal && (
                <ModalErrorMSG show={showErrorModal} onClose={() => { setShowErrorModal(false); onClose(); }}>
                    <p>{errorMessage}</p>
                </ModalErrorMSG>
            )}
        </>
    );
};

export default IdCheckModal;
