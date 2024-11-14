import React, { useState } from 'react';
import { usePublic } from '../contexts/publicContext';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import VerificationModal from '../components/verificationModal';
import config from '../../config';

const UserProfileForm = ({
  name, setName, // 사용자 이름과 이름 변경 함수
  ID, // 사용자 ID
  email, setEmail, // 이메일과 이메일 변경 함수
  phoneNumber, setPhoneNumber, // 전화번호와 전화번호 변경 함수
  department, setDepartment,
}) => {
  // State 관리
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [message, setMessage] = useState(''); // 일반 메시지 내용
  const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달의 열림/닫힘 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달의 열림/닫힘 상태
  const [verificationCode, setVerificationCode] = useState(''); // 입력된 인증번호
  const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
  const { isPublicOn } = usePublic();

  // 일반 메시지 모달 닫기 & 초기화
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };


  // 에러 메시지 모달 닫기 & 초기화
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  // 핸드폰 번호로 인증번호 전송 요청
  const handleSendCode = async () => {
    const phoneRegex = /^\d{11}$/; // 핸드폰 번호 형식 검증 (11자리 숫자)
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage('핸드폰 번호를 확인해 주세요');
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiDomain}/public/send-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          type: 'mypage',
          user_id: ID,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setVerificationCode(''); // 모달을 열 때 인증번호 초기화
        setShowCodeModal(true); // 인증번호 입력 모달 열기
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 번호 요청 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // 받은 인증번호가 백엔드에서 보낸 인증번호와 일치하는지 확인
  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/public/verify-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code: verificationCode,
          type: 'mypage',
          user_id: ID,
        }),
      });

      // 서버의 응답을 JSON 형식으로 변환
      const data = await response.json();

      if (response.ok && data.success) {
        setShowCodeModal(false); // 인증 완료 후 모달 닫기
        setMessage(data.message || '인증에 성공하였습니다.'); // 메시지가 없을 경우 기본 메시지 제공
        setShowMessageModal(true); // 성공 모달 열기
      } else {
        setErrorMessage(data.message || '알 수 없는 오류가 발생했습니다.');
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('인증 확인 중 네트워크 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };


  // 인증번호 모달을 닫을 때 에러 메시지 초기화
  const handleCodeModalClose = () => {
    setShowCodeModal(false);
    setVerificationCode(''); // 인증번호 초기화
  };

  return (
    <div className="flex flex-col items-start py-4 font-sans space-y-2">
      <div className='font-semibold text-lg' style={{ fontFamily: "NanumSquareExtraBold" }}>사용자 정보</div>

      {/* 사용자 정보 입력 필드 */}
      <div className='flex flex-col px-2 space-y-4'>
        {/* 이름 입력 필드 */}
        <div className='flex flex-col '>
          <div className='text-sm text-gray-400 mr-1.5 whitespace-nowrap text-left' style={{ fontFamily: "NanumSquare" }}>이름</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          />
        </div>

        {/* ID 표시 필드 */}
        <div className='flex flex-col '>
          <div className='text-sm text-gray-400 mr-1.5 text-left' style={{ fontFamily: "NanumSquare" }}> 아이디</div>
          <div
            type="id"
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          >
            <div className='text-left'>{ID}</div> {/* ID는 수정 불가 */}
          </div>
        </div>

        {/* 이메일 입력 필드 */}
        <div className='flex flex-col'>
          <div className='text-sm text-gray-400 text-left' style={{ fontFamily: "NanumSquare" }}>이메일</div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              border: 'none',
              borderBottom: '1.5px solid #6366f1',
              outline: 'none',
              padding: '2px 0',
              width: '100%',
            }}
          />
        </div>

        {/* 전화번호 입력 필드 및 인증번호 받기 버튼 */}
        <div className='flex flex-col'>
          <div className='text-sm text-gray-400 mr-1.5 text-left' style={{ fontFamily: "NanumSquare" }}>전화번호</div>
          <div className='flex flex-row justify-between space-x-4'>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #6366f1',
                outline: 'none',
                padding: '2px 0',
                width: '100%',
              }}
            />
            <button
              className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap"
              onClick={handleSendCode}
              style={{ fontFamily: "NanumSquareBold" }}
            >
              인증번호 받기
            </button>
          </div>
        </div>

        {/* 소속부서 입력 필드 */}
        {isPublicOn &&
          <div className='flex flex-col'>
            <div className='text-sm text-gray-400 text-left' style={{ fontFamily: "NanumSquare" }}>소속 부서</div>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #6366f1',
                outline: 'none',
                padding: '2px 0',
                width: '100%',
              }}
            />
          </div>
        }
      </div>

      {/* 핸드폰 인증번호 입력 모달 */}
      <VerificationModal
        isOpen={showCodeModal}
        onClose={handleCodeModalClose}
        onSubmit={handleVerifyCode}
        verificationCode={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        errorMessage={errorMessage}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {errorMessage}
        </p>
      </ModalErrorMSG>
    </div>
  );
};

export default UserProfileForm;
