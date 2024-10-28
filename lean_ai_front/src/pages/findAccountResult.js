import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import ModalResetPassword from '../components/resetPasswordModal';
import config from '../../config';

const FindAccountResult = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('id'); // 활성 탭: 'id' 또는 'password'
  const [formData, setFormData] = useState({ id: '', phone: '', verificationCode: '', type:''}); // 핸드폰 인증 폼 데이터 저장
  const [userId, setUserId] = useState(''); // 찾은 사용자 ID 저장
  const [dateJoined, setDateJoined] = useState(''); // 가입일 저장
  const [codeSent, setCodeSent] = useState(''); // 인증번호 발송 여부 상태
  const [isModalOpen, setIsModalOpen] = useState(''); // 메시지 모달 상태
  const [modalMessage, setModalMessage] = useState(''); // 모달 메시지 내용
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false); // 비밀번호 재설정 모달 상태

  // 세션 저장된 사용자 정보 불러오기
  useEffect(() => {
    const storedUserId = sessionStorage.getItem('userId') || '';
    const storedDateJoined = sessionStorage.getItem('dateJoined') || '';
    const storedPhone = sessionStorage.getItem('phone') || '';

    setUserId(storedUserId);
    setDateJoined(storedDateJoined);
    setFormData((prev) => ({ ...prev, phone: storedPhone }));
  }, []);

  // 입력 필드에서 데이터가 변경될 때 formData 상태를 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // id와 password 사이에서 탭을 변경
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

 // 비밀번호 재설정을 위한 인증번호 전송
  const handleSendCode = async () => {
    // 핸드폰 번호가 '-' 없이 11자리인지 확인하는 정규식 
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage('- 제외 숫자만 입력하세요');
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiDomain}/api/send-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: formData.id || undefined,
          phone: formData.phone,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCodeSent(true); // 인증번호 발송 상태 업데이트
        setModalMessage('인증번호가 발송되었습니다!');
        setIsModalOpen(true);
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // 비밀번호 재설정을 위한 인증번호를 검증
  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/api/verify-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id:formData.id,
          phone: formData.phone,
          code: formData.verificationCode,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });
    
      const data = await response.json();
      // 인증 성공 시 비밀번호 재설정 모달을 표시
      if (data.success) {
        if (activeTab === 'password') {
          setShowResetPasswordModal(true);
        }
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 확인 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // 일반 메시지 모달 닫기 & 초기화
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  // 에러 메시지 모달 닫기 & 초기화
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  // 비밀번호 재설정 모달 닫기
  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };


  return (
    <div className="bg-violet-50 flex items-center justify-center h-screen">
      <div className="bg-white w-full max-w-md mx-auto p-4 rounded-md shadow-md space-y-4">
        <div className="flex items-center">
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push('/login')}
          />
          <h1 className="text-2xl font-bold text-center text-indigo-600" style={{ fontFamily: 'NanumSquareExtraBold' }}>
            아이디/비밀번호 찾기
          </h1>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => handleTabChange('id')}
            className={`w-1/2 py-2 text-center ${activeTab === 'id' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
              }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => handleTabChange('password')}
            className={`w-1/2 py-2 text-center ${activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
              }`}
          >
            비밀번호 찾기
          </button>
        </div>

        {/* 탭별 내용 */}
        {activeTab === 'id' ? (
          <div className="mt-4 text-center">
            <p className="mb-4">휴대전화번호 정보와 일치하는 아이디입니다.</p>
            <div className="border p-4 mb-4">
              <p>아이디: {userId || '정보가 없습니다.'}</p>
              <p>가입일: {dateJoined || '정보가 없습니다.'}</p>
            </div>
            <Link
              href="/login"
              className="bg-indigo-500 text-white text-lg font-semibold py-2 px-4 rounded-full w-full block"
            >
              로그인
            </Link>
          </div>
        ) : (
          <div className="mt-4">
            {/* 아이디 입력, 휴대폰 번호 입력, 인증번호 입력 필드 */}
            <div className="flex items-center mb-4">
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="아이디 입력"
              />
            </div>

            <div className="flex items-center mb-4">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="휴대폰 번호 입력('-' 제외)"
              />
              <button
                onClick={handleSendCode}
                className="text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
              >
                인증번호 전송
              </button>
            </div>

            <div className="flex items-center">
              <input
                type="text"
                name="verificationCode"
                value={formData.verificationCode}
                onChange={handleInputChange}
                className="flex-grow border-b border-gray-300 p-2 focus:outline-none"
                placeholder="인증번호 입력"
              />
              <button
                onClick={handleVerifyCode}
                className="text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 일반 메시지 모달 */}
      <ModalMSG title="Messege" show={isModalOpen} onClose={handleCloseModal}>
        {modalMessage}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
        <p>{errorMessage}</p>
      </ModalErrorMSG>

      {/* 비밀번호 재설정 모달 */}
      <ModalResetPassword show={showResetPasswordModal} onClose={handleCloseResetPasswordModal} phone={formData.phone} />
    </div>
  );
};

export default FindAccountResult;
