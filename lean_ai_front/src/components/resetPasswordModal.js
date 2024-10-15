import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';

function ModalResetPassword({ show, onClose, phone }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if (show) {
            setNewPassword('');
            setConfirmPassword('');
        }
    }, [show]);

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setModalMessage('');
        onClose();
    };

    const handleErrorMessageModalClose = () => {
        setShowErrorMessageModal(false);
        setErrorMessage('');
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            setShowErrorMessageModal(true);
            return;
        }

        try {
            const response = await fetch(`${config.apiDomain}/api/reset-password/`, {
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
                setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
                setIsModalOpen(true);
            } else {
                setErrorMessage(data.message);
                setShowErrorMessageModal(true);
            }
        } catch (error) {
            console.error('비밀번호 재설정 오류:', error);
            setErrorMessage('비밀번호 재설정 중 오류가 발생했습니다.');
            setShowErrorMessageModal(true);
        }
    };

    const handleConfirmAndRedirect = () => {
        setIsModalOpen(false);
        router.push('/login'); // 로그인 페이지로 이동
    };

    return show ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 font-sans">
            <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'NanumSquareExtraBold' }}>비밀번호 재설정</h2>
                <input
                    type="password"
                    placeholder="새 비밀번호"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="password"
                    placeholder="비밀번호 확인"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
                <div className="flex justify-end mt-4">
                    <button onClick={handleCloseModal} className="text-gray-500 px-3 py-2 font-semibold rounded-md hover:ring-2 ring-gray-400">
                        취소
                    </button>
                    <button onClick={handleResetPassword} className="text-blue-500 px-3 py-2 font-semibold rounded-md hover:ring-2 ring-blue-400">
                        비밀번호 재설정
                    </button>
                </div>

                {/* 성공 메시지 모달 */}
                <ModalMSG title="Success" show={isModalOpen} onClose={handleConfirmAndRedirect} >
                    <p>{modalMessage}</p>
                </ModalMSG>

                {/* 에러 메시지 모달 */}
                <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
                    <p>{typeof errorMessage === 'object'
                        ? Object.entries(errorMessage).map(([key, value]) => (
                            <span key={key}>{key}: {Array.isArray(value) ? value.join(', ') : value.toString()}<br /></span>
                          ))
                        : errorMessage}
                    </p>
                </ModalErrorMSG>
            </div>
        </div>
    ) : null;
}

export default ModalResetPassword;
