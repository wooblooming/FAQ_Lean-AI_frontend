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
  const [activeTab, setActiveTab] = useState('id'); // 'id' 또는 'password'
  const [formData, setFormData] = useState({ id: '', phone: '', verificationCode: '' });
  const [userId, setUserId] = useState(null);
  const [dateJoined, setDateJoined] = useState(null);
  const [codeSent, setCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  useEffect(() => {
    // 세션 스토리지에서 데이터 불러오기
    const storedUserId = sessionStorage.getItem('userId');
    const storedDateJoined = sessionStorage.getItem('dateJoined');
    const storedPhone = sessionStorage.getItem('phone');

    setUserId(storedUserId);
    setDateJoined(storedDateJoined);
    setFormData((prev) => ({ ...prev, phone: storedPhone }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const handleSendCode = async () => {
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
          id: formData.id || undefined,
          phone: formData.phone,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCodeSent(true);
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

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/api/verify-code/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formData.phone,
          code: formData.verificationCode,
          type: activeTab === 'id' ? 'findID' : 'findPW',
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (activeTab === 'id') {
          sessionStorage.setItem('userId', data.user_id);
          sessionStorage.setItem('dateJoined', data.date_joined);
          router.push('/findAccountResult');
        } else {
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

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
            className={`w-1/2 py-2 text-center ${
              activeTab === 'id' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
            }`}
          >
            아이디 찾기
          </button>
          <button
            onClick={() => handleTabChange('password')}
            className={`w-1/2 py-2 text-center ${
              activeTab === 'password' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-gray-500'
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

      <ModalMSG title="Messege" show={isModalOpen} onClose={handleCloseModal}>
        {modalMessage}
      </ModalMSG>

      <ModalErrorMSG show={showErrorMessageModal} onClose={handleErrorMessageModalClose}>
        <p>{errorMessage}</p>
      </ModalErrorMSG>

      <ModalResetPassword show={showResetPasswordModal} onClose={handleCloseResetPasswordModal} phone={formData.phone} />
    </div>
  );
};

export default FindAccountResult;
