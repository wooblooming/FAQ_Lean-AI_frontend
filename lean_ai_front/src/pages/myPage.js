import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import kakaoIcon from '../../public/btn_kakao.svg';
import EventAlertModal from '../components/eventModal'; // 이벤트 모달 컴포넌트
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config';

const MyPage = () => {
  // 모달 및 UI 상태 관련 변수
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달의 열림/닫힘 상태
  const [showEventAlertModal, setShowEventAlertModal] = useState(false); // 이벤트 알림 모달의 열림/닫힘 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달의 열림/닫힘 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달의 열림/닫힘 상태
  const [showQrCode, setShowQrCode] = useState(false); // QR 코드 표시 상태

  // 사용자 및 사업자 정보 관련 변수
  const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 URL
  const [name, setName] = useState(''); // 사용자 이름
  const [email, setEmail] = useState(''); // 사용자 이메일
  const [phoneNumber, setPhoneNumber] = useState(''); // 사용자 전화번호
  const [businessName, setBusinessName] = useState(''); // 사업자 이름
  const [businessAddress, setBusinessAddress] = useState(''); // 사업자 주소
  const [ID, setID] = useState(''); // 사용자 또는 사업자 ID
  const [stores, setStores] = useState([]); // 스토어 목록
  const [selectedStoreId, setSelectedStoreId] = useState(null); // 선택된 스토어의 ID
  const [storeName, setStoreName] = useState(''); // 스토어 이름

  // 이벤트 및 스위치 관련 변수
  const [isEventOn, setIsEventOn] = useState(false); // 이벤트 스위치 상태
  const [isKakaoConnected, setIsKakaoConnected] = useState(false); // 카카오톡 연동 여부 (SNS 스위치 상태)

  // 에러 및 메시지 관련 변수
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [message, setMessage] = useState(''); // 일반 메시지 내용

  // QR 코드 관련 변수
  const [qrUrl, setQrUrl] = useState(''); // QR 코드 URL

  // 초기 데이터 및 변경 상태 관련 변수
  const [initialData, setInitialData] = useState({}); // 초기 데이터 (불러온 사용자 또는 사업자 정보)
  const [isChanged, setIsChanged] = useState(false); // 데이터 변경 여부

  // 이미지 모달
  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  // 이벤트 스위치를 눌렀을 때 이벤트 모달을 표시
  const toggleEventOn = () => {
    setShowEventAlertModal(true);  // 스위치를 눌렀을 때 모달을 열기만 함
  };

  // 이벤트 모달 닫기 처리
  const handleEventAlertModalClose = (confirmed) => {
    setShowEventAlertModal(false);
    if (confirmed) {
      setIsEventOn(true);  // "예"를 눌렀을 때 스위치를 ON으로 변경
    } else {
      setIsEventOn(false); // "아니오"를 눌렀을 때 스위치를 OFF로 변경
    }
  };

  // 일반 메시지 모달 닫기 처리
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  // 에러 메시지 모달 닫기 처리
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  // 이미지 선택 시 처리하는 함수
  const chooseImage = async (event) => {
    const file = event.target.files[0]; // 파일 선택

    if (file) {
      const imageUrl = URL.createObjectURL(file); // 임시 이미지 URL 생성
      setProfileImage(imageUrl);

      // 이미지 업로드 처리
      const formData = new FormData();
      formData.append('profile_photo', file);

      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${config.apiDomain}/api/update-profile-photo/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        setMessage("프로필 이미지를 변경하였습니다.");
        setShowMessageModal(true);
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage("프로필 이미지 변경에 실패했습니다.");
        setShowErrorMessageModal(true);
      }
    }
    toggleImageModal(); // 이미지 모달 닫기
  };

  // 기본 이미지 적용 처리 함수
  const applyDefaultImage = async () => {
    const defaultImageUrl = `${config.apiDomain}/media/profile_photos/profile_default_img.jpg`;
    setProfileImage(defaultImageUrl); // 기본 이미지 URL 설정

    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(`${config.apiDomain}/api/update-profile-photo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_photo: `profile_photos/profile_default_img.jpg` }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile image');
      }

      const data = await response.json();
      setMessage(data.message);
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error updating profile image:', error);
      setErrorMessage(error);
      setShowErrorMessageModal(true);
    }

    toggleImageModal();
  };

  // 초기 사용자 정보 및 스토어 데이터를 가져오는 함수
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          setErrorMessage("로그인 하신 후 이용해 주세요");
          setShowErrorMessageModal(true);
          router.push('/login');
          return;
        }

        // 사용자 프로필 정보 가져오기
        const response = await fetch(`${config.apiDomain}/api/user-profile/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setID(data.user_id || '');
          setName(data.name || '');
          setEmail(data.email || '');
          setPhoneNumber(data.phone_number || '');
          setBusinessName(data.business_name || '');
          setBusinessAddress(data.business_address || '');
          setQrUrl(data.qr_code_url || '');

          if (data.profile_photo && !data.profile_photo.startsWith('http')) {
            setProfileImage(`${config.apiDomain}${data.profile_photo}`);
          } else {
            setProfileImage(data.profile_photo || '/profile_default_img.jpg');
          }

        } else {
          console.error('Failed to fetch user data. Status:', response.status);
          setErrorMessage("프로필 정보를 가져오는데 실패하였습니다.");
          setShowErrorMessageModal(true);
        }

        // 사용자 스토어 목록 가져오기
        const storeResponse = await fetch(`${config.apiDomain}/api/user-stores/`, {
          method: 'POST', 
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (storeResponse.ok) {
          const storeData = await storeResponse.json();
          setStores(storeData); // 스토어 목록 설정
          if (storeData.length > 0) {
            setSelectedStoreId(storeData[0].store_id); // 기본적으로 첫 번째 스토어 선택
            setStoreName(storeData[0].store_name); // 첫 번째 스토어 이름 설정
          }
        } else {
          console.error('Failed to fetch stores. Status:', storeResponse.status);
          setErrorMessage("스토어 정보를 가져오는데 실패하였습니다.");
          setShowErrorMessageModal(true);
        }

      } catch (error) {
        console.error('Error fetching user or store data:', error);
        setErrorMessage("정보를 가져오는데 실패하였습니다.");
        setShowErrorMessageModal(true);
      }
    };

    fetchUserData();
  }, []); // 컴포넌트가 처음 마운트될 때 사용자 및 스토어 정보를 가져옴

  // 데이터 변경 여부를 감지
  useEffect(() => {
    const hasChanged = (
      name !== initialData.name ||
      email !== initialData.email ||
      phoneNumber !== initialData.phoneNumber ||
      businessName !== initialData.businessName ||
      businessAddress !== initialData.businessAddress
    );
    setIsChanged(hasChanged); // 변경 사항이 있으면 true 설정
  }, [name, email, phoneNumber, businessName, businessAddress, initialData]);

  // 변경 사항 저장 처리 함수
  const handleSaveChanges = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        setErrorMessage("로그인 하신 후 이용해 주세요");
        setShowErrorMessageModal(true);
        router.push('/login');
        return;
      }

      const response = await fetch(`${config.apiDomain}/api/user-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone_number: phoneNumber,
          business_name: businessName,
          business_address: businessAddress,
        }),
      });

      if (response.ok) {
        setMessage("프로필 업데이트를 성공하였습니다");
        setShowMessageModal(true);
        setIsChanged(false); // 변경 사항이 저장되면 상태 초기화
      } else {
        setMessage("프로필 업데이트를 성공하였습니다");
        setShowMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("프로필 업데이트에 실패하였습니다.");
      setShowErrorMessageModal(true);
    }
  };

  // QR 코드 생성 처리 함수
  const handleGenerateQrCode = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        setErrorMessage("로그인 하신 후 이용해 주세요");
        setShowErrorMessageModal(true);
        router.push('/login');
        return;
      }
      if (!selectedStoreId) {
        setErrorMessage('스토어를 선택하세요.');
        setShowErrorMessageModal(true);
        return;
      }

      const response = await fetch(`${config.apiDomain}/api/generate-qr-code/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ store_id: selectedStoreId }), // 선택된 스토어 ID 전송
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage('QR 코드 생성에 실패하였습니다.');
        setShowErrorMessageModal(true);
        return;
      }

      const data = await response.json();
      setQrUrl(data.qr_code_url); // QR 코드 URL 설정
      setShowQrCode(true);
      setMessage('QR 코드가 생성되었습니다.');
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage('QR 코드 생성에 실패하였습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // QR 코드 다운로드 처리 함수
  const handleDownloadQrCode = () => {
    if (!qrUrl) {
      setErrorMessage('QR 코드 다운로드에 실패하였습니다.');
      setShowErrorMessageModal(true);
      return;
    }

    // 이미지 다운로드를 위한 링크 생성 및 클릭
    const downloadLink = document.createElement('a');
    downloadLink.href = qrUrl; // 백엔드에서 전달받은 QR 코드 이미지 URL
    downloadLink.download = `${storeName}_qr_code.png`; // storeName을 파일명으로 설정
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); // 링크 제거
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center relative font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        <Link href="/mainPageForPresident" className="absolute top-4 left-4 text-gray-500 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className='flex justify-between items-center'>
          <p className='font-semibold mt-2.5'>마이 페이지</p>
          <button
            className={`font-semibold text-sm ${isChanged ? 'text-blue-500' : 'text-gray-200'}`}
            onClick={handleSaveChanges}
            disabled={!isChanged}
          >
            완료
          </button>
        </div>

        {/* 프로필 이미지 섹션 */}
        <div className="mb-4 relative">
          <img
            src={profileImage || '/profile_default_img.jpg'}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full mx-auto mb-4 border border-2 border-blue-300"
            onClick={toggleImageModal}
            style={{ cursor: 'pointer' }}
          />
          <div
            className="absolute flex items-center justify-center text-xs font-bold text-white"
            style={{
              bottom: '0',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              backgroundColor: '#21A2FF',
              padding: '4px 8px',
              borderRadius: '12px',
              width: '60px',
              cursor: 'pointer',
            }}
            onClick={toggleImageModal}
          >
            EDIT
          </div>
        </div>

        {/* 사용자 정보 입력 필드 */}
        <div className="flex flex-col mt-4 font-sans">
          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row '>
              <div className='text-sm text-gray-300 mr-1.5 '>이름</div>
              <label htmlFor="user-name" className=" text-red-500">*</label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #21A2FF',
                outline: 'none',
                padding: '4px 0',
                width: '100%',
              }}
            />
          </div>

          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row '>
              <div className='text-sm text-gray-300 mr-1.5 '>이메일</div>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #21A2FF',
                outline: 'none',
                padding: '4px 0',
                width: '100%',
              }}
            />
          </div>

          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row '>
              <div className='text-sm text-gray-300 mr-1.5 '>전화번호</div>
              <label htmlFor="user-phone" className=" text-red-500">*</label>
            </div>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #21A2FF',
                outline: 'none',
                padding: '4px 0',
                width: '100%',
              }}
            />
          </div>

          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row '>
              <div className='text-sm text-gray-300 mr-1.5 '>사업자명</div>
              <label htmlFor="business-name" className=" text-red-500">*</label>
            </div>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #21A2FF',
                outline: 'none',
                padding: '4px 0',
                width: '100%',
              }}
            />
          </div>

          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row '>
              <div className='text-sm text-gray-300 mr-1.5 '>사업장 주소</div>
              <label htmlFor="business-address" className=" text-red-500">*</label>
            </div>
            <input
              type="text"
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              style={{
                border: 'none',
                borderBottom: '1.5px solid #21A2FF',
                outline: 'none',
                padding: '4px 0',
                width: '100%',
              }}
            />
          </div>

          {/* 스토어 선택 드롭다운 */}
          <div className='flex flex-col items-start mb-4'>
            <label htmlFor="store-select" className="text-sm text-gray-300">스토어 선택</label>
            <select
              id="store-select"
              className="border-none border-b-2 border-blue-500 outline-none p-1"
              value={selectedStoreId || ''}
              onChange={(e) => {
                setSelectedStoreId(parseInt(e.target.value, 10));
                const selectedStore = stores.find(store => store.store_id === parseInt(e.target.value, 10));
                setStoreName(selectedStore?.store_name || ''); // 선택한 스토어 이름 설정
              }}
            >
              <option value="" disabled>스토어를 선택하세요</option>
              {stores.map((store) => (
                <option key={store.store_id} value={store.store_id}>
                  {store.store_name}
                </option>
              ))}
            </select>
          </div>

          {/* QR코드 관리 섹션 */}
          <div className='flex flex-col items-start mb-4'>
            <div className='font-semibold mb-2'>QR코드 관리</div>
            {qrUrl ? (
              <div className='mt-4'>
                <img src={qrUrl} alt="QR 코드" className="mx-auto" style={{ maxWidth: '200px' }} />
                <button
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handleDownloadQrCode}
                >
                  QR 코드 다운로드
                </button>
              </div>
            ) : (
              <button className='border-none spacewhite-nowrap' style={{ color: '#007AFF' }} onClick={handleGenerateQrCode}>
                생성하기
              </button>
            )}
          </div>

          {/* 이벤트 스위치 */}
          <div className="flex flex-col items-start mb-4">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col mr-11">
                <div className="flex items-start w-full text-sm font-semibold">이벤트, 혜택 정보</div>
                <div className="text-sm text-gray-300">이벤트, 프로모션 등 혜택 정보 알림</div>
              </div>
              <div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isEventOn}
                    onChange={() => toggleEventOn()} // 스위치 변경 시 모달 열기
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className='flex flex-col items-start mb-4'>
            <div className='flex flex-row justify-between items-center'>
              <div className='flex flex-col mr-11'>
                <div className='flex items-start w-full text-sm font-semibold text-gray-400'>계정 정보</div>
                <div className='text-sm text-gray-300 spacewhite-pre'>가입 아이디</div>
                <div className='text-semibold spacewhite-pre'>{ID}</div>
              </div>
            </div>
          </div>

          {/* 카카오톡 연결 스위치 */}
          <div>
            <div className='flex flex-row justify-between items-center font-sans'>
              <div className='flex items-center'>
                <span><Image src={kakaoIcon} className='mr-2 w-5 h-5' alt="kakao" /></span>
                <p className='whitespace-nowrap '>카카오 연결하기</p>
              </div>
              <div>
                <label className="switch mr-2.5">
                  <input type="checkbox" checked={isKakaoConnected} onChange={() => setIsKakaoConnected(!isKakaoConnected)} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 이미지 모달 */}
        {isImageModalOpen && (
          <div id="imageModal" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center relative">
              <button
                onClick={toggleImageModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-4">프로필 사진 설정</h2>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="fileInput"
                onChange={chooseImage}
              />
              <button
                onClick={() => document.getElementById('fileInput').click()}
                className="block w-full mb-2 py-2 text-black"
              >
                앨범에서 사진/동영상 선택
              </button>
              <button onClick={applyDefaultImage} className="block w-full py-2 text-black">
                기본 이미지 적용
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 이벤트 모달 */}
      <EventAlertModal
        show={showEventAlertModal}
        onClose={handleEventAlertModalClose}
      />

      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title=" "
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
      </ModalMSG>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {errorMessage}
        </p>
      </ModalErrorMSG>

      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 42px;
          height: 26px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #2196F3;
        }

        input:checked + .slider:before {
          transform: translateX(16px);
        }
      `}</style>
    </div>
  );
};

export default MyPage;
