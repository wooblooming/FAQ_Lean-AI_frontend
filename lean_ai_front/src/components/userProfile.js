import React from 'react';
import VerificationModal from '../components/verificationModal'; // 핸드폰 인증 기능이 있는 컴포넌트

const UserProfileForm = ({
  name, setName,
  ID, setID,
  email, setEmail,
  phoneNumber, setPhoneNumber,
  handleSendCode,
  showCodeModal, setShowCodeModal,
  handleCodeModalClose, // 부모 컴포넌트로부터 받음
  handleVerifyCode, // 부모 컴포넌트로부터 받음
  verificationCode, // 부모 컴포넌트로부터 받음
  setVerificationCode, // 부모 컴포넌트로부터 받음
  errorMessage // 부모 컴포넌트로부터 받음
}) => (
  <div className="flex flex-col items-start py-4 font-sans space-y-2">
    <div className='font-semibold'>사용자 정보</div>
    <div className='flex flex-col px-2 '>
      <div className='flex flex-col '>
        <div className='text-sm text-gray-400 mr-1.5 whitespace-nowrap text-left'>이름</div>
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
            marginBottom: '14px'
          }}
        />
      </div>

      <div className='flex flex-col '>
        <div className='text-sm text-gray-400 mr-1.5 text-left'>아이디</div>
        <div
          type="id"
          style={{
            border: 'none',
            borderBottom: '1.5px solid #6366f1',
            outline: 'none',
            padding: '2px 0',
            width: '100%',
            marginBottom: '14px'
          }}
        >
          <div className='text-left'>{ID}</div>
        </div>
      </div>

      <div className='flex flex-col'>
        <div className='text-sm text-gray-400 text-left'>이메일</div>
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
            marginBottom: '14px'
          }}
        />
      </div>

      <div className='flex flex-col '>
        <div className='text-sm text-gray-400 mr-1.5 text-left'>전화번호</div>
        <div className='flex flex-row justify-between'>
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
          <button className="text-center text-indigo-500 hover:font-semibold px-2 font-medium whitespace-nowrap"
            onClick={handleSendCode}
          >
            인증번호 받기
          </button>
        </div>
      </div>
    </div>

    {/* 핸드폰 인증번호 입력 모달 */}
    <VerificationModal
      isOpen={showCodeModal}
      onClose={handleCodeModalClose}  // 부모 컴포넌트로부터 받은 함수 사용
      onSubmit={handleVerifyCode}  // 부모 컴포넌트로부터 받은 함수 사용
      verificationCode={verificationCode}  // 전달된 verificationCode 사용
      onChange={(e) => setVerificationCode(e.target.value)}  // onChange 이벤트 핸들러
      errorMessage={errorMessage}  // 전달된 errorMessage 사용
    />
  </div>
);

export default UserProfileForm;
