import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ModalMSG from '../components/modalMSG'; // 에러메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트

export default function ChangeInfo({ }) {
  // 상태 관리
  const [storeId, setStoreId] = useState(null);
  const [storeName, setStoreName] = useState('');
  const [storeHours, setStoreHours] = useState('');
  const [menuPrices, setMenuPrices] = useState('');
  const [storeImage, setStoreImage] = useState('');

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [currentEditElement, setCurrentEditElement] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);

  // 첫 번째 스토어의 데이터를 API에서 가져오는 함수
  const fetchStoreInfo = useCallback(async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user-stores/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      console.log("응답 상태 코드:", response.status);  // 상태 코드 출력
  
      if (!response.ok) {
        const errorDetail = await response.text();  // 오류 응답 본문 출력
        console.error("오류 응답 본문:", errorDetail);
        throw new Error('첫 번째 업장 정보를 불러오는 데 실패했습니다.');
      }
  
      const data = await response.json();
      console.log("API 응답 데이터:", data);  // 데이터 구조 확인
  
      // store_id 필드를 올바르게 참조
      if (data && data.store_id) {
        setStoreId(data.store_id);  // store_id를 API 응답에서 가져와 설정
        setStoreName(data.store_name || ""); // 빈 문자열로 설정
        setStoreHours(data.opening_hours || ""); // 빈 문자열로 설정
        setMenuPrices(data.menu_price || ""); // 빈 문자열로 설정
        setStoreImage(data.banner || ""); // 빈 문자열로 설정
      } else {
        throw new Error('스토어 ID를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error("Error fetching store info:", error);
      setErrorMessage('첫 번째 업장 정보를 불러오는 데 실패했습니다.');
      setShowErrorMessageModal(true);
    }
  }, []);

  // 컴포넌트가 마운트될 때 첫 번째 스토어의 데이터를 가져옴
  useEffect(() => {
    fetchStoreInfo();
  }, [fetchStoreInfo]);

  // 모달을 여닫는 함수들
  const openImageModal = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage(''); // 에러 메시지 초기화
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage(''); // 에러 메시지 초기화
  };

  // 이미지 선택 함수
  const chooseImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setStoreImage(file);  // File 객체를 직접 저장
        closeImageModal();
      }
    };

    input.click();
  }, [closeImageModal]);

  // 기본 이미지를 설정하는 함수
  const applyDefaultImage = useCallback(() => {
    setStoreImage('/test_image.png');
    closeImageModal();
  }, [closeImageModal]);

  // 텍스트 수정 모달을 여는 함수
  const openEditModal = useCallback((elementId) => {
    setCurrentEditElement(elementId);
    setEditText(
      elementId === 'storeName'
        ? storeName
        : elementId === 'storeHours'
          ? storeHours
          : menuPrices
    );
    setIsEditModalOpen(true);
  }, [storeName, storeHours, menuPrices]);

  // 텍스트 수정 모달을 닫는 함수
  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  // 수정된 텍스트를 저장하는 함수
  const saveChanges = useCallback(() => {
    switch (currentEditElement) {
      case 'storeName':
        if (!editText.trim()) {
          setErrorMessage('업장 이름을 입력해주세요.');
          setShowErrorMessageModal(true);
          return;
        }
        setStoreName(editText);
        break;
      case 'storeHours':
        if (!editText.trim()) {
          setErrorMessage('영업 시간을 입력해주세요.');
          setShowErrorMessageModal(true);
          return;
        }
        setStoreHours(editText);
        break;
      case 'menuPrices':
        if (!editText.trim()) {
          setErrorMessage('메뉴 및 가격 정보를 입력해주세요.');
          setShowErrorMessageModal(true);
          return;
        }
        setMenuPrices(editText);
        break;
      default:
        break;
    }
    closeEditModal();
  }, [currentEditElement, editText]);

  // 모든 변경사항을 서버에 저장하는 함수
  const saveAllChanges = useCallback(async () => {
    try {
      const formData = new FormData();
  
      formData.append('store_name', storeName || "");       
      formData.append('opening_hours', storeHours || "");   
      formData.append('menu_price', menuPrices || "");      
  
      if (storeImage) {
        if (storeImage instanceof File) {
          formData.append('banner', storeImage);  // 파일 객체로 banner에 추가
        } else if (typeof storeImage === 'string') {
          // 이미 문자열로 된 이미지를 파일로 변환하여 업로드하는 로직
          const response = await fetch(storeImage);
          const blob = await response.blob();
          formData.append('banner', blob, 'image.jpg');
        } else {
          console.error('Invalid image format');
          return;
        }
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/user-stores/${storeId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('정보 저장에 실패했습니다.');
      }
  
      const result = await response.json();
      console.log('Store info updated:', result);
      setMessage('정보가 성공적으로 저장되었습니다.');
      setShowMessageModal(true);
    } catch (error) {
      console.error('Error updating store info:', error);
      setErrorMessage('정보 저장에 실패했습니다. 다시 시도해주세요.');
      setShowErrorMessageModal(true);
    }
  }, [storeId, storeName, storeHours, menuPrices, storeImage]);
  


  return (
    <div className="bg-white flex flex-col items-center min-h-screen overflow-y-auto relative font-sans">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center mb-2">
        <div className="flex items-center justify-center mb-4">
          {/* 뒤로가기 버튼 */}
          <Link href="/myPage" className="text-gray-500 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>

          <div className="image-container relative inline-block">
            {/* 가게 이미지 */}
            <img
              id="storeImage"
              src={storeImage instanceof File ? URL.createObjectURL(storeImage) : storeImage}
              className="mx-auto mb-4 w-64 h-52 object-contain cursor-pointer"
              alt="Store"
            />
            {/* 이미지 변경 아이콘 */}
            <div
              className="camera-icon absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
              onClick={openImageModal}
            >
              <CameraAltIcon />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          {/* 가게 이름 */}
          <p id="storeName" className="font-bold text-2xl">
            {storeName}
          </p>
          {/* 가게 이름 수정 아이콘 버튼 */}
          <button
            onClick={() => openEditModal('storeName')}
            className="ml-2 text-gray-500"
          >
            <EditIcon />
          </button>
        </div>
      </div>
      <div className="bg-sky-100 flex flex-col items-center text-center mb-4 w-64 px-2 relative">
        {/* 영업 시간 및 위치 */}
        <p id="storeHours" className="mt-4 mb-4 text-xl whitespace-pre-line">
          {storeHours}
        </p>
        {/* 영업 시간 및 위치 수정 아이콘 버튼 */}
        <button
          onClick={() => openEditModal('storeHours')}
          className="absolute top-2 right-2 text-gray-500"
        >
          <EditIcon />
        </button>
      </div>
      <div className="bg-sky-100 flex flex-col items-center text-center w-64 px-2 relative">
        {/* 메뉴 및 가격 */}
        <p id="menuPrices" className="mt-4 mb-4 text-xl whitespace-pre-line">
          {menuPrices}
        </p>
        {/* 메뉴 및 가격 수정 아이콘 버튼 */}
        <button
          onClick={() => openEditModal('menuPrices')}
          className="absolute top-2 right-2 text-gray-500"
        >
          <EditIcon />
        </button>
      </div>
      <button
        onClick={saveAllChanges}
        className="mt-4 w-48 py-2 bg-blue-500 text-white text-center block rounded-full cursor-pointer"
      >
        모든 변경사항 저장
      </button>

      {/* 이미지 변경 모달 */}
      {isImageModalOpen && (
        <div
          id="imageModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">배너 사진 설정</h2>
            <button
              onClick={chooseImage}
              className="block w-full mb-2 py-2 text-black"
            >
              앨범에서 사진/동영상 선택
            </button>
            <button
              onClick={applyDefaultImage}
              className="block w-full py-2 text-black"
            >
              기본 이미지 적용
            </button>
            <button
              onClick={closeImageModal}
              className="block w-full py-2 mt-4 text-red-500"
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 텍스트 수정 모달 */}
      {isEditModalOpen && (
        <div
          id="editModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">내용 수정</h2>
            <textarea
              id="editTextArea"
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button
              onClick={saveChanges}
              className="block w-full py-2 mt-4 bg-blue-500 text-white rounded"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title=" "
      >
        <p style={{ whiteSpace: 'pre-line' }}>
          {message}
        </p>
        <div className="flex justify-center mt-4">
          <button onClick={handleMessageModalClose} className="text-white bg-blue-300 rounded-md px-4 py-2 font-normal border-l hover:bg-blue-500 ">
            확인
          </button>
        </div>

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
        <div className="flex justify-center mt-4">
          <button onClick={handleErrorMessageModalClose} className="text-white bg-blue-300 rounded-md px-4 py-2 font-normal border-l hover:bg-blue-500 ">
            확인
          </button>
        </div>
      </ModalErrorMSG>

    </div>
  );
}
