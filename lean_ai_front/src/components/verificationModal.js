import React, { useState, useEffect } from 'react';

const VerificationModal = ({ isOpen, onClose, onSubmit, verificationCode, onChange, errorMessage }) => {
    const [timeLeft, setTimeLeft] = useState(180); // 제한 시간: 180초 (3분)

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 font-sans">
            <div className="flex flex-col space-y-2 bg-white p-5 rounded-lg max-w-md w-10/12 flex flex-col space-y-2"
                style={{ maxWidth: '400px' }}
            >
                <h2 className="text-2xl font-bold mb-4">인증번호 확인</h2>
                {/* 인증번호 입력 */}
                <div className='flex flex-row space-x-5 justify-center items-center'>
                    <input
                        type="text"
                        name="verificationCode"
                        value={verificationCode}
                        onChange={onChange}
                        placeholder="인증번호 입력"
                        className="w-full p-2 border border-gray-300 rounded  font-normal text-base"
                    />
                    {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

                    <p className="text-red-500  font-semibold text-lg px-3">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</p>
                </div>

                <div className="flex flex-row space-x-2 justify-center">
                    <button
                        onClick={onSubmit}
                        className=" text-indigo-500 px-4 py-2 rounded"
                        disabled={timeLeft === 0} // 시간이 다 되었을 때 버튼 비활성화
                    >
                        확인
                    </button>
                    <button
                        onClick={onClose}
                        className=" text-red-500 px-4 py-2 rounded"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationModal;
