import React, { useState } from 'react';
import ModalMSG from './modalMSG';

const IdDuplicateCheckModal = ({ show, onClose, username }) => {
    const [message, setMessage] = useState('');

    // 아이디 중복 체크 함수
    const handleIdCheck = async () => {
        try {
            const response = await fetch(`/api/check-username?username=${username}`);
            const result = await response.json();

            if (result.exists) {
                setMessage('아이디를 사용할 수 없습니다.');
            } else {
                setMessage('아이디를 사용할 수 있습니다.');
            }
        } catch (error) {
            setMessage('아이디 중복 검사 중 오류가 발생했습니다.');
        }
    };

    // 모달이 열릴 때 중복 검사 실행
    if (show && !message) {
        handleIdCheck();
    }

    return (
        <ModalMSG show={show} onClose={onClose} title=" ">
            <p>{message}</p>
            <div className="flex justify-center mt-4 overflow-hidden">
                <button onClick={onClose} className="text-white bg-indigo-300 rounded-md px-4 py-2 border-l border-indigo-200 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-purple-400">
                    확인
                </button>
            </div>
        </ModalMSG>
    );
};

export default IdDuplicateCheckModal;
