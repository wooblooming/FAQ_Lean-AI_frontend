import React, { useState, useEffect } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ModalMSG from '../components/modalMSG'; // 메시지 모달 컴포넌트
import ModalErrorMSG from '../components/modalErrorMSG'; // 에러 메시지 모달 컴포넌트
import config from '../../config';

const ChangeInfo = ({ initialData }) => {
  const [storeId, setStoreId] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storeHours, setStoreHours] = useState('');
  const [menuPrices, setMenuPrices] = useState([]); // 메뉴 항목 배열로 변경
  const [storeAddess, setStoreAddess] = useState('');
  const [storeTel, setStoreTel] = useState('');
  
  const [storeImage, setStoreImage] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState('');
  const [currentEditElement, setCurrentEditElement] = useState('');
  const [currentMenuIndex, setCurrentMenuIndex] = useState(null); // 현재 수정 중인 메뉴 항목 인덱스
  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
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
          localStorage.removeItem('token');
          return;
        }
        const data = await response.json();
        console.log('data : ',data);

        if (data.length > 0) {
          setStoreName(data[0].store_name || '');
          setStoreHours(data[0].opening_hours || '');
          setMenuPrices(data[0].menu_price ? data[0].menu_price.split('\n') : []); // 메뉴 데이터를 배열로 저장
          setStoreAddess(data[0].store_address || '');
          setStoreTel(data[0].store_tel || '');

          const bannerPath = data[0].banner || "";
          const storeImageUrl = bannerPath
            ? bannerPath.startsWith("/media/")
              ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${bannerPath}`
              : `${process.env.NEXT_PUBLIC_MEDIA_URL}/media/${bannerPath.replace(/^\/+/, '')}`
            : '/chatbot.png'; // 기본 이미지 경로 설정

          setStoreImage(storeImageUrl);
          setStoreId(data[0].store_id);
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

    fetchData();
  }, [initialData]);

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const openEditModal = (elementId, index = null) => {
    setCurrentEditElement(elementId);
    setCurrentMenuIndex(index); // 수정할 메뉴 인덱스를 저장
    setEditText(
      elementId === 'storeName'
        ? storeName
        : elementId === 'storeHours'
          ? storeHours
          : elementId === 'storeAddess'
            ? storeAddess 
            : elementId === 'storeTel'
              ? storeTel  
              : index !== null ? menuPrices[index] : '' 
    );
    setIsEditModalOpen(true);
  };
  

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const chooseImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (event) {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setStoreImage(URL.createObjectURL(file));
        closeImageModal();
      }
    };

    input.click();
  };

  const applyDefaultImage = () => {
    setStoreImage('/chatbot.png');
    closeImageModal();
  };

  // 변경 저장 함수
  const saveChanges = () => {
    if (editText.trim() !== '') {
      if (currentEditElement === 'storeName') {
        setStoreName(editText);
      } else if (currentEditElement === 'storeHours') {
        setStoreHours(editText);
      } else if (currentEditElement === 'storeAddess') {
        setStoreAddess(editText);  // storeAddess 추가
      } else if (currentEditElement === 'storeTel') {
        setStoreTel(editText);  // storeTel 추가
      } else if (currentEditElement === 'menuPrices' && currentMenuIndex !== null) {
        const updatedMenuPrices = [...menuPrices];
        updatedMenuPrices[currentMenuIndex] = editText; // 선택한 메뉴 항목 업데이트
        setMenuPrices(updatedMenuPrices);
      } else if (currentEditElement === 'menuPrices') {
        setMenuPrices([...menuPrices, editText]); // 새 메뉴 항목 추가
      }
    }
    closeEditModal();
  };
  

  // 삭제 함수
  const deleteElement = () => {
    if (currentEditElement === 'storeName') {
      setStoreName(''); // 매장 이름 삭제
    } else if (currentEditElement === 'storeHours') {
      setStoreHours(''); // 영업 시간 삭제
    } else if (currentEditElement === 'menuPrices' && currentMenuIndex !== null) {
      const updatedMenuPrices = menuPrices.filter((_, index) => index !== currentMenuIndex); // 해당 메뉴 항목 삭제
      setMenuPrices(updatedMenuPrices);
    }
    closeEditModal();
  };

  // 변경 사항 저장 함수
  const saveAllChanges = async () => {
    try {
      const formData = new FormData();
      formData.append('store_name', storeName || "");
      formData.append('opening_hours', storeHours || "");
      formData.append('menu_price', menuPrices.join('\n') || "");
      formData.append('store_tel', storeTel || "");  // 전화번호 필드 추가
      formData.append('store_address', storeAddess || "");  // 주소 필드 추가
  
      if (storeImage && storeImage instanceof File) {
        formData.append('banner', storeImage);
      }
  
      const response = await fetch(`${config.apiDomain}/api/user-stores/${storeId}/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('정보 저장에 실패했습니다.');
      }
  
      const result = await response.json();  // 응답 결과 확인
      console.log('Update result:', result);
  
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

  return (
    <div className='flex flex-col h-full w-full bg-white font-sans'>
      <div id='banner' className="flex flex-col mt-1">
        {/* 배너 이미지 */}
        <div className=" bg-white relative h-auto "
          style={{ height: '45%', maxHeight: '200px' }}
        >
        {/* 높이를 전체 모달의 1/3로 설정 */}
          <img
            id="storeImage"
            src={storeImage}
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
              <EditIcon style={{width: '20px', height:'20px'}}/>
            </button>
          </div>

          <div id="storeHours" className="flex flex-row items-start text-center ">
            <p className=" whitespace-pre-line ">
              영업시간 : {storeHours}
            </p>
            <button
              onClick={() => openEditModal('storeHours')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{width: '20px', height:'20px'}}/>
            </button>
          </div>

          <div id="storeLocation" className="flex flex-row items-start text-center whitespace-pre-line">
            <p className="whitespace-pre-line">
              매장위치: &nbsp;{storeAddess}
            </p>
            <button
              onClick={() => openEditModal('storeAddess')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{width: '20px', height:'20px'}}/>
            </button>
          </div>

          <div id="storeTel" className="flex flex-row items-start text-center ">
            <p className="whitespace-pre-line">
              매장번호: &nbsp;{storeTel}
            </p>
            <button
              onClick={() => openEditModal('storeTel')}
              className="ml-px text-gray-500"
            >
              <EditIcon style={{width: '20px', height:'20px'}}/>
            </button>
          </div>


          <hr className="border-t-2 border-gray-300 mt-2.5 mb-px w-full" />
        </div>

        <div id='store-menu' 
             className=' p-4 h-40'
             style={{maxHeight:'60%'}}
        >
          <p id="menuTitle" className="font-bold text-xl mb-2 h-auto">
            상품
          </p>
          {menuPrices.map((menu, index) => (
            <div key={index}>
              <div className="flex flex-row items-start mb-4 text-center">
                <p id={`menuPrice_${index}`} className="whitespace-pre-line">
                  {menu}
                </p>
                <button
                  onClick={() => openEditModal('menuPrices', index)}
                  className="ml-2 text-gray-500"
                >
                  <EditIcon style={{width: '20px', height:'20px'}}/>
                </button>
              </div>
              <hr className="border-t-1 border-gray-200 my-px w-full" />
            </div>
          ))}
          
          <button
            onClick={() => openEditModal('menuPrices')} // 새로운 메뉴 항목 추가
            className="ml-2 mt-px text-blue-500"
          >
            + 상품 추가
          </button>
        </div>

        <div className='flex bg-white mt-px items-center justify-center h-auto'>
          <button
            onClick={saveAllChanges}
            className="mb-3 w-48 py-2 bg-blue-500 text-white text-center block rounded-full cursor-pointer absolute bottom-0"
          >
            모든 변경사항 저장
          </button>
        </div>
      </div>

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
            <textarea
              id="editTextArea"
              className="w-full h-32 p-2 border border-gray-300 rounded"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
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
}

export default ChangeInfo;
