import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Pencil,
  Check,
  X,
  Trash,
  ChevronDown,
  ChevronUp,
  CircleMinus,
  Image as ImageIcon,
  Menu as MenuIcon,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { getMenuTitle } from "@/utils/storeUtils";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import ModalMSG from "@/components/modal/modalMSG.js";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import ConfirmDeleteModal from "@/components/modal/confirmDeleteModal";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

const ViewMenuModal = ({ isOpen, onClose, slug, storeCategory }) => {
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
  const fileInputRef = useRef(null);
  const { token } = useAuth();
  const menuTitle = getMenuTitle(storeCategory); // 메뉴 제목 설정

  // Fetch menu data
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
          slug: slug,
        },
      });

      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        setUpdatedMenuItems(data);
        // Initialize all categories as expanded for better visibility
        const categories = [...new Set(data.map((item) => item.category))];
        setExpandedCategories(
          categories.reduce((acc, category, index) => {
            acc[category] = index === 0; // 첫 번째 카테고리만 true
            return acc;
          }, {})
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

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  // Get image URL
  const getImageSrc = (menu) => {
    if (menu.image instanceof File) {
      return URL.createObjectURL(menu.image);
    }
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

      if (response.status === 200 && response.data.updated_menu) {
        const updatedMenu = response.data.updated_menu;

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
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleDeleteClick = (menuItem) => {
    setConfirmDeleteItem(menuItem);
  };

  // Delete individual item
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

  // Delete category
  const confirmDeleteCategoryHandler = async () => {
    if (!confirmDeleteCategory) return;

    try {
      await axios.delete(`${API_DOMAIN}/api/menus/delete_category/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: {
          slug: slug,
          category: confirmDeleteCategory,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white relative">
          <div className="flex items-center">
            <MenuIcon className="mr-3" />
            <h2 className="text-2xl font-bold">{menuTitle} 목록</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <LoadingSpinner />
              <p className="mt-4 text-indigo-600 font-medium" style={{ fontFamily: "NanumSquareBold" }}>
                {menuTitle} 데이터를 불러오는 중...
              </p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600" style={{ fontFamily: "NanumSquareBold" }}>
              <p>{error}</p>
            </div>
          ) : Object.keys(groupedMenuItems).length === 0 ? (
            <div className="text-center py-10" style={{ fontFamily: "NanumSquareBold" }}>
              <div className="bg-indigo-50 rounded-full p-4 inline-flex mb-4">
                <MenuIcon className="h-8 w-8 text-indigo-500" />
              </div>
              <p className="text-gray-500 text-lg">
                등록된 {menuTitle}이/가 없습니다.
              </p>
            </div>
          ) : (
            <div className="space-y-6" style={{ fontFamily: "NanumSquareBold" }}>
              {Object.entries(groupedMenuItems).map(
                ([category, items], index) => (
                  <div
                    key={category}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                  >
                    {/* Category Header */}
                    <div
                      onClick={() => toggleCategory(category)}
                      className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        {/* index+1을 카테고리 앞에 표시 */}
                        <div className="flex items-center justify-center w-6 h-6 text-indigo-500 text-2xl font-bold mr-1.5" style={{ fontFamily: "NanumSquareExtraBold" }}>
                          {index + 1}.
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800" style={{ fontFamily: "NanumSquareExtraBold" }}>
                          {category}
                        </h3>
                        <span className="ml-2 text-sm text-gray-500 font-medium bg-gray-200 rounded-full px-2">
                          {items.length}개의 {menuTitle}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {expandedCategories[category] && (
                          <button
                            className="p-1.5 mr-2 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteCategory(category);
                            }}
                          >
                            <CircleMinus className="h-5 w-5" />
                          </button>
                        )}
                        {expandedCategories[category] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Menu Items */}
                    {expandedCategories[category] && (
                      <div className="divide-y divide-gray-100">
                        {items.map((menu) => (
                          <div key={menu.menu_number} className="p-4">
                            {editingItem === menu.menu_number ? (
                              <div className="animate-scaleIn">
                                <div className="flex flex-col md:flex-row gap-4">
                                  {/* Image Edit */}
                                  <div className="relative w-full md:w-32 h-32 group">
                                    <img
                                      src={previewImage || getImageSrc(menu)}
                                      alt={menu.name}
                                      className="w-full h-full object-cover rounded-lg border-2 border-indigo-300"
                                    />
                                    <div
                                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg cursor-pointer"
                                      onClick={() =>
                                        fileInputRef.current.click()
                                      }
                                    >
                                      <ImageIcon className="h-8 w-8 text-white" />
                                    </div>
                                    <input
                                      type="file"
                                      ref={fileInputRef}
                                      className="hidden"
                                      onChange={(e) =>
                                        handleImageChange(e, menu)
                                      }
                                    />
                                  </div>

                                  {/* Form Fields */}
                                  <div className="flex-1 space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        이름
                                      </label>
                                      <input
                                        type="text"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        value={menu.name}
                                        onChange={(e) =>
                                          handleInputChange(e, menu, "name")
                                        }
                                        placeholder="상품명 입력"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                        가격 (원)
                                      </label>
                                      <input
                                        type="number"
                                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                        value={Number(menu.price).toFixed(0)}
                                        onChange={(e) =>
                                          handleInputChange(e, menu, "price")
                                        }
                                        placeholder="가격 입력"
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-2 mt-4">
                                  <button
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg flex items-center transition-colors duration-200"
                                    onClick={handleCancelEdit}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    취소
                                  </button>
                                  <button
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center transition-colors duration-200"
                                    onClick={() => handleSaveEdit(menu)}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    저장
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between group">
                                {/* Item Information */}
                                <div className="flex items-center">
                                  <img
                                    src={getImageSrc(menu)}
                                    alt={menu.name}
                                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                  />
                                  <div className="ml-4">
                                    <h4 className="font-semibold text-gray-900">
                                      {menu.name}
                                    </h4>
                                    <div className="flex items-center text-indigo-600 font-medium mt-1">
                                      {Number(menu.price).toLocaleString()}원
                                    </div>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                  <button
                                    className="p-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg transition-colors duration-200"
                                    onClick={() => handleEditClick(menu)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors duration-200"
                                    onClick={() => handleDeleteClick(menu)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Item Confirmation Modal */}
      <ConfirmDeleteModal
        show={!!confirmDeleteItem}
        onClose={() => setConfirmDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={confirmDeleteItem?.name}
      />

      {/* Delete Category Confirmation Modal */}
      <ConfirmDeleteModal
        show={!!confirmDeleteCategory}
        onClose={() => setConfirmDeleteCategory(null)}
        onConfirm={confirmDeleteCategoryHandler}
        itemName={confirmDeleteCategory}
      />

      {/* Success Message Modal */}
      <ModalMSG
        show={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        title="Success"
      >
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
      </ModalMSG>

      {/* Error Message Modal */}
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
