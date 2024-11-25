import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { X, Image } from 'lucide-react';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import { useAuth } from '../contexts/authContext';
import { fetchStoreData } from '../fetch/fetchStoreData';
import StoreInfoEdit from '../components/storeInfoEdit';
import StoreHourEdit from '../components/storeHourEdit';
import AddMenuModal from '../components/addMenuModal';
import ViewMenuModal from '../components/viewMenuModal';
import ModalMSG from '../components/modalMSG';
import ModalErrorMSG from '../components/modalErrorMSG';
import config from '../../config';
import { useStore } from '../contexts/storeContext';

const ChangeInfo = ({ initialData }) => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [storeData, setStoreData] = useState('');
  const [isOwner, setIsOwner] = useState('');
  const [slug, setStoreSlug] = useState('');
  const [storeName, setStoreName] = useState(''); // 매장 이름 상태
  const [storeIntroduction, setStoreIntroduction] = useState(''); // 매장 소개 상태
  const [storeCategory, setStoreCategory] = useState(''); // 매장 종류 상태
  const [storeHours, setStoreHours] = useState(''); // 영업 시간 상태
  const [menuPrices, setMenuPrices] = useState([]); // 메뉴 가격 리스트 상태
  const [storeAddress, setStoreAddress] = useState(''); // 매장 주소 상태
  const [storeTel, setStoreTel] = useState(''); // 매장 전화번호 상태
  const [storeInformation, setStoreInformation] = useState(''); // 매장 소개 상태
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [isStoreHourEditModalOpen, setIsStoreHourEditModalOpen] = useState(false);

  const [storeImage, setStoreImage] = useState(null); // 이미지 파일 상태
  const [previewImage, setPreviewImage] = useState(''); // 미리보기 URL 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달 열림/닫힘 상태
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [isViewMenuModalOpen, setIsViewMenuModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 열림/닫힘 상태
  const [editText, setEditText] = useState(''); // 수정 중인 텍스트
  const [currentEditElement, setCurrentEditElement] = useState(''); // 현재 수정 중인 요소
  const [currentMenuIndex, setCurrentMenuIndex] = useState(null); // 현재 수정 중인 메뉴 항목의 인덱스
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 모달 열림/닫힘 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 메시지 모달 열림/닫힘 상태
  const [message, setMessage] = useState(''); // 일반 메시지 상태
  const router = useRouter();

  // 비즈니스 종류 매핑
  const businessTypeMap = {
    'FOOD': '음식점',
    'RETAIL': '판매점',
    'UNMANNED': '무인매장',
    'OTHER': '기타'
  };

  useEffect(() => {
    if (storeData && typeof storeData === 'object') {
      const store = storeData.store;
  
      setStoreCategory(store.store_category || '');
      setStoreName(store.store_name || '');
      setStoreSlug(store.slug || '');
      setStoreIntroduction(store.store_introduction || '');
      setStoreHours(store.opening_hours || '');
      setStoreAddress(store.store_address || '');
      setStoreTel(store.store_tel || '');
      setStoreInformation(store.store_information || '');
  
      try {
        const parsedMenuPrice = JSON.parse(store.menu_price || '[]');
        setMenuPrices(parsedMenuPrice);
      } catch (error) {
        console.error("Error parsing menu_price:", error);
      }
    }
    // 의존성 배열에 빈 배열을 사용하여 컴포넌트 마운트 시 한 번만 실행
  }, []);
  

  // 매장 정보 가져오기
useEffect(() => {
  if (storeID && token) {
    setIsOwner(true);
    fetchStoreData(
      { storeID },
      token,
      (data) => {
        const store = data.store;
        setStoreData(data);
        setStoreCategory(store.store_category || '');
        setStoreName(store.store_name || '');
        setStoreSlug(store.slug || '');
        setStoreIntroduction(store.store_introduction || '');
        setStoreHours(store.opening_hours || '');
        setStoreAddress(store.store_address || '');
        setStoreTel(store.store_tel || '');
        setStoreInformation(store.store_information || '');

        const bannerPath = store.banner || '';
      const storeImageUrl = bannerPath
        ? bannerPath.startsWith('/media/')
          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${bannerPath}`
          : `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/${bannerPath.replace(/^\/+/, '')}`
        : '/chatbot.png'; // 기본 이미지 경로 설정            

      //console.log('storeImageUrl : ', storeImageUrl);
      setPreviewImage(storeImageUrl); // 배너 이미지 미리보기 설정

        try {
          const parsedMenuPrice = JSON.parse(store.menu_price || '[]');
          setMenuPrices(parsedMenuPrice);
        } catch (error) {
          console.error("Error parsing menu_price:", error);
        }
      },
      setErrorMessage,
      setShowErrorMessageModal,
      isOwner
    ).finally(() => setIsLoading(false));
  }
}, [storeID, token, isOwner]);

  // 로딩 중일 때 보여줄 UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl font-bold">로딩 중...</p>
      </div>
    );
  }

  const openStoreHourEditModal = () => {
    setIsStoreHourEditModalOpen(true);
  };

  const closeStoreHourEditModal = () => {
    setIsStoreHourEditModalOpen(false);
  };

  const handleStoreHoursSave = (updatedHours) => {
    setStoreHours(updatedHours); // 영업 시간 업데이트
  };
  const handleStoreHoursDelete = () => {
    setStoreHours(''); // storeHours 초기화
  };

  // 이미지 모달 열기 함수
  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  // 이미지 모달 닫기 함수
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  // 수정 모달 열기 함수
  const openEditModal = (elementId, index = null) => {
    setCurrentEditElement(elementId);
    setCurrentMenuIndex(index);
    setEditText(
      elementId === 'storeName' ? storeName :
        elementId === 'storeIntroduction' ? storeIntroduction :
          elementId === 'storeCategory' ? storeCategory :
            elementId === 'storeHours' ? storeHours :
              elementId === 'storeAddress' ? storeAddress :
                elementId === 'storeTel' ? storeTel :
                  elementId === 'storeInformation' ? storeInformation :
                    index !== null ? menuPrices[index] : ''
    );
    setIsEditModalOpen(true);
  };

  // 수정 모달 닫기 함수
  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  // 이미지를 선택하고 파일과 미리보기 URL을 설정하는 함수
  const chooseImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setStoreImage(file); // 파일 객체 저장
        setPreviewImage(URL.createObjectURL(file)); // 미리보기 URL 설정
        closeImageModal();
      }
    };

    input.click();
  };

  // 기본 이미지를 설정하는 함수
  const applyDefaultImage = () => {
    setPreviewImage('/chatbot.png'); // 미리보기 URL 변경
    setStoreImage(null); // 파일을 null로 설정
    closeImageModal();
  };

  // 변경 사항 저장 함수
  const saveChanges = () => {
    if (editText.trim() !== '') {
      if (currentEditElement === 'storeName') {
        setStoreName(editText);
      } else if (currentEditElement === 'storeIntroduction') {
        setStoreIntroduction(editText);
      } else if (currentEditElement === 'storeCategory') {
        setStoreCategory(editText);
      } else if (currentEditElement === 'storeAddress') {
        setStoreAddress(editText);
      } else if (currentEditElement === 'storeTel') {
        setStoreTel(editText);
      } else if (currentEditElement === 'storeInformation') {
        setStoreInformation(editText)
      } else if (currentEditElement === 'menuPrices' && currentMenuIndex !== null) {
        const updatedMenuPrices = [...menuPrices];
        updatedMenuPrices[currentMenuIndex] = editText;
        setMenuPrices(updatedMenuPrices);
      } else if (currentEditElement === 'menuPrices') {
        setMenuPrices([...menuPrices, editText]);
      }
    }
    closeEditModal();
  };

  // 삭제 함수
  const deleteElement = () => {
    if (currentEditElement === 'storeName') {
      setStoreName('');
    } else if (currentEditElement === 'storeIntroduction') {
      setStoreIntroduction('');
    } else if (currentEditElement === 'storeCategory') {
      setStoreCategory('');
    } else if (currentEditElement === 'storeAddress') {
      setStoreAddress('');
    } else if (currentEditElement === 'storeTel') {
      setStoreTel('');
    } else if (currentEditElement === 'storeInformation') {
      setStoreInformation('');
    } else if (currentEditElement === 'menuPrices' && currentMenuIndex !== null) {
      const updatedMenuPrices = menuPrices.filter((_, index) => index !== currentMenuIndex);
      setMenuPrices(updatedMenuPrices);
    }
    closeEditModal();
  };

  // 모든 변경 사항 저장 함수
  const saveAllChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('store_category', storeCategory || '');
      formData.append('store_introduction', storeIntroduction || '');
      formData.append('store_name', storeName || '');
      formData.append('opening_hours', storeHours || '');
      formData.append('store_tel', storeTel || '');
      formData.append('store_address', storeAddress || '');
      formData.append('store_information', storeInformation || '');

      // 이미지 파일 추가
      if (storeImage) {
        formData.append('banner', storeImage); // storeImage는 파일 객체여야 합니다.
      }

      const response = await fetch(`${config.apiDomain}/api/user-stores/${storeId}/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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
      console.error('Error saving changes:', error);
      setErrorMessage('정보 저장에 실패했습니다. 다시 시도해주세요.');
      setShowErrorMessageModal(true);
    }
  };

  // 메시지 모달 닫기 & 초기화
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

  // 에러 메시지 모달 닫기 & 초기화
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage('');
  };

  // AddMenuModal 열기
  const goToAddMenu = () => {
    setIsAddMenuModalOpen(true);
  };

  // AddMenuModal 닫기
  const closeAddMenuModal = () => {
    setIsAddMenuModalOpen(false);
  };

  // goToViewMenu 열기
  const goToViewMenu = () => {
    setIsViewMenuModalOpen(true);
  };

  // goToViewMenu 닫기
  const closeViewMenu = () => {
    setIsViewMenuModalOpen(false);
  };

  const goToModifyFeed = () => {
    router.push('/modifyFeed');
  };


  // storeCategory에 따라 메뉴 타이틀 설정
  const menuTitle = storeCategory === 'FOOD'
    ? '메뉴'
    : storeCategory === 'RETAIL' || storeCategory === 'UNMANNED' || storeCategory === 'OTHER'
      ? '상품'
      : '';

  return (
    <div className='flex flex-col h-full w-full bg-white'>
      <main className="flex flex-col flex-grow gap-3">
        {/* 배너 이미지 */}
        <div id='banner' className="relative h-auto "
          style={{ height: '45%', maxHeight: '200px' }}
        >
          <img
            id="storeImage"
            src={previewImage}
            className="w-full h-full object-cover "
            alt="Store Banner"
          />
          {/* 카메라 아이콘 */}
          <div
            className="camera-icon absolute bottom-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
            onClick={openImageModal}
          >
            <CameraAltIcon />
          </div>
        </div>

        <div id='store-info' className='bg-white px-4 py-2'>
          <StoreInfoEdit
            label="매장 이름"
            value={storeName}
            onEdit={openEditModal}
            elementId="storeName"
          />
          <StoreInfoEdit
            label="매장 소개"
            value={storeIntroduction}
            onEdit={openEditModal}
            elementId="storeIntroduction"
          />
          <StoreInfoEdit
            label="비즈니스 종류"
            value={businessTypeMap[storeCategory] || storeCategory}
            onEdit={openEditModal}
            elementId="storeCategory"
          />
          <StoreInfoEdit
            label="영업 시간"
            value={storeHours}
            onEdit={openStoreHourEditModal}
            elementId="storeHours"
          />
          <StoreInfoEdit
            label="매장 위치"
            value={storeAddress}
            onEdit={openEditModal}
            elementId="storeAddress"
          />
          <StoreInfoEdit
            label="매장 번호"
            value={storeTel}
            onEdit={openEditModal}
            elementId="storeTel"
          />
          <StoreInfoEdit
            label="매장 정보"
            value={storeInformation}
            onEdit={openEditModal}
            elementId="storeInformation"
          />
          <hr className="border-t-2 border-gray-300 w-full mt-4 " />
        </div>

        <div id='store-menu' className='flex flex-col space-y-2 px-4 flex-grow' >
          <p id="menuTitle" className="font-bold text-xl" style={{ fontFamily: "NanumSquareBold" }}>
            {menuTitle} 정보
          </p>
          <div className='flex flex-col space-y-1 px-2'>
            <div className='flex flex-row'>
              <AddIcon className='text-indigo-400 cursor-pointer mr-1 text-lg' onClick={goToAddMenu} />
              <button
                className='textAddIcon '
                onClick={goToAddMenu}>
                <p className='text-indigo-400 font-medium cursor-pointer text-lg'> {menuTitle} 추가</p>
              </button>
            </div>
            <div className='flex flex-row'>
              <SearchIcon className='text-indigo-400 cursor-pointer mr-1 text-lg' onClick={goToViewMenu} />
              <button
                className='textAddIcon '
                onClick={goToViewMenu}>
                <p className='text-indigo-400 font-medium cursor-pointer text-lg' > {menuTitle} 보기</p>
              </button>
            </div>

            <div className='flex flex-row'>
              <Image className='text-indigo-400 cursor-pointer mr-1 text-lg' onClick={goToModifyFeed} />
              <button
                className='textAddIcon '
                onClick={goToModifyFeed}>
                <p className='text-indigo-400 font-medium cursor-pointer text-lg' > 피드 추가</p>
              </button>
            </div>

          </div>
        </div>

        {/* 저장 버튼 */}
        <div className='flex bg-white items-center justify-center h-auto mt-auto'>
          <button
            onClick={saveAllChanges}
            className="w-48 py-2 bg-indigo-500 text-white text-center block rounded-full cursor-pointer"
            style={{ marginBottom: '10px' }}
          >
            <p className='font-semibold text-lg '>모든 변경사항 저장</p>
          </button>
        </div>
      </main>

      {/* 배너 이미지 변경 모달 */}
      {isImageModalOpen && (
        <div
          id="imageModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center relative"
            style={{ width: '350px', position: 'relative' }}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Close"
            >
              <X className="bg-indigo-500 rounded-full text-white p-1" />
            </button>
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

      {/* 매장 정보 변경 모달 */}
      {isEditModalOpen && (
        <div
          id="editModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center"
            style={{ width: '380px', position: 'relative' }}
          >
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Close"
            >
              <X className="bg-indigo-500 rounded-full text-white p-1" />
            </button>
            <h2 className="text-2xl font-bold mb-4">내용 수정</h2>
            {currentEditElement === 'storeCategory' ? (
              <select
                className="w-full h-12 p-2 border border-gray-300 rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              >
                <option value=""> 종류 선택</option>
                <option value="FOOD">음식점</option>
                <option value="RETAIL">판매점</option>
                <option value="UNMANNED">무인매장</option>
                <option value="OTHER">기타</option>
              </select>
            ) : (
              <textarea
                id="editTextArea"
                className="w-full h-32 p-2 border border-gray-300 rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            )}

            <div className='flex flex-row'>
              <button
                onClick={saveChanges}
                className="block w-full py-2 mt-4 text-blue-400 rounded"
              >
                확인
              </button>
              <button
                onClick={deleteElement} // 삭제 함수 호출
                className="block w-full py-2 mt-4 text-red-400 rounded"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* StoreHourEdit 모달 */}
      <StoreHourEdit
        isOpen={isStoreHourEditModalOpen}
        onClose={closeStoreHourEditModal}
        onSave={handleStoreHoursSave}
        onDelete={handleStoreHoursDelete}
      />

      {/* AddMenuModal 모달 */}
      <AddMenuModal
        isOpen={isAddMenuModalOpen}
        onClose={closeAddMenuModal}
        onSave={(newMenu) => {
          setMenuPrices([...menuPrices, newMenu]);
        }}
        slug={slug}
        menuTitle={menuTitle}
      />

      {/* ViewMenuModal 모달 */}
      <ViewMenuModal
        isOpen={isViewMenuModalOpen}
        onClose={closeViewMenu}
        slug={slug}
        menuTitle={menuTitle}
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
  );
};

export default ChangeInfo;
