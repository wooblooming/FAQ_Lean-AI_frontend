import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Pencil as EditIcon,
  Check as CheckIcon,
  X as CancelIcon,
  Trash,
  ChevronDown,
  CircleMinus,
} from "lucide-react";
import { useAuth } from "../../contexts/authContext";
import ModalMSG from "../modal/modalMSG.js";
import ModalErrorMSG from "../modal/modalErrorMSG";
import ConfirmDeleteModal from "../modal/confirmDeleteModal";
import styles from "../../styles/viewMenu.module.css";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const ViewMenuModal = ({ isOpen, onClose, slug, menuTitle }) => {
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [editingItem, setEditingItem] = useState(null);
  const [updatedMenuItems, setUpdatedMenuItems] = useState([]);
  const [confirmDeleteItem, setConfirmDeleteItem] = useState(null);
  const [confirmDeleteCategory, setConfirmDeleteCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");

  const storeSlug = encodeURIComponent(slug);
  const fileInputRef = useRef(null);
  const { token } = useAuth();

  // 메뉴 데이터를 가져오기
  useEffect(() => {
    if (isOpen && slug && token) {
      fetchMenuItems();
    }
  }, [isOpen, slug, token]);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get(`${API_DOMAIN}/api/menus/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          action: "view",
          slug: slug, // 슬러그를 URL 파라미터로 전달
        },
      });

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setMenuItems(data);
        setUpdatedMenuItems(data);
        const categories = [...new Set(data.map((item) => item.category))];
        setExpandedCategories(
          categories.reduce(
            (acc, category) => ({ ...acc, [category]: false }),
            {}
          )
        );
      } else {
        setError("메뉴 데이터가 비어있거나 올바르지 않습니다.");
      }
    } catch (error) {
      if (error.response) {
        setError(
          `서버에서 에러 발생: ${
            error.response.data?.message || "알 수 없는 오류"
          }`
        );
      } else {
        setError(`메뉴 데이터를 불러오는 데 실패했습니다: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // 카테고리 확장/축소 상태 토글
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // 이미지 URL 가져오기 함수 (미리보기 또는 기본 이미지)
  const getImageSrc = (menu) => {
    // 파일 객체인지 확인하여 URL 생성
    if (menu.image instanceof File) {
      return URL.createObjectURL(menu.image);
    }
    // 기본 이미지 로직 유지
    return menu.image &&
      typeof menu.image === "string" &&
      menu.image.startsWith("http")
      ? menu.image
      : menu.image
      ? `${MEDIA_URL}${menu.image}`
      : "/images/menu_default_image.png";
  };

  const handleEditClick = (menuItem) => {
    setEditingItem(menuItem.menu_number);
    setPreviewImage(null);
  };

  const handleSaveEdit = async (menuItem) => {
    try {
      const formData = new FormData();
      formData.append("menu_number", menuItem.menu_number);
      formData.append("name", menuItem.name);
      formData.append("price", Math.round(menuItem.price));
      formData.append("category", menuItem.category);

      if (menuItem.image instanceof File) {
        formData.append("image", menuItem.image);
      }

      const response = await axios.put(
        `${API_DOMAIN}/api/menus/${menuItem.menu_number}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Axios에서는 status로 성공 여부 확인
      if (response.status === 200 && response.data.updated_menu) {
        const updatedMenu = response.data.updated_menu;

        // 이미지 처리
        const updatedImage =
          menuItem.image instanceof File
            ? `${MEDIA_URL}${updatedMenu.image}`
            : menuItem.image;

        const updatedMenuItem = { ...menuItem, image: updatedImage };
        setUpdatedMenuItems((prev) =>
          prev.map((item) =>
            item.menu_number === menuItem.menu_number ? updatedMenuItem : item
          )
        );
        setMenuItems((prev) =>
          prev.map((item) =>
            item.menu_number === menuItem.menu_number ? updatedMenuItem : item
          )
        );

        setMessage(`"${menuItem.name}" 항목이 성공적으로 수정되었습니다.`);
        setShowMessageModal(true);
      } else {
        throw new Error("서버에서 수정 실패");
      }
    } catch (error) {
      console.error("Error updating menu item:", error);
      setErrorMessage("항목 수정에 실패했습니다.");
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
      item.menu_number === menuItem.menu_number
        ? { ...item, [field]: e.target.value }
        : item
    );
    setUpdatedMenuItems(updatedItems);
  };

  const handleImageChange = (e, menuItem) => {
    const file = e.target.files[0];
    if (file) {
      const updatedItems = updatedMenuItems.map((item) =>
        item.menu_number === menuItem.menu_number
          ? { ...item, image: file }
          : item
      );
      setUpdatedMenuItems(updatedItems);
    }
  };

  const handleDeleteClick = (menuItem) => {
    setConfirmDeleteItem(menuItem);
  };

  // 개별 아이템 삭제
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `${API_DOMAIN}/api/menus/${confirmDeleteItem.menu_number}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedItems = updatedMenuItems.filter(
        (item) => item.menu_number !== confirmDeleteItem.menu_number
      );
      setUpdatedMenuItems(updatedItems);
      setMenuItems(updatedItems);

      setMessage(
        `"${confirmDeleteItem.name}" 항목이 성공적으로 삭제되었습니다.`
      );
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage("항목 삭제에 실패했습니다.");
      setShowErrorMessageModal(true);
    } finally {
      setConfirmDeleteItem(null);
    }
  };

  // 카테고리별 삭제
  const confirmDeleteCategoryHandler = async () => {
    if (!confirmDeleteCategory) return;

    try {
      await axios.delete(`${API_DOMAIN}/api/menus/delete_category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          slug: slug, // 삭제할 스토어의 slug
          category: confirmDeleteCategory, // 삭제할 카테고리 이름
        },
      });

      const updatedItems = updatedMenuItems.filter(
        (item) => item.category !== confirmDeleteCategory
      );
      setUpdatedMenuItems(updatedItems);
      setMenuItems(updatedItems);

      setMessage(
        `"${confirmDeleteCategory}" 카테고리가 성공적으로 삭제되었습니다.`
      );
      setShowMessageModal(true);
    } catch (error) {
      setErrorMessage("카테고리 삭제에 실패했습니다.");
      setShowErrorMessageModal(true);
    } finally {
      setConfirmDeleteCategory(null);
    }
  };

  const groupedMenuItems = updatedMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} z-30`}>
      <div className={`${styles.modalContent} relative mx-2 overflow-y-auto`}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 "
          style={{ padding: "10px", cursor: "pointer" }}
          aria-label="Close"
        >
          <CancelIcon className="bg-indigo-500 rounded-full text-white p-1" />
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
                <h3
                  onClick={() => toggleCategory(category)}
                  className={`${styles.categoryHeader} flex items-center justify-between`}
                >
                  {category}{" "}
                  {expandedCategories[category] ? (
                    <button
                      className={`${styles.deleteCategoryButton} ml-auto`}
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지
                        setConfirmDeleteCategory(category);
                      }}
                    >
                      <CircleMinus />
                    </button>
                  ) : (
                    <ChevronDown />
                  )}
                </h3>
                {expandedCategories[category] && (
                  <ul>
                    {items.map((menu) => (
                      <li key={menu.menu_number} className={styles.menuItem}>
                        {editingItem === menu.menu_number ? (
                          <div className={styles.editMenuItem}>
                            <div className={styles.imageWrapper}>
                              <img
                                src={previewImage || getImageSrc(menu)}
                                alt={menu.name}
                                className={styles.menuEditImage}
                                onClick={() => fileInputRef.current.click()}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                            <input
                              type="file"
                              className={styles.menuEditImageInput}
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={(e) => handleImageChange(e, menu)}
                            />
                            <input
                              type="text"
                              className={styles.menuEditInput}
                              value={menu.name}
                              onChange={(e) =>
                                handleInputChange(e, menu, "name")
                              }
                            />
                            <input
                              type="number"
                              className={styles.menuEditInput}
                              value={Number(menu.price).toFixed(0)}
                              onChange={(e) =>
                                handleInputChange(e, menu, "price")
                              }
                            />
                            <div className={styles.editButtons}>
                              <button
                                className={styles.saveButton}
                                onClick={() => handleSaveEdit(menu)}
                              >
                                <CheckIcon />
                              </button>
                              <button
                                className={styles.cancelButton}
                                onClick={handleCancelEdit}
                              >
                                <CancelIcon />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="displayMenuItem flex justify-between items-center w-full">
                            <div className="flex items-center">
                              <img
                                src={getImageSrc(menu)}
                                alt={menu.name}
                                className={styles.menuImage}
                              />

                              <div className={`${styles.menuDetails} ml-4`}>
                                <p className={styles.menuName}>{menu.name}</p>
                                <p className={styles.menuPrice}>
                                  {Number(menu.price).toFixed(0)}원
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-4 items-center mr-6">
                              <button
                                className={styles.editButton}
                                onClick={() => handleEditClick(menu)}
                              >
                                <EditIcon className="w-5 h-5" />
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={() => handleDeleteClick(menu)}
                              >
                                <Trash className="w-5 h-5" />
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
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
        title="Error"
      >
        <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
};

export default ViewMenuModal;
