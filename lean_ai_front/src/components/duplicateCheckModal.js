import React, { useState, useEffect } from 'react';
import ModalMSG from './modalMSG';

const IdDuplicateCheckModal = ({ show, onClose, username, setIdDuplicateChecked }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 아이디 중복 체크 함수
    const handleIdCheck = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/check-username/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });
            const data = await response.json();

            if (data.is_duplicate) {
                setMessage('이미 사용 중인 아이디입니다.');
                setIdDuplicateChecked(false);  // 중복 확인 실패
            } else {
                setMessage('사용 가능한 아이디입니다.');
                setIdDuplicateChecked(true);  // 중복 확인 성공
            }
        } catch (error) {
            setMessage('아이디 중복 검사 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 모달이 열릴 때 중복 검사 실행
    useEffect(() => {
        if (show) {
            handleIdCheck();
        }
    }, [show]);

    return (
        <ModalMSG show={show} onClose={onClose} title="ID 중복 확인">
            {loading ? (
                <p>확인 중...</p>
            ) : (
                <p>{message}</p>
            )}
            <div className="flex justify-center mt-4 overflow-hidden">
                <button
                    onClick={onClose}
                    className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                    확인
                </button>
            </div>
        </ModalMSG>
    );
};

export default IdDuplicateCheckModal;
