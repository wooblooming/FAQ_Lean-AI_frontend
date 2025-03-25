import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';

const VerificationModal = ({ isOpen, onClose, onSubmit, verificationCode, onChange, errorMessage }) => {
    const [timeLeft, setTimeLeft] = useState(180); // 제한 시간: 180초 (3분)
    const [isVerifying, setIsVerifying] = useState(false); // 인증번호 확인 진행 상태

    useEffect(() => {
        if (!isOpen) return;

        // 타이머 시작
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer); // 시간이 다되면 타이머 정지
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        // 모달이 닫히면 타이머를 정리
        return () => clearInterval(timer);
    }, [isOpen]);

    useEffect(() => {
        if (timeLeft === 0) {
            // 시간이 다 되었을 때 실행할 작업
            onClose(); // 시간이 다 되면 모달을 닫음
        }
    }, [timeLeft]);

    if (!isOpen) return null;

    // 분과 초를 계산
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // ✅ 인증번호 확인 버튼 클릭 시 실행되는 함수
    const handleVerification = async () => {
        setIsVerifying(true); // 인증 진행 상태 ON
        await onSubmit(); // 백엔드 인증 요청 실행
        setIsVerifying(false); // 인증 요청 완료 후 상태 복귀
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-lg max-w-md w-11/12">
                {/* 모달 헤더 */}
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">인증번호 확인</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {/* 인증번호 입력 필드 */}
                <div className="relative flex items-center">
                    <input
                        type="text"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={onChange}
                        placeholder="인증번호 입력"
                        className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100"
                        disabled={isVerifying}
                    />
                    <span className="absolute right-4 text-red-500 font-semibold text-lg">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                    </span>
                </div>

                {/* 에러 메시지 */}
                {errorMessage && (
                    <p className="text-red-500 text-center text-sm font-medium">{errorMessage}</p>
                )}

                {/* 버튼 그룹 */}
                <div className="flex space-x-3">
                    <button
                        onClick={handleVerification}
                        className={`flex items-center justify-center w-full text-white py-3 rounded-lg text-lg font-semibold transition ${
                            isVerifying
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-500 hover:bg-indigo-700'
                        }`}
                        disabled={isVerifying || timeLeft === 0}
                    >
                        {isVerifying ? (
                            <>
                                <Loader2 className="animate-spin mr-2" size={20} />
                                인증번호 확인 중...
                            </>
                        ) : (
                            "확인"
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full text-gray-700 bg-gray-100 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                        disabled={isVerifying}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
