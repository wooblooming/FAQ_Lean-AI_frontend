import { useState, useEffect } from 'react';

const useMyPage = ({ token, removeToken, storeID, removeStoreID , fetchUserData, updateProfileUrl, updateProfilePhotoUrl, generateQrCodeUrl, deactivateAccountUrl }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showEventAlertModal, setShowEventAlertModal] = useState(false);
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [snsList, setSnsList] = useState([
    { name: 'kakao', displayName: '카카오', isConnected: false },
    { name: 'naver', displayName: '네이버', isConnected: false },
    { name: 'google', displayName: '구글', isConnected: false },
  ]);

  const [userData, setUserData] = useState({});
  const [profileImage, setProfileImage] = useState('');
  const [isEventOn, setIsEventOn] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [message, setMessage] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [initialData, setInitialData] = useState({});


  // 초기 사용자 정보 가져오기
  useEffect(() => {
    if (token && storeID) {
      fetchUserData({ storeID }, token, setUserData, setErrorMessage, setShowErrorMessageModal);
    }
  }, [token, storeID]);

  useEffect(() => {
    if (userData) {
      if (userData.profile_photo === "") {
        setProfileImage('/profile_default_img.jpg'); // /public 밑에 있는 기본 이미지 경로
      }
      else {
        const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
        setProfileImage(`${mediaUrl}${userData.profile_photo}`);
      }

    }
  }, [userData]);

  useEffect(() => {
    if (userData && initialData) {
      const hasChanged = (
        userData.name !== initialData.name ||
        userData.email !== initialData.email ||
        userData.phoneNumber !== initialData.phoneNumber
      );
      setIsChanged(hasChanged);
    }
  }, [userData, initialData]);

  const toggleImageModal = () => setIsImageModalOpen(!isImageModalOpen);
  const toggleQrCode = () => setShowQrCode(!showQrCode);

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

  const handleEventAlertModalClose = async (confirmed) => {
    setShowEventAlertModal(false);
    if (confirmed) {
      setIsEventOn(true);
      await updateMarketingStatus('Y');
    } else {
      setIsEventOn(false);
      await updateMarketingStatus('N');
    }
  };

  const updateMarketingStatus = async (status) => {
    try {
      const response = await fetch(updateProfileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ marketing: status }),
      });

      if (!response.ok) throw new Error('알림 설정 변경에 실패하였습니다.');

      const data = await response.json();
      setMessage('알림 설정이 변경되었습니다.');
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorMessageModal(true);
    }
  };

  const chooseImage = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('profile_photo', file);

      try {
        const response = await fetch(updateProfilePhotoUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to upload image');

        const data = await response.json();
        //console.log("data : ", data);
        setMessage('프로필 이미지를 변경하였습니다.');
        setShowMessageModal(true);
        setProfileImage(`${process.env.NEXT_PUBLIC_MEDIA_URL}${data.profile_photo_url}`);
      } catch (error) {
        setErrorMessage('프로필 이미지 변경에 실패했습니다.');
        setShowErrorMessageModal(true);
      }
    }
    toggleImageModal();
  };

  const applyDefaultImage = async () => {
    try {
      // 기본 이미지 경로
      const defaultImagePath = '/profile_default_img.jpg'; // /public 경로의 파일

      // 기본 이미지 파일 생성 (File 객체)
      const defaultImage = new File(
        [await fetch(defaultImagePath).then((res) => res.blob())],
        'profile_default_img.jpg', // 파일 이름 설정
        { type: 'image/jpeg' } // MIME 타입 설정
      );

      // FormData에 파일 추가
      const formData = new FormData();
      formData.append('profile_photo', defaultImage);
      formData.append('type', 'defaultProfile');


      // 백엔드로 전송
      const response = await fetch(updateProfilePhotoUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
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
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(updateProfileUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setInitialData(updatedData);
        setIsChanged(false);
        setMessage('프로필 변경에 성공하였습니다.');
        setShowMessageModal(true);
      } else {
        setErrorMessage('프로필 변경에 실패하였습니다.');
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage('프로필 변경에 실패하였습니다.');
      setShowErrorMessageModal(true);
    }
  };

  const handleGenerateQrCode = async () => {
    try {
      const response = await fetch(generateQrCodeUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ store_id: storeID }),
      });

      if (!response.ok) throw new Error('QR 코드 생성에 실패하였습니다.');

      const data = await response.json();
      //console.log('data : ', data);
      setQrUrl(data.qr_code_url);
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


  // 탈퇴 확인 모달을 열기 위한 함수
  const handleAccountDeletionClick = () => {
    setShowDeleteModal(true);
  };


  const handleConfirmAccountDeletion = async () => {
    setShowDeleteModal(false); // 모달 닫기
    try {
      const response = await fetch(deactivateAccountUrl, {
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


  return {
    userData, handleUserDataChange, profileImage,
    toggleImageModal, chooseImage, applyDefaultImage, isImageModalOpen,
    showQrCode, qrUrl, setQrUrl, handleGenerateQrCode, handleDownloadQrCode, toggleQrCode,
    isEventOn, toggleEventOn, showEventAlertModal, handleEventAlertModalClose,
    handleConfirmAccountDeletion, handleAccountDeletionClick, setShowDeleteModal, showDeleteModal,
    handleSaveChanges, isChanged,
    showMessageModal, message, handleMessageModalClose,
    showErrorMessageModal, errorMessage, handleErrorMessageModalClose
  };
};

export default useMyPage;
