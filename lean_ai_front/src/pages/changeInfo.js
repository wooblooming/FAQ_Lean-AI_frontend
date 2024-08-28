import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ModalMSG from '../components/modalMSG'; // 에러메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러메시지 모달 컴포넌트
import config from '../../config';


export default function ChangeInfo({ }) {
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

  const fetchStoreInfo = useCallback(async () => {
    try {
      const response = await fetch(`${config.localhosts}/api/user-stores/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        throw new Error('첫 번째 업장 정보를 불러오는 데 실패했습니다.');
      }

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const firstStore = data[0];
        setStoreId(firstStore.store_id || null);
        setStoreName(firstStore.store_name || "");
        setStoreHours(firstStore.opening_hours || "");
        setMenuPrices(firstStore.menu_price || "");
        const bannerPath = firstStore.banner || "";
        const storeImageUrl = bannerPath.startsWith("/media/") 
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${bannerPath}` 
            : `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/${bannerPath.replace(/^\/+/, '')}`;
        
        setStoreImage(storeImageUrl);
      } else {
        throw new Error('스토어 ID를 가져오지 못했습니다.');
      }
    } catch (error) {
      setErrorMessage('첫 번째 업장 정보를 불러오는 데 실패했습니다.');
      setShowErrorMessageModal(true);
    }
  }, []);

  useEffect(() => {
    fetchStoreInfo();
  }, [fetchStoreInfo]);

  const openImageModal = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  const chooseImage = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setStoreImage(file); 
        closeImageModal();
      }
    };

    input.click();
  }, [closeImageModal]);

  const applyDefaultImage = useCallback(() => {
    setStoreImage('/test_image.png');
    closeImageModal();
  }, [closeImageModal]);

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

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

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

  const saveAllChanges = useCallback(async () => {
    try {
      const formData = new FormData();
  
      formData.append('store_name', storeName || "");       
      formData.append('opening_hours', storeHours || "");   
      formData.append('menu_price', menuPrices || "");      
  
      if (storeImage) {
        if (storeImage instanceof File) {
          formData.append('banner', storeImage);
        } else if (typeof storeImage === 'string') {
          const response = await fetch(storeImage);
          const blob = await response.blob();
          formData.append('banner', blob, 'image.jpg');
        } else {
          console.error('Invalid image format');
          return;
        }
      }
  
      const response = await fetch(`${config.localhosts}/api/user-stores/${storeId}/`, {
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
      setMessage('정보가 성공적으로 저장되었습니다.');
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage('정보 저장에 실패했습니다. 다시 시도해주세요.');
      setShowErrorMessageModal(true);
    }
  }, [storeId, storeName, storeHours, menuPrices, storeImage]);

  return (
    <div className="bg-white flex flex-col items-center min-h-screen overflow-y-auto relative font-sans">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center mb-2">
        <div className="flex items-center justify-center mb-4">
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
            <img
              id="storeImage"
              src={storeImage instanceof File ? URL.createObjectURL(storeImage) : storeImage}
              className="mx-auto mb-4 w-64 h-52 object-contain cursor-pointer"
              alt="Store"
            />
            <div
              className="camera-icon absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
              onClick={openImageModal}
            >
              <CameraAltIcon />
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <p id="storeName" className="font-bold text-2xl">
            {storeName}
          </p>
          <button
            onClick={() => openEditModal('storeName')}
            className="ml-2 text-gray-500"
          >
            <EditIcon />
          </button>
        </div>
      </div>
      <div className="bg-sky-100 flex flex-col items-center text-center mb-4 w-64 px-2 relative">
        <p id="storeHours" className="mt-4 mb-4 text-xl whitespace-pre-line">
          {storeHours}
        </p>
        <button
          onClick={() => openEditModal('storeHours')}
          className="absolute top-2 right-2 text-gray-500"
        >
          <EditIcon />
        </button>
      </div>
      <div className="bg-sky-100 flex flex-col items-center text-center w-64 px-2 relative">
        <p id="menuPrices" className="mt-4 mb-4 text-xl whitespace-pre-line">
          {menuPrices}
        </p>
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