import React from 'react';

const UserProfileForm = ({ 
    name, setName, 
    ID, setID,
    email, setEmail, 
    phoneNumber, setPhoneNumber, 
    handleSendCode,
    showCodeModal,setShowCodeModal,
}) => (
    <div className="flex flex-col mt-4 font-sans">
    <div className='flex flex-col items-start font-semibold mb-2 '>사용자 정보</div>
    <div className='flex flex-col items-start mb-4 ml-2'>
      <div className='flex flex-row '>
        <div className='text-sm text-gray-400 mr-1.5 '>이름</div>
        <label htmlFor="user-name" className=" text-red-500">*</label>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          border: 'none',
          borderBottom: '1.5px solid #8b5cf6',
          outline: 'none',
          padding: '4px 0',
          width: '100%',
        }}
      />
    </div>

    <div className='flex flex-col items-start mb-4 ml-2'>
      <div className='flex flex-row '>
        <div className='text-sm text-gray-400 mr-1.5 '>아이디</div>
      </div>
      <div
        type="id"
        style={{
          border: 'none',
          borderBottom: '1.5px solid #8b5cf6',
          outline: 'none',
          padding: '4px 0',
          width: '100%',
        }}
      >
        <div className='text-left'>{ID}</div>
      </div>
    </div>

    <div className='flex flex-col items-start mb-4 ml-2'>
      <div className='flex flex-row '>
        <div className='text-sm text-gray-400 mr-1.5 '>이메일</div>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          border: 'none',
          borderBottom: '1.5px solid #8b5cf6',
          outline: 'none',
          padding: '4px 0',
          width: '100%',
        }}
      />
    </div>

    <div className='flex flex-col items-start mb-4 ml-2'>
      <div className='flex flex-row '>
        <div className='text-sm text-gray-400 mr-1.5 '>전화번호</div>
        <label htmlFor="user-phone" className=" text-red-500">*</label>
      </div>
      <div className='flex flex-row space-x-4'>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          style={{
            border: 'none',
            borderBottom: '1.5px solid #8b5cf6',
            outline: 'none',
            padding: '4px 0',
            width: '100%',
          }}
        />
        <button className="flex items-center justify-end text-center bg-violet-400 text-white rounded-md px-2 py-2 font-medium whitespace-nowrap"
          onClick={handleSendCode}
        >
          인증번호 받기
        </button>
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
