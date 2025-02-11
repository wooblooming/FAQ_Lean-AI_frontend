import React, { useState, useEffect } from 'react';
import ModalMSG from './modalMSG';
import ModalErrorMSG from './modalErrorMSG';

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const IdCheckModal = ({ show, onClose, username, onIdCheckComplete, isPublic }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    // API 경로 설정 함수
    const APIUrl = () => {
        const url = isPublic ? `${API_DOMAIN}/api/check-username/` : `${API_DOMAIN}/public/check-username/`
        return url;
    };
    
    const handleIdCheck = async () => {
        setLoading(true);
        try {
            const response = await fetch(APIUrl(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });

            const result = await response.json();

            if (response.status === 409) {
                onIdCheckComplete(false);
                setErrorMessage(result.message || '이미 사용 중인 사용자 아이디입니다.');
                setShowErrorModal(true);
            } else if (response.status === 400) {
                onIdCheckComplete(false);
                let errorMessage = '아이디 조건에 맞지 않습니다.';
                if (result.username && Array.isArray(result.username)) {
                    errorMessage = result.username.join(', ');
                }
                setErrorMessage(errorMessage);
                setShowErrorModal(true);
            } else if (response.status === 200) {
                onIdCheckComplete(true);
                setMessage(result.message);
            } else {
                onIdCheckComplete(false);
                setErrorMessage('아이디 중복 검사 중 알 수 없는 오류가 발생했습니다.');
                setShowErrorModal(true);
            }
        } catch (error) {
            console.log('Error:', error);
            setErrorMessage('아이디 중복 검사 중 오류가 발생했습니다.');
            setShowErrorModal(true);
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
        <div>
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
        </div>
    );
};

export default IdCheckModal;
