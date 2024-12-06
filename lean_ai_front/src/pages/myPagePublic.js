import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, X } from 'lucide-react';
import kakaoIcon from '../../public/btn_kakao.svg';
import naverIcon from '../../public/btn_naver.svg';
import googleIcon from '../../public/btn_google.svg';
import { useAuth } from '../contexts/authContext';
import { useStore } from '../contexts/storeContext';
import { usePublic } from '../contexts/publicContext';
import { fetchPublicUser } from '../fetch/fetchPublicUser';
import UserProfileForm from '../components/component/userProfile';
import QrCodeSection from '../components/component/qrCode';
import EventSwitch from '../components/component/event';
import SnsConnect from '../components/component/snsConnect';
import EventAlertModal from '../components/modal/eventModal';
import ModalMSG from '../components/modal/modalMSG';
import ModalErrorMSG from '../components/modal/modalErrorMSG';
import ConfirmDeleteAccountModal from '../components/modal/confirmDeleteAccountModal';
import config from '../../config';

const MyPagePublic = () => {
  // 모달 및 UI 상태 관련 변수
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

  // 사용자 변수
  const [userData, setUserData] = useState({});
  const [profileImage,setProfileImage] = useState('')
  const [depart, setDepart] = useState(userData?.department?.department_name || null);

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
  const { token, removeToken } = useAuth();
  const { storeID, removeStoreID } = useStore();
  const { isPublicOn } = usePublic();

  // 이미지 모달
  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  // 이벤트 스위치를 눌렀을 때 이벤트 모달을 표시
  const toggleEventOn = () => {
    setShowEventAlertModal(true);
  };

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

  // 초기 사용자 정보 가져오는 함수
  useEffect(() => {
    if (token && storeID) {
      fetchPublicUser({ storeID }, token, setUserData, setErrorMessage, setShowErrorMessageModal);
    }
  }, [token, storeID]);

  useEffect(() => {
    if (userData) {
      //console.log("userData : ", userData);
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL; // 환경 변수에서 URL 가져오기
      setProfileImage(`${mediaUrl}${userData.profile_photo}`)
    }
  }, [userData]);

  // 데이터 변경 여부를 감지
  useEffect(() => {
    if (userData && initialData) {
      const hasChanged = (
        userData.name !== initialData.name ||
        userData.email !== initialData.email ||
        userData.phoneNumber !== initialData.phoneNumber
      );

      setIsChanged(hasChanged); // 변경 사항이 있으면 true 설정

    }
  }, [userData, initialData]);


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
      const response = await fetch(`${config.apiDomain}/public/user-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ marketing: status })
      });

      if (!response.ok) {
        throw new Error('알림 설정 변경에 실패하였습니다.');
      }

      const data = await response.json();
      setMessage("알림 설정이 변경되었습니다.");
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
        const response = await fetch(`${config.apiDomain}/public/update-profile-photo/`, {
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
    try {
      const response = await fetch(`${config.apiDomain}/public/update-profile-photo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ profile_photo: "default" }),  // 기본 이미지 트리거로 "default" 사용
      });

      if (!response.ok) {
        throw new Error('Failed to update profile image');
      }

      const data = await response.json();
      setProfileImage(`${process.env.NEXT_PUBLIC_MEDIA_URL}${data.profile_photo_url}`);
      setMessage(data.message);
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error updating profile image:', error);
      setErrorMessage(error.message);
      setShowErrorMessageModal(true);
    }

    toggleImageModal();
  };

  const handleUserDataChange = (updatedData) => {
    setUserData(updatedData); // `UserProfileForm`에서 전달된 데이터로 업데이트
    //console.log("Updated userData:", updatedData);
  };

  // 변경 사항 저장 처리 함수
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/public/user-profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
       body: JSON.stringify(userData), // 수정된 데이터 전송
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData); // userData 상태 업데이트
        setInitialData(updatedData);
        setIsChanged(false); // 변경 사항 초기화
        setMessage("프로필 변경에 성공하였습니다.");
        setShowMessageModal(true);
      } else {
        setErrorMessage("프로필 변경에 실패하였습니다.");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("프로필 변경에 실패하였습니다.");
      setShowErrorMessageModal(true);
    }
  };

  // QR 코드 생성 처리 함수
  const handleGenerateQrCode = async () => {
    try {
      const response = await fetch(`${config.apiDomain}/public/generate-qr-code/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: storeID }), // ID 전송
      });

      if (!response.ok) {
        setErrorMessage('QR 코드 생성에 실패하였습니다.');
        setShowErrorMessageModal(true);
        return;
      }

      const data = await response.json();

      // 백엔드에서 받은 QR 코드 URL을 설정합니다.
      setQrUrl(data.qr_code_url); // QR 코드 URL을 새로운 경로로 설정
      setShowQrCode(true); // QR 코드 표시 여부를 true로 설정
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
      downloadLink.download = `${userData.business_name}_qr_code.png`; // 파일 이름 설정
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
      const response = await fetch(`${config.apiDomain}/public/deactivate-account/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessage("회원탈퇴가 완료되었습니다.");
        setShowMessageModal(true);
        removeToken();
        removeStoreID();
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
    <div className="bg-violet-50 flex flex-col items-center justify-center relative font-sans min-h-screen">
      <div className="bg-white p-8 my-4 rounded-lg shadow-lg max-w-sm w-full text-center relative">
        <div className='flex justify-between items-center'>
          <ChevronLeft
            className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
            onClick={() => router.back()} // 뒤로가기 버튼
          />
          <p className='font-semibold mt-2.5'> </p>
          <button
            className={`font-semibold text-lg ${isChanged ? 'text-indigo-500' : 'text-gray-500'}`}
            onClick={handleSaveChanges}
            disabled={!isChanged}
          >
            <p style={{ fontFamily: "NanumSquareExtraBold" }}>완료</p>
          </button>
        </div>

        {/* 프로필 이미지 섹션 */}
        <div className="mb-4 relative">
          <img
            src={profileImage}
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
        {
          userData && (
            <UserProfileForm
              isPublicOn={isPublicOn}
              token={token}
              storeID={storeID}
              userData={userData} // 유효한 userData만 전달
              onUpdateUserData={handleUserDataChange}
            />
          )
        }


        {/* QR 코드 섹션 */}
        <QrCodeSection
          isPublicOn={isPublicOn}
          token={token}
          storeID={storeID}
          userData={userData}
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
            <div className="modal-content bg-white p-6 rounded-lg text-center" style={{ width: '380px', position: 'relative' }}>
              <button
                onClick={toggleImageModal}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="bg-indigo-500 rounded-full text-white p-1" />
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

        {/* 이벤트 모달 */}
        <EventAlertModal
          show={showEventAlertModal}
          onClose={handleEventAlertModalClose}
        />

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
    </div>
  );
};

export default MyPagePublic;