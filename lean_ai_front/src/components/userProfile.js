import React from 'react';
import VerificationModal from '../components/verificationModal'; 

const UserProfileForm = ({
  name, setName, // 사용자 이름과 이름 변경 함수
  ID, setID, // 사용자 ID와 ID 변경 함수
  email, setEmail, // 이메일과 이메일 변경 함수
  phoneNumber, setPhoneNumber, // 전화번호와 전화번호 변경 함수
  handleSendCode, // 인증번호 전송 함수 (부모 컴포넌트에서 전달됨)
  showCodeModal, setShowCodeModal, // 인증번호 입력 모달 상태와 상태 변경 함수
  handleCodeModalClose, // 모달 닫기 함수 (부모 컴포넌트에서 전달됨)
  handleVerifyCode, // 인증 코드 검증 함수 (부모 컴포넌트에서 전달됨)
  verificationCode, // 인증 코드 값 (부모 컴포넌트에서 전달됨)
  setVerificationCode, // 인증 코드 변경 함수 (부모 컴포넌트에서 전달됨)
  errorMessage // 에러 메시지 (부모 컴포넌트에서 전달됨)
}) => (
  <div className="flex flex-col items-start py-4 font-sans space-y-2">
    <div className='font-semibold'>사용자 정보</div>
    
    {/* 사용자 정보 입력 필드 */}
    <div className='flex flex-col px-2 '>
      
      {/* 이름 입력 필드 */}
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

      {/* ID 표시 필드 */}
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
          <div className='text-left'>{ID}</div> {/* ID는 수정 불가 */}
        </div>
      </div>

      {/* 이메일 입력 필드 */}
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

      {/* 전화번호 입력 필드 및 인증번호 받기 버튼 */}
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
          {/* 인증번호 받기 버튼 */}
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
      onClose={handleCodeModalClose}  // 모달을 닫는 함수
      onSubmit={handleVerifyCode}  // 인증 번호 검증 함수
      verificationCode={verificationCode}  // 입력된 인증 코드
      onChange={(e) => setVerificationCode(e.target.value)}  // 인증 코드 변경 함수
      errorMessage={errorMessage}  // 인증 오류 시 표시될 메시지
    />
  </div>
);

export default UserProfileForm;
