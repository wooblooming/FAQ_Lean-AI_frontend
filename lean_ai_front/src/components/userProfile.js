import React from 'react';

const UserProfileForm = ({
  name, setName,
  ID, setID,
  email, setEmail,
  phoneNumber, setPhoneNumber,
  handleSendCode,
  showCodeModal, setShowCodeModal,
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
    {showCodeModal && (
      <div className="modal">
        <h3>인증번호 입력</h3>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          placeholder="인증번호 입력"
        />
        <button onClick={handleVerifyCode}>확인</button>
        <button onClick={handleCodeModalClose}>닫기</button>
      </div>
    )}
  </div>
);

export default UserProfileForm;
