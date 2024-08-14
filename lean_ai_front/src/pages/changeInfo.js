import { useState, useCallback } from 'react';
import Link from 'next/link';
// Material-UI의 Edit 및 CameraAlt 아이콘 임포트
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

export default function StoreIntroPage() {
  const [storeName, setStoreName] = useState('무물 떡볶이');
  const [storeHours, setStoreHours] = useState('영업 시간 : 9:00 ~ 18:00');
  const [menuPrices, setMenuPrices] = useState(
    '메뉴 및 가격\n매운 떡볶이 : 3000원\n로제 떡볶이 : 5000원\n마라 떡볶이 : 5000원\n날치알 주먹밥 : 2500원\n각 종 튀김 : 700원'
  );
  const [storeImage, setStoreImage] = useState('/banner_1.png');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [currentEditElement, setCurrentEditElement] = useState(null);

  // 모달을 여는 함수 - useCallback으로 메모이제이션
  const openImageModal = useCallback(() => {
    setIsImageModalOpen(true);
  }, []);

  // 모달을 닫는 함수 - useCallback으로 메모이제이션
  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

  // 이미지 선택 함수
  const chooseImage = useCallback(() => {
    closeImageModal();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (event) {
      if (event.target.files && event.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          setStoreImage(e.target.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    };
    input.click();
  }, [closeImageModal]);

  // 기본 이미지를 설정하는 함수
  const applyDefaultImage = useCallback(() => {
    closeImageModal();
    setStoreImage('/test_image.png');
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
  }, [currentEditElement, editText, closeEditModal]);

  return (
    <div className="bg-white flex flex-col items-center min-h-screen overflow-y-auto relative">
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
              src={storeImage}
              className="mx-auto mb-4 w-64 h-52 object-contain cursor-pointer"
              alt="Store"
            />
            {/* 이미지 변경 아이콘 */}
            <div
              className="camera-icon absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
              onClick={openImageModal}
            >
              {/* Material-UI의 CameraAlt 아이콘 사용 */}
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
            {/* Material-UI의 Edit 아이콘 사용 */}
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
      <Link href="/myPage">
        <button className="mt-4 w-48 py-2 border border-black text-center block rounded-full cursor-pointer">
          확인
        </button>
      </Link>

      {/* 이미지 변경 모달 */}
      {isImageModalOpen && (
        <div
          id="imageModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="font-bold text-lg mb-4">배너 사진 설정</h2>
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
            <h2 className="font-bold text-lg mb-4">내용 수정</h2>
            <textarea
              id="editTextArea"
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button
              onClick={saveChanges}
              className="block w-full py-2 mt-4 text-blue-500"
            >
              저장
            </button>
            <button
              onClick={closeEditModal}
              className="block w-full py-2 text-red-500"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
