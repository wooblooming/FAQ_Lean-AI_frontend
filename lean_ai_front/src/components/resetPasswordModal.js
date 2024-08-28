import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config';

function ModalResetPassword({ show, onClose, phone }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태

    const router = useRouter();

    // 모달 내 확인 버튼을 클릭했을 때 모달을 닫는 함수
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMessage(''); // 모달 메시지 초기화
    };

    // 에러 메시지 모달 닫기
    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage(''); // 에러 메시지 초기화
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시
            return;
        }

        try {
            const response = await fetch(`${config.localhosts}/api/reset-password/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone,
                    new_password: newPassword,
                }),
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
                setIsModalOpen(true); // 인증 번호 전송 후 모달 열기

                router.push('/login');
            } else {
                setErrorMessage(data.message);
                setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시

            }
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error);
            setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true); // 오류 메시지를 모달에 표시

        }
    };

    return show ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-bold mb-4">비밀번호 재설정</h2>
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="text-white bg-gray-500 rounded-md px-4 py-2 mr-2">취소</button>
                    <button onClick={handleResetPassword} className="text-white bg-blue-500 rounded-md px-4 py-2">비밀번호 재설정</button>
                </div>

                {/* 모달창 */}
                <ModalMSG show={isModalOpen} onClose={handleCloseModal} title=" ">
                    {modalMessage}
                    <div className="flex justify-end mt-4">
                        <button onClick={onClose} className="text-white bg-gray-500 rounded-md px-4 py-2 mr-2">취소</button>
                        <button onClick={handleResetPassword} className="text-white bg-blue-500 rounded-md px-4 py-2">비밀번호 재설정</button>
                    </div>
                </ModalMSG>

                {/* 에러 메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p>
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
                    <div className="flex justify-center mt-4">
                        <button onClick={handleErrorMessageModalClose} className="text-white bg-blue-300 rounded-md px-4 py-2 font-normal border-l hover:bg-blue-500 ">
                            확인
                        </button>
                    </div>
                </ModalErrorMSG>

            </div>
        </div>
    ) : null;
}

export default ModalResetPassword;
