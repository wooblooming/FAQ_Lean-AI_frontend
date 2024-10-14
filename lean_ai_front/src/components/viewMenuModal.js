import React, { useState, useEffect, useRef } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Edit3 as EditIcon, Check as CheckIcon, X as CancelIcon } from 'lucide-react';
import ModalErrorMSG from './modalErrorMSG';
import ConfirmDeleteModal from '../components/confirmDeleteModal'; // 삭제 확인 모달 컴포넌트
import config from '../../config';
import styles from '../styles/viewMenu.module.css'; // 모듈 CSS 파일 import

const ViewMenuModal = ({ show, onClose, title, slug, menuTitle }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingItem, setEditingItem] = useState(null); // 수정 중인 아이템
  const [updatedMenuItems, setUpdatedMenuItems] = useState([]); // 수정된 아이템을 저장
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null); // 삭제할 항목
  const [previewImage, setPreviewImage] = useState(null); // 미리보기 이미지

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const storeSlug = encodeURIComponent(slug);
  const fileInputRef = useRef(null); // 파일 입력 필드에 대한 참조

  useEffect(() => {
    if (show) {
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
              action: 'view',
              slug: storeSlug,
            }),
          });

          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setMenuItems(data);
            setUpdatedMenuItems(data); // 처음 로드할 때 메뉴 아이템을 복사해 수정 가능하도록 설정
            const categories = [...new Set(data.map((item) => item.category))];
            setExpandedCategories(categories.reduce((acc, category) => ({ ...acc, [category]: false }), {}));
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
  }, [show, slug]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleEditClick = (menuItem) => {
    setEditingItem(menuItem.menu_number);
    setPreviewImage(null); // 수정 시작 시 미리보기 초기화
  };

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
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}${result.updated_menus[0]?.image}`
            : menuItem.image; // 기존 이미지 유지
  
        const updatedMenuItem = {
          ...menuItem,
          image: updatedImage,
        };
  
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
  

  const handleCancelEdit = () => {
    setEditingItem(null);
    setPreviewImage(null);
  };

  const handleInputChange = (e, menuItem, field) => {
    const updatedItems = updatedMenuItems.map((item) =>
      item.menu_number === menuItem.menu_number ? { ...item, [field]: e.target.value } : item
    );
    setUpdatedMenuItems(updatedItems);
  };

  const handleImageChange = (e, menuItem) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);

      const updatedItems = updatedMenuItems.map((item) =>
        item.menu_number === menuItem.menu_number ? { ...item, image: file } : item
      );
      setUpdatedMenuItems(updatedItems);
    }
  };

  const handleDeleteClick = (menuItem) => {
    setConfirmDeleteItem(menuItem);
  };

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

  const groupedMenuItems = updatedMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!show) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} relative mx-2`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 z-50"
          style={{ padding: '10px', cursor: 'pointer' }}
          aria-label="Close"
        >
          X
        </button>
        <div className={styles.modalHeader}>메뉴 목록</div>
        <div className={styles.modalBody}>
          {loading ? (
            <p>메뉴 데이터를 불러오는 중...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : Object.keys(groupedMenuItems).length === 0 ? (
            <p>등록된 메뉴가 없습니다.</p>
          ) : (
            Object.entries(groupedMenuItems).map(([category, items]) => (
              <div key={category} className={styles.categoryGroup}>
                <h3 onClick={() => toggleCategory(category)} className={styles.categoryHeader}>
                  {category}{' '}
                  {expandedCategories[category] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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

      <ConfirmDeleteModal
        show={!!confirmDeleteItem}
        onClose={() => setConfirmDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={confirmDeleteItem?.name}
      />

      <ModalErrorMSG show={showErrorMessageModal} onClose={() => setShowErrorMessageModal(false)} title="Error">
        <p style={{ whiteSpace: 'pre-line' }}>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
};

export default ViewMenuModal;
