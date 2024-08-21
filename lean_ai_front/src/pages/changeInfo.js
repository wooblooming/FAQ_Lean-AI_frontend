import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { useStore } from '../contexts/storeContext';

export default function ChangeInfo() {
  const { storeName, setStoreName, storeHours, setStoreHours, menuPrices, setMenuPrices, storeImage, setStoreImage } = useStore();

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [currentEditElement, setCurrentEditElement] = useState(null);

  // 데이터를 API에서 가져오는 함수
  const fetchStoreInfo = useCallback(async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/storeinfo/1/');
      const data = response.data;
      setStoreName(data.store_name);
      setStoreHours(data.store_hours);
      setMenuPrices(data.menu_prices);
      setStoreImage(data.store_image);
    } catch (error) {
      console.error("Error fetching store info:", error);
    }
  }, [setStoreName, setStoreHours, setMenuPrices, setStoreImage]);

  // 컴포넌트가 마운트될 때 데이터를 가져옴
  useEffect(() => {
    fetchStoreInfo();
  }, [fetchStoreInfo]);

  // 모달을 여는 함수
  const openImageModal = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  // 모달을 닫는 함수
  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

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
  }, [setStoreImage, closeImageModal]);

  // 기본 이미지를 설정하는 함수
  const applyDefaultImage = useCallback(() => {
    setStoreImage('/test_image.png');
    closeImageModal();
  }, [setStoreImage, closeImageModal]);

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
        setStoreName(editText);
        break;
      case 'storeHours':
        setStoreHours(editText);
        break;
      case 'menuPrices':
        setMenuPrices(editText);
        break;
      default:
        break;
    }
    closeEditModal();
  }, [currentEditElement, editText, setStoreName, setStoreHours, setMenuPrices, closeEditModal]);

  // 모든 변경사항을 서버에 저장하는 함수
  const saveAllChanges = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('store_name', storeName);
      formData.append('store_hours', storeHours);
      formData.append('menu_prices', menuPrices);

      if (storeImage) {
        if (storeImage instanceof File) {
          formData.append('store_image', storeImage);
        } else if (typeof storeImage === 'string') {
          if (storeImage.startsWith('data:') || storeImage.startsWith('blob:')) {
            const response = await fetch(storeImage);
            const blob = await response.blob();
            formData.append('store_image', blob, 'image.jpg');
          } else {
            // 이미 서버에 있는 이미지 URL인 경우, 변경되지 않았으므로 전송하지 않음
          }
        }
      }

      const response = await axios.put('http://127.0.0.1:8000/api/storeinfo/1/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Store info updated:', response.data);
      alert('정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('Error updating store info:', error);
      alert('정보 저장에 실패했습니다.');
    }
  }, [storeName, storeHours, menuPrices, storeImage]);

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
    </div>
  );
}