import React, { useState, useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Edit3 as EditIcon, Check as CheckIcon, X, X as CancelIcon } from 'lucide-react';
import ModalMSG from './modalMSG.js';
import ModalErrorMSG from './modalErrorMSG';
import ConfirmDeleteModal from '../components/confirmDeleteModal';
import config from '../../config';
import styles from '../styles/viewMenu.module.css';

const ViewMenuModal = ({ isOpen, onClose, slug, menuTitle }) => {
  const [menuItems, setMenuItems] = useState([]); // 초기 메뉴 데이터를 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 메시지 관리
  const [expandedCategories, setExpandedCategories] = useState({}); // 카테고리 확장 상태 관리
  const [editingItem, setEditingItem] = useState(null); // 수정 중인 아이템
  const [updatedMenuItems, setUpdatedMenuItems] = useState([]); // 수정된 아이템을 저장
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null); // 삭제할 항목
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지

  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 내용
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 메시지 모달 상태
  const [message, setMessage] = useState(''); // 성공 메시지 내용

  const storeSlug = encodeURIComponent(slug); // 슬러그가 한글일 수 있으므로 인코딩
  const fileInputRef = useRef(null); // 파일 입력 필드에 대한 참조

  // 메뉴 데이터를 가져오기
  useEffect(() => {
    if (isOpen) {
      const fetchMenuItems = async () => {
        try {
          const token = sessionStorage.getItem('token');
          const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              action: 'view', // API 요청을 위한 action 값
              slug: slug // 메뉴를 조회할 슬러그 정보
            }),
          });

          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenuItems(data); // 메뉴 항목을 상태에 저장
            setUpdatedMenuItems(data); // 메뉴 항목을 복사해 수정 가능한 형태로 저장
            const categories = [...new Set(data.map((item) => item.category))]; // 카테고리 중복 제거
            setExpandedCategories(categories.reduce((acc, category) => ({ ...acc, [category]: false }), {})); // 각 카테고리 초기 확장 상태 설정
          } else {
            setError('메뉴 데이터가 비어있거나 올바르지 않습니다.');
          }
        } catch (error) {
          console.error('Error fetching menu data:', error);
          setError('메뉴 데이터를 불러오는 데 실패했습니다: ' + error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchMenuItems();
    }
  }, [isOpen, slug]);

  // 카테고리 확장/축소 상태 토글
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] })); // expandedCategories 상태를 업데이트
  };

  // 메뉴 항목 수정 모드 활성화
  const handleEditClick = (menuItem) => {
    setEditingItem(menuItem.menu_number);
    setPreviewImage(null); // 수정 시작 시 미리보기 초기화
  };

  // 수정 내용 저장 및 서버에 업데이트
  const handleSaveEdit = async (menuItem) => {
    try {
      const token = sessionStorage.getItem('token');
      const formData = new FormData();
      formData.append('action', 'update');
      formData.append('slug', storeSlug);
      formData.append('menu_number', menuItem.menu_number);
      formData.append('name', menuItem.name);
      formData.append('price', Math.round(menuItem.price));
      formData.append('category', menuItem.category);

      // 이미지가 파일 형식인 경우에만 추가
      if (menuItem.image instanceof File) {
        formData.append('image', menuItem.image);
      }

      const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedImage =
          menuItem.image instanceof File
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${result.updated_menus[0]?.image}` // 새 이미지 URL 설정
            : menuItem.image; // 기존 이미지 유지

        const updatedMenuItem = {
          ...menuItem,
          image: updatedImage,
        };

        // 수정된 데이터 상태 반영
        setUpdatedMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.menu_number === menuItem.menu_number ? updatedMenuItem : item
          )
        );
        setMenuItems((prevItems) =>
          prevItems.map((item) =>
            item.menu_number === menuItem.menu_number ? updatedMenuItem : item
          )
        );

        setMessage(`"${menuItem.name}" 항목이 성공적으로 수정되었습니다.`);
        setShowMessageModal(true);
      } else {
        const errorText = await response.text();
        console.error('서버에서 수정 실패:', errorText);
        throw new Error(`서버에서 수정 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('항목 수정 중 오류 발생:', error);
      setErrorMessage('항목 수정에 실패했습니다.');
      setShowErrorMessageModal(true);
    } finally {
      setEditingItem(null);
    }
  };

  // 수정 취소
  const handleCancelEdit = () => {
    setEditingItem(null);
    setPreviewImage(null);
  };

  // 입력 값 변경 시 업데이트 상태 반영
  const handleInputChange = (e, menuItem, field) => {
    const updatedItems = updatedMenuItems.map((item) =>
      item.menu_number === menuItem.menu_number ? { ...item, [field]: e.target.value } : item
    );
    setUpdatedMenuItems(updatedItems); // 변경된 입력 상태 업데이트
  };

  // 이미지 변경 시 미리보기 생성 및 상태 업데이트
  const handleImageChange = (e, menuItem) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // 미리보기 이미지 설정
      };
      reader.readAsDataURL(file);

      const updatedItems = updatedMenuItems.map((item) =>
        item.menu_number === menuItem.menu_number ? { ...item, image: file } : item
      );
      setUpdatedMenuItems(updatedItems);
    }
  };

  // 삭제 확인 모달 표시
  const handleDeleteClick = (menuItem) => {
    setConfirmDeleteItem(menuItem);
  };

  // 삭제 항목 확인 후 서버에 삭제 요청
  const confirmDelete = async () => {
    try {
      const token = sessionStorage.getItem('token');

      const requestBody = JSON.stringify({
        action: 'delete',
        menus: [
          {
            slug: storeSlug,
            menu_number: confirmDeleteItem.menu_number,
          },
        ],
      });

      // 디버깅용
      // console.log('삭제 요청 body:', requestBody);

      const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.status === 200) {
        const updatedItems = updatedMenuItems.filter(
          (item) => item.menu_number !== confirmDeleteItem.menu_number
        );
        setUpdatedMenuItems(updatedItems);
        setMenuItems(updatedItems);

        setMessage(`"${confirmDeleteItem.name}" 항목이 성공적으로 삭제되었습니다.`);
        setShowMessageModal(true);
      } else {
        const errorText = await response.text();
        console.error('서버에서 삭제 실패:', errorText);
        setErrorMessage('서버에서 삭제 실패:', errorText);
        throw new Error(`서버에서 삭제 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('항목 삭제 중 오류 발생:', error);
      setErrorMessage('항목 삭제에 실패했습니다.');
      setShowErrorMessageModal(true);
    } finally {
      setConfirmDeleteItem(null);
    }
  };

  const confirmDeleteCategoryHandler = async () => {
    if (!confirmDeleteCategory) return;

    try {
      const token = sessionStorage.getItem('token');
      const itemsToDelete = updatedMenuItems.filter(item => item.category === confirmDeleteCategory);
      const requestBody = JSON.stringify({
        action: 'delete',
        menus: itemsToDelete.map(item => ({
          slug: storeSlug,
          menu_number: item.menu_number,
        })),
      });

      const response = await fetch(`${config.apiDomain}/api/menu-details/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (response.status === 200) {
        const updatedItems = updatedMenuItems.filter(
          (item) => item.category !== confirmDeleteCategory
        );
        setUpdatedMenuItems(updatedItems);
        setMenuItems(updatedItems);

        setMessage(`"${confirmDeleteCategory}" 카테고리가 성공적으로 삭제되었습니다.`);
        setShowMessageModal(true);
      } else {
        const errorText = await response.text();
        console.error('서버에서 카테고리 삭제 실패:', errorText);
        setErrorMessage(`카테고리 삭제 실패: ${errorText}`);
        throw new Error(`카테고리 삭제 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('카테고리 삭제 중 오류 발생:', error);
      setErrorMessage('카테고리 삭제에 실패했습니다.');
      setShowErrorMessageModal(true);
    } finally {
      setConfirmDeleteCategory(null);
    }
  };

  // 카테고리별로 메뉴 항목 그룹화
  const groupedMenuItems = updatedMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} z-30`} >
      <div className={`${styles.modalContent} relative mx-2 overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 "
          style={{ padding: '10px', cursor: 'pointer' }}
          aria-label="Close"
        >
          <X className="bg-indigo-500 rounded-full text-white p-1"/>
        </button>
        <div className={styles.modalHeader}>{menuTitle} 목록</div>
        <div className={`${styles.modalBody}`}>
          {/* 로딩 중 일때 */}
          {loading ? (
            <p>{menuTitle} 데이터를 불러오는 중...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : Object.keys(groupedMenuItems).length === 0 ? (
            <p>등록된 {menuTitle}이/가 없습니다.</p>
          ) : (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} className={`${styles.categoryGroup} `}>
                <h3 onClick={() => toggleCategory(category)} className={`${styles.categoryHeader} flex items-center justify-between`}>
                  {category}{' '}
                  {expandedCategories[category] ?
                    <button
                      className={`${styles.deleteCategoryButton} ml-auto`}
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지
                        setConfirmDeleteCategory(category);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </button>
                    : <KeyboardArrowDownIcon />}
                </h3>
                {expandedCategories[category] && (
                  <ul>
                    {items.map((menu) => (
                      <li key={menu.menu_number} className={styles.menuItem}>
                        {editingItem === menu.menu_number ? (
                          <div className={styles.editMenuItem}>
                            <div className={styles.imageWrapper}>
                              <img
                                src={
                                  previewImage ||
                                  (menu.image && typeof menu.image === 'string' && menu.image.startsWith('http')
                                    ? menu.image
                                    : menu.image
                                      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${menu.image}`
                                      : '/menu_default_image.png')
                                }
                                alt={menu.name}
                                className={styles.menuEditImage}
                                onClick={() => fileInputRef.current.click()}
                                style={{ cursor: 'pointer' }}
                              />
                            </div>
                            <input
                              type="file"
                              className={styles.menuEditImageInput}
                              ref={fileInputRef}
                              style={{ display: 'none' }}
                              onChange={(e) => handleImageChange(e, menu)}
                            />
                            <input
                              type="text"
                              className={styles.menuEditInput}
                              value={menu.name}
                              onChange={(e) => handleInputChange(e, menu, 'name')}
                            />
                            <input
                              type="number"
                              className={styles.menuEditInput}
                              value={Number(menu.price).toFixed(0)}
                              onChange={(e) => handleInputChange(e, menu, 'price')}
                            />
                            <div className={styles.editButtons}>
                              <button className={styles.saveButton} onClick={() => handleSaveEdit(menu)}>
                                <CheckIcon />
                              </button>
                              <button className={styles.cancelButton} onClick={handleCancelEdit}>
                                <CancelIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="displayMenuItem flex justify-between items-center w-full">
                            <div className="flex items-center">
                              <img
                                src={
                                  menu.image && typeof menu.image === 'string' && menu.image.startsWith('http')
                                    ? menu.image
                                    : menu.image
                                      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${menu.image}`
                                      : '/menu_default_image.png'
                                }
                                alt={menu.name}
                                className={styles.menuImage}
                              />
                              <div className={`${styles.menuDetails} ml-4`}>
                                <p className={styles.menuName}>{menu.name}</p>
                                <p className={styles.menuPrice}>{Number(menu.price).toFixed(0)}원</p>
                              </div>
                            </div>
                            <div className="flex space-x-2 items-center mr-6">
                              <button className={styles.editButton} onClick={() => handleEditClick(menu)}>
                                <EditIcon />
                              </button>
                              <button className={styles.deleteButton} onClick={() => handleDeleteClick(menu)}>
                                <DeleteOutlineIcon />
                              </button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* item 삭제 확인 모달 */}
      <ConfirmDeleteModal
        show={!!confirmDeleteItem}
        onClose={() => setConfirmDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={confirmDeleteItem?.name}
      />

      {/* 카테고리 삭제 확인 모달 */}
      <ConfirmDeleteModal
        show={!!confirmDeleteCategory}
        onClose={() => setConfirmDeleteCategory(null)}
        onConfirm={confirmDeleteCategoryHandler}
        itemName={confirmDeleteCategory}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Success"
      >
        <p style={{ whiteSpace: 'pre-line' }}>{message}</p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)} title="Error">
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
};

export default ViewMenuModal;
