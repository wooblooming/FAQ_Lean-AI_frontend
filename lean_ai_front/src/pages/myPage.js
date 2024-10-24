import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft } from 'lucide-react';
import kakaoIcon from '../../public/btn_kakao.svg';
import naverIcon from '../../public/btn_naver.svg';
import googleIcon from '../../public/btn_google.svg';
import UserProfileForm from '../components/userProfile';
import QrCodeSection from '../components/qrCode';
import EventSwitch from '../components/event';
import SnsConnect from '../components/snsConnect'; // SNS 연결 컴포넌트
import VerificationModal from '../components/verificationModal'; // 핸드폰 인증 기능이 있는 컴포넌트
import EventAlertModal from '../components/eventModal'; // 이벤트 모달 컴포넌트
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config';
import ConfirmDeleteAccountModal from '../components/confirmDeleteAccountModal.js';

const MyPage = () => {
  // 모달 및 UI 상태 관련 변수
  const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달의 열림/닫힘 상태
  const [showEventAlertModal, setShowEventAlertModal] = useState(false); // 이벤트 알림 모달의 열림/닫힘 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달의 열림/닫힘 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 일반 메시지 모달의 열림/닫힘 상태
  const [showQrCode, setShowQrCode] = useState(false); // QR 코드 표시 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [snsList, setSnsList] = useState([
    { name: 'kakao', displayName: '카카오', icon: kakaoIcon, isConnected: false },
    { name: 'naver', displayName: '네이버', icon: naverIcon, isConnected: false },
    { name: 'google', displayName: '구글', icon: googleIcon, isConnected: false },
  ]); // SNS 연결 상태 관리

  // 사용자 및 사업자 정보 관련 변수
  const [profileImage, setProfileImage] = useState(''); // 프로필 이미지 URL
  const [name, setName] = useState(''); // 사용자 이름
  const [email, setEmail] = useState(''); // 사용자 이메일
  const [phoneNumber, setPhoneNumber] = useState(''); // 사용자 전화번호
  const [verificationCode, setVerificationCode] = useState(''); // 입력된 인증번호
  const [ID, setID] = useState(''); // 사용자 또는 사업자 ID
  const [stores, setStores] = useState([]); // 스토어 목록
  const [selectedStoreId, setSelectedStoreId] = useState(null); // 선택된 스토어의 ID
  const [storeName, setStoreName] = useState(''); // 스토어 이름

  // 이벤트 및 스위치 관련 변수
  const [isEventOn, setIsEventOn] = useState(false); // 이벤트 스위치 상태
  const [isSnsConnected, setIsSnsConnected] = useState(false); // SNS 연동 여부 (SNS 스위치 상태)

  // 에러 및 메시지 관련 변수
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [message, setMessage] = useState(''); // 일반 메시지 내용

  // QR 코드 관련 변수
  const [qrUrl, setQrUrl] = useState(''); // QR 코드 URL  
  const toggleQrCode = () => setShowQrCode(!showQrCode);// QR 코드 접기/펼치기 상태 관리 함수

  // 초기 데이터 및 변경 상태 관련 변수
  const [initialData, setInitialData] = useState({}); // 초기 데이터 (불러온 사용자 또는 사업자 정보)
  const [isChanged, setIsChanged] = useState(false); // 데이터 변경 여부

  const router = useRouter();
  const [token, setToken] = useState(null);

  // 이미지 모달
  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  // 이벤트 스위치를 눌렀을 때 이벤트 모달을 표시
  const toggleEventOn = () => {
    setShowEventAlertModal(true);  // 스위치를 눌렀을 때 모달을 열기만 함
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

  // 컴포넌트가 처음 마운트될 때 토큰을 가져오는 함수
  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    setToken(storedToken);
  }, []);

  // 초기 사용자 정보 및 스토어 데이터를 가져오는 함수
  useEffect(() => {
      // token이 있을 때만 fetchUserData 실행
  if (!token) {
    return; // token이 없으면 아무것도 하지 않음
  }

    const fetchUserData = async () => {
      try {

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
          setIsEventOn(data.marketing === 'N'); // 마케팅 동의 상태 초기화
          // QR 코드 처리
          if (data.qr_code_url) {
            const mediaUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}${decodeURIComponent(data.qr_code_url)}`;
            setQrUrl(mediaUrl);
          } else {
            setQrUrl(null); // QR 코드가 없으면 null 설정
          }

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
  }, [token]); // 컴포넌트가 처음 마운트될 때 사용자 및 스토어 정보를 가져옴

  // 데이터 변경 여부를 감지
  useEffect(() => {
    const hasChanged = (
      name !== initialData.name ||
      email !== initialData.email ||
      phoneNumber !== initialData.phoneNumber
    );
    setIsChanged(hasChanged); // 변경 사항이 있으면 true 설정
  }, [name, email, phoneNumber, initialData]);


  // 이벤트 모달 닫기 처리
  const handleEventAlertModalClose = async (confirmed) => {
    setShowEventAlertModal(false);
    if (confirmed) {
      setIsEventOn(true);  // "예"를 눌렀을 때 스위치를 ON으로 변경
      await updateMarketingStatus('Y');  // DB 업데이트
    } else {
      setIsEventOn(false); // "아니오"를 눌렀을 때 스위치를 OFF로 변경
      await updateMarketingStatus('N');  // DB 업데이트
    }
  };

  // 마케팅 상태 업데이트 함수
  const updateMarketingStatus = async (status) => {
    try {

      const response = await fetch(`${config.apiDomain}/api/user-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ marketing: status })
      });

      if (!response.ok) {
        throw new Error('마케팅 상태 업데이트에 실패하였습니다.');
      }

      const data = await response.json();
      setMessage("마케팅 상태가 업데이트되었습니다.");
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorMessageModal(true);
    }
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

  // 변경 사항 저장 처리 함수
  const handleSaveChanges = async () => {
    try {
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

  // 핸드폰 번호로 인증번호 전송 요청
  const handleSendCode = async () => {
    const phoneRegex = /^\d{11}$/; // 핸드폰 번호 형식 검증 (11자리 숫자)
    if (!phoneRegex.test(phoneNumber)) {
      setErrorMessage('핸드폰 번호를 확인해 주세요');
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiDomain}/api/send-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          type: 'mypage',
          user_id : ID,
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
      const response = await fetch(`${config.apiDomain}/api/verify-code/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code: verificationCode,
          type: 'mypage',
          user_id : ID,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCodeModal(false); // 인증 완료 후 모달 닫기
        setMessage(data.message); // 백엔드에서 받은 메시지를 그대로 출력
        setShowMessageModal(true); // 메시지 모달 열기
      } else {
        setErrorMessage(data.message); // 에러 메시지도 백엔드 응답을 그대로 출력
        setShowErrorMessageModal(true); // 에러 메시지 모달 열기
      }
    } catch (error) {
      setErrorMessage('인증 확인 중 오류가 발생했습니다.');
      setShowErrorMessageModal(true);
    }
  };

  // 인증번호 모달을 닫을 때 에러 메시지 초기화
  const handleCodeModalClose = () => {
    setShowCodeModal(false);
    setVerificationCode(''); // 인증번호 초기화
  };

  // QR 코드 생성 처리 함수
  const handleGenerateQrCode = async () => {
    try {
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
  
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
  
    img.crossOrigin = 'Anonymous'; // CORS 문제 방지
    img.src = qrUrl; // QR 코드 이미지 URL
  
    img.onload = () => {
      // QR 코드 이미지의 크기에 맞게 캔버스 크기 설정
      canvas.width = img.width;
      canvas.height = img.height;
  
      // 캔버스에 QR 코드 이미지를 그리기
      ctx.drawImage(img, 0, 0);
  
      // 캔버스를 이미지 데이터 URL로 변환하여 다운로드 처리
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${storeName}_qr_code.png`; // 파일 이름 설정
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink); // 링크 제거
    };
  
    img.onerror = () => {
      setErrorMessage('이미지를 불러오는 데 실패했습니다.');
      setShowErrorMessageModal(true);
    };
  };
  

  // SNS 연결 상태 토글 함수
  const toggleSnsConnection = (snsName) => {
    setSnsList((prevSnsList) =>
      prevSnsList.map((sns) =>
        sns.name === snsName ? { ...sns, isConnected: !sns.isConnected } : sns
      )
    );
  };

  // 탈퇴 확인 모달을 열기 위한 함수
  const handleAccountDeletionClick = () => {
    setShowDeleteModal(true);
  };

  // 탈퇴 모달에서 확인을 눌렀을 때 탈퇴 처리
  const handleConfirmAccountDeletion = async () => {
    setShowDeleteModal(false); // 모달 닫기
    try {
      const response = await fetch(`${config.apiDomain}/api/deactivate-account/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("회원탈퇴가 완료되었습니다.");
        setShowMessageModal(true);
        sessionStorage.removeItem('token');  // sessionStorage에서 토큰 삭제
        router.push('/');  // 루트 페이지로 리다이렉트
      } else {
        setErrorMessage("회원탈퇴에 실패했습니다.");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("회원탈퇴 요청 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    }
  };

  return (
    <div className="bg-indigo-100 flex items-center justify-center relative font-sans min-h-screen">
      <div className="bg-white p-8 my-4 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        <div className='flex justify-between items-center'>
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.push('/mainPageForPresident')}
          />
          <p className='font-semibold mt-2.5'> </p>
          <button
            className={`font-semibold text-lg ${isChanged ? 'text-indigo-500' : 'text-gray-500'}`}
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
            className="w-24 h-24 rounded-full mx-auto mb-4 border border-2 border-indigo-500"
            onClick={toggleImageModal}
            style={{ cursor: 'pointer' }}
          />
          <div
            className="absolute flex items-center justify-center text-xs font-bold text-white"
            style={{
              bottom: '0',
              left: '50%',
              transform: 'translate(-50%, 50%)',
              backgroundColor: '#6366f1',
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
        <UserProfileForm
        name={name}
        setName={setName}
        ID={ID}
        setID={setID}
        email={email}
        setEmail={setEmail}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        handleSendCode={handleSendCode}
        showCodeModal={showCodeModal}
        setShowCodeModal={setShowCodeModal}
        handleCodeModalClose={handleCodeModalClose}  // 추가
        handleVerifyCode={handleVerifyCode}  // 추가
        verificationCode={verificationCode}  // 추가
        setVerificationCode={setVerificationCode}  // 추가
        errorMessage={errorMessage}  // 추가
      />

        {/* QR 코드 섹션 */}
        <QrCodeSection
          stores={stores}
          selectedStoreId={selectedStoreId}
          setSelectedStoreId={setSelectedStoreId}
          storeName={storeName}
          setStoreName={setStoreName}
          qrUrl={qrUrl}
          setQrUrl={setQrUrl}
          showQrCode={showQrCode}
          toggleQrCode={toggleQrCode}
          handleDownloadQrCode={handleDownloadQrCode}
          handleGenerateQrCode={handleGenerateQrCode}
        />

        {/* 이벤트 스위치 */}
        <EventSwitch
          isEventOn={isEventOn}
          toggleEventOn={toggleEventOn}
        />

        {/* 회원 탈퇴 버튼 */}
        <button
          className="text-red-600 font-bold mt-4 hover:underline"
          onClick={handleAccountDeletionClick}  // 탈퇴 모달 열기
        >
          회원탈퇴
        </button>

        {/* 계정 삭제 모달 */}
        <ConfirmDeleteAccountModal
          show={showDeleteModal}
          onClose={(confirmed) => {
            setShowDeleteModal(false);
            if (confirmed) {
              handleConfirmAccountDeletion(); // 탈퇴 확정 시 처리
            }
          }}
          message="정말 탈퇴를 하시겠습니까?"  // 탈퇴 확인 메시지
        />

        {/* 추후 업데이트 */}
        {/* SNS 연결 섹션 
        <SnsConnect
          snsList={snsList}
          toggleSnsConnection={toggleSnsConnection}
        />
        */}

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

        {/* 핸드폰 이용하여 본인 인증하는 모달 */}
        <VerificationModal
          isOpen={showCodeModal}
          onClose={handleCodeModalClose}  // 에러 초기화를 위해 수정된 핸들러 사용
          onSubmit={handleVerifyCode}
          verificationCode={verificationCode}  // 전달된 verificationCode
          onChange={(e) => setVerificationCode(e.target.value)}  // onChange 이벤트 핸들러
          errorMessage={errorMessage}
        />

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
            transition: 0.4s;
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
            transition: 0.4s;
            border-radius: 50%;
          }

          input:checked + .slider {
            background-color: #8b5cf6;
          }

          input:checked + .slider:before {
            transform: translateX(16px);
          }
        `}
        </style>

      </div>
    </div>
  );
};

export default MyPage;