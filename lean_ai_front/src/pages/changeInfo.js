import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EditIcon from '../components/editIcon';
import AddIcon from '@mui/icons-material/Add';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SearchIcon from '@mui/icons-material/Search';
import AddMenuModal from '../components/addMenuModal';
import ViewMenuModal from '../components/viewMenuModal';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import config from '../../config';

const ChangeInfo = ({ initialData }) => {
  const [storeId, setStoreId] = useState(''); // 매장 ID 상태
  const [storeName, setStoreName] = useState(''); // 매장 이름 상태
  const [storeIntroduction, setStoreIntroduction] = useState(''); // 매장 소개 상태
  const [storeCategory, setStoreCategory] = useState(''); // 매장 종류 상태
  const [storeHours, setStoreHours] = useState(''); // 영업 시간 상태
  const [menuPrices, setMenuPrices] = useState([]); // 메뉴 가격 리스트 상태
  const [storeAddress, setStoreAddress] = useState(''); // 매장 주소 상태
  const [storeTel, setStoreTel] = useState(''); // 매장 전화번호 상태
  const [storeInformation, setStoreInformation] = useState(''); // 매장 소개 상태
  const [slug, setSlug] = useState('');

  const [storeImage, setStoreImage] = useState(null); // 이미지 파일 상태
  const [previewImage, setPreviewImage] = useState(''); // 미리보기 URL 상태
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // 이미지 모달 열림/닫힘 상태\
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

  const businessTypeMap = {
    'FOOD': '음식점',
    'RETAIL': '판매점',
    'UNMANNED': '무인매장',
    'PUBLIC': '공공기관',
    'OTHER': '기타'
  };

  // 매장 정보 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(`${config.apiDomain}/api/user-stores/`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.status === 401) {
          setErrorMessage('세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요.');
          setShowErrorMessageModal(true);
          sessionStorage.removeItem('token');
          return;
        }
        const data = await response.json(); // 서버에서 매장 정보 데이터 가져옴
        //console.log(data);

        if (data.length > 0) {
          setStoreName(data[0].store_name || '');
          setStoreIntroduction(data[0].store_introduction || '');
          setStoreCategory(data[0].store_category || '');
          setStoreHours(data[0].opening_hours || '');
          setStoreAddress(data[0].store_address || '');
          setStoreTel(data[0].store_tel || '');
          setStoreInformation(data[0].store_information || '');
          setSlug(data[0].slug || '');

          const bannerPath = data[0].banner || '';
          const storeImageUrl = bannerPath
            ? bannerPath.startsWith('/media/')
              ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${bannerPath}`
              : `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/${bannerPath.replace(/^\/+/, '')}`
            : '/chatbot.png'; // 기본 이미지 경로 설정            

          //console.log('storeImageUrl : ', storeImageUrl);
          setPreviewImage(storeImageUrl); // 배너 이미지 미리보기 설정
          setStoreId(data[0].store_id); // 매장 ID 설정
        } else {
          setErrorMessage('매장 정보를 찾을 수 없습니다.');
          setShowErrorMessageModal(true);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setErrorMessage('매장 정보를 불러오는 데 실패했습니다.');
        setShowErrorMessageModal(true);
      }
    };

    fetchData(); // 페이지가 로드될 때 데이터 가져오기
  }, [initialData]);

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
    setCurrentEditElement(elementId); // 수정할 요소 설정
    setCurrentMenuIndex(index); // 수정할 메뉴 인덱스 설정
    setEditText(
      elementId === 'storeName'
        ? storeName
        : elementId === 'storeIntroduction'
          ? storeIntroduction
          : elementId === 'storeCategory'
            ? storeCategory
            : elementId === 'storeHours'
              ? storeHours
              : elementId === 'storeAddress'
                ? storeAddress
                : elementId === 'storeTel'
                  ? storeTel
                  : elementId === 'storeInformation'
                    ? storeInformation
                    : index !== null
                      ? menuPrices[index]
                      : ''
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
      } else if (currentEditElement === 'storeHours') {
        setStoreHours(editText);
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
    } else if (currentEditElement === 'storeHours') {
      setStoreHours('');
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

  // 변경 사항 저장 함수
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

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage('');
  };

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

  // storeCategory에 따라 메뉴 타이틀 설정
  const menuTitle = storeCategory === 'FOOD'
    ? '메뉴'
    : storeCategory === 'RETAIL' || storeCategory === 'UNMANNED' || storeCategory === 'OTHER'
      ? '상품'
      : storeCategory === 'PUBLIC'
        ? '서비스'
        : '';

  return (
    <div className='flex flex-col h-full w-full bg-white font-sans'>
      <main  className="flex flex-col mt-1 flex-grow">
        {/* 배너 이미지 */}
        <div id='banner' className=" bg-white relative h-auto "
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

        <div id='store-info' className='bg-white p-4'>
          <div id="storeName" className="flex flex-row items-start mb-4 text-center">
            <p className="font-bold text-xl">
              {storeName}
            </p>
            <button
              onClick={() => openEditModal('storeName')}
              className="ml-2 text-gray-500 "
            >
              <EditIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <div id="introdution" className="flex flex-row items-start text-center ">
            <div className='flex flex-col items-start text-start'>
              <p className=" whitespace-pre font-semibold">
                매장소개 :
                <button
                  onClick={() => openEditModal('storeIntroduction')}
                  className="ml-px text-gray-500"
                >
                  <EditIcon style={{ width: '20px', height: '20px' }} />
                </button>
                <br />
              </p>
              <p className=" whitespace-pre ml-2 mb-1">
                {storeIntroduction}
              </p>
            </div>
          </div>

          <div id="category" className="flex flex-row items-start text-center ">
            <div className='flex flex-row items-start text-start'>
              <p className=" whitespace-pre-line font-semibold">
                비즈니스종류 :&nbsp;
              </p>
              <p className=" whitespace-pre ">
                {businessTypeMap[storeCategory] || storeCategory}
              </p>
            </div>
            <button
              onClick={() => openEditModal('storeCategory')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <div id="storeHours" className="flex flex-row items-start text-center ">
            <div className='flex flex-row items-start text-start'>
              <p className=" whitespace-pre-line font-semibold">
                영업시간 :&nbsp;
              </p>
              <p className=" whitespace-pre ">
                {storeHours}
              </p>
            </div>
            <button
              onClick={() => openEditModal('storeHours')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          
          <div id="storeLocation" className="flex flex-row items-start text-center ">
            <div className='flex flex-col items-start text-start'>
              <p className=" whitespace-pre font-semibold">
              매장위치 :
                <button
                  onClick={() => openEditModal('storeAddress')}
                  className="ml-px text-gray-500"
                >
                  <EditIcon style={{ width: '20px', height: '20px' }} />
                </button>
                <br />
              </p>
              <p className=" whitespace-pre-line ml-2 mb-1">
                {storeAddress}
              </p>
            </div>

          </div>

          <div id="storeTel" className="flex flex-row items-start text-center ">
            <div className='flex flex-row items-start text-start'>
              <p className=" whitespace-pre-line font-semibold">
                매장번호 :&nbsp;
              </p>
              <p className=" whitespace-pre ">
                {storeTel}
              </p>
            </div>
            <button
              onClick={() => openEditModal('storeTel')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <div id="storeInformation" className="flex flex-row items-start text-center ">
            <div className='flex flex-row items-start text-start'>
              <p className=" whitespace-nowrap font-semibold">
                매장정보 :&nbsp;
              </p>
              <p className=" whitespace-pre-line ">
                {storeInformation}
              </p>
            </div>
            <button
              onClick={() => openEditModal('storeInformation')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          <hr className="border-t-2 border-gray-300 mt-2.5 mb-px w-full" />
        </div>

        <div id='store-menu'
          className=' p-4 flex-grow'
          style={{ maxHeight: '60%' }}
        >
          <p id="menuTitle" className="font-bold text-xl mb-2 h-auto">
            {menuTitle}
          </p>
          <div className='flex flex-row'>
            <AddIcon className='text-indigo-400 cursor-pointer mr-1 text-lg' onClick={goToAddMenu} />
            <button
              className='textAddIcon '
              onClick={goToAddMenu}>
              <p className='text-indigo-400 font-semibold cursor-pointer text-lg'> {menuTitle} 추가</p>
            </button>
          </div>
          <div className='flex flex-row'>
            <SearchIcon className='text-indigo-400 cursor-pointer mr-1 text-lg' onClick={goToViewMenu} />
            <button
              className='textAddIcon '
              onClick={goToViewMenu}>
              <p className='text-indigo-400 font-semibold cursor-pointer text-lg'> {menuTitle} 보기</p>
            </button>
          </div>
        </div>

        <div className='flex bg-white items-center justify-center h-auto mt-auto'>
          <button
            onClick={saveAllChanges}
            className="mb-3 w-48 py-2 bg-indigo-500 text-white text-center font-medium block rounded-full cursor-pointer"
            style={{ marginBottom: '10px' }}
          >
            모든 변경사항 저장
          </button>
        </div>
      </main>

      {/* 모달들과 에러 메시지 모달 */}
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
              &times;
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

      {isEditModalOpen && (
        <div
          id="editModal"
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="modal-content bg-white p-6 rounded-lg shadow-lg text-center relative"
            style={{ width: '350px', position: 'relative' }}
          >
            <button
              onClick={closeEditModal}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 z-10"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">내용 수정</h2>
            {currentEditElement === 'storeCategory' ? (
              // 비즈니스 종류 수정 드롭다운
              <select
                className="w-full h-12 p-2 border border-gray-300 rounded"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              >
                <option value=""> 종류 선택</option>
                <option value="FOOD">음식점</option>
                <option value="RETAIL">판매점</option>
                <option value="UNMANNED">무인매장</option>
                <option value="PUBLIC">공공기관</option>
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
        show={isViewMenuModalOpen}
        onClose={closeViewMenu}
        title="메뉴 목록"
        slug={slug}
        menuTitle={menuTitle}
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
    </div>
  );
};

export default ChangeInfo;
