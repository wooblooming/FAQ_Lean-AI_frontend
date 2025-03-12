import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/authContext";
import {
  CirclePlus,
  Plus,
  PencilLine,
  Check,
  X,
  Menu as MenuIcon,
  DollarSign,
  Tag,
  Trash,
  UploadCloud,
} from "lucide-react";
import { fetchMenuCategoryData } from "@/fetch/fetchStoreMenuCategory";
import { getCategoryIcon, getMenuTitle } from "@/utils/storeUtils";
import ModalMSG from "@/components/modal/modalMSG.js";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function AddMenuModal({
  isOpen,
  onClose,
  onSave,
  slug,
  storeCategory,
}) {
  const { token } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    image: "",
    name: "",
    price: "",
    category: "",
    store: "",
  });
  const [category, setCategory] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showCategorySection, setShowCategorySection] = useState(false);
  const [showItemList, setShowItemList] = useState(false);
  const dropAreaRef = useRef(null);
  const [newCategoryInput, setNewCategoryInput] = useState("");

  const menuTitle = getMenuTitle(storeCategory); // 메뉴 제목 설정
  const CategoryIcon = getCategoryIcon(storeCategory); // 카테고리에 따른 아이콘 가져오기

  // 모바일 화면 크기 여부 상태
  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth <= 768;
      setIsMobile(isMobileScreen);

      // 모바일에서는 기본적으로 아이템 목록 숨기기
      if (isMobileScreen && !showItemList) {
        setShowItemList(false);
      } else if (!isMobileScreen) {
        setShowItemList(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 메뉴 데이터 조회
  useEffect(() => {
    if (isOpen && slug && token) {
      fetchMenuCategoryData(
        { slug },
        token,
        setCategory,
        setErrorMessage,
        setShowErrorMessageModal
      );
    }
  }, [isOpen, slug, token]);

  // 모달이 닫혀있으면 컴포넌트를 렌더링하지 않음
  if (!isOpen) return null;

  const handleClose = () => {
    setNewItem({
      image: "",
      name: "",
      price: "",
      category: "",
      store: "",
    });
    setMenuItems([]);
    setEditItemId(null);
    setEditItem(null);
    setErrorMessage("");
    setMessage("");
    onClose();
  };

  const handleImageChange = (e, isEditing = false) => {
    const file = e.target.files[0];
    if (file) {
      if (isEditing) {
        setEditItem((prev) => ({ ...prev, image: file }));
      } else {
        setNewItem((prev) => ({ ...prev, image: file }));
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setNewItem((prev) => ({ ...prev, image: file }));
    }
  };

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    const updatedValue = name === "price" ? parseInt(value, 10) || "" : value;
    if (isEditing) {
      setEditItem((prev) => ({ ...prev, [name]: updatedValue }));
    } else {
      setNewItem((prev) => ({ ...prev, [name]: updatedValue }));
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.price && newItem.category) {
      setMenuItems((prev) => [
        ...prev,
        { ...newItem, menu_number: Date.now() },
      ]);
      setNewItem({ image: "", name: "", price: "", category: "", store: "" });
    } else {
      setErrorMessage("이름, 가격 및 카테고리를 모두 입력해주세요.");
      setShowErrorMessageModal(true);
    }
  };

  const handleEdit = (item) => {
    setEditItemId(item.menu_number);
    setEditItem(item);
  };

  const handleSaveEdit = () => {
    setMenuItems((prev) =>
      prev.map((item) => (item.menu_number === editItemId ? editItem : item))
    );
    setEditItemId(null);
    setEditItem(null);
  };

  const handleCancelEdit = () => {
    setEditItemId(null);
    setEditItem(null);
  };

  const handleDeleteItem = (itemToDelete) => {
    setMenuItems((prev) =>
      prev.filter((item) => item.menu_number !== itemToDelete.menu_number)
    );
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const getImagePreview = (image) => {
    if (image instanceof File) return URL.createObjectURL(image);
    return "/images/menu_default_image.png"; // 기본 이미지 경로
  };

  const handleComplete = async () => {
    try {
      const formData = new FormData();
      const storeSlug = slug;

      if (menuItems.length === 0) throw new Error("메뉴 데이터가 없습니다.");

      for (const [index, item] of menuItems.entries()) {
        formData.append(`menus[${index}][slug]`, storeSlug);
        formData.append(`menus[${index}][name]`, item.name || "");
        formData.append(`menus[${index}][price]`, item.price || 0);
        formData.append(`menus[${index}][category]`, item.category || "");
        formData.append(`menus[${index}][menu_number]`, item.menu_number || "");

        if (item.image instanceof File) {
          formData.append(`menus[${index}][image]`, item.image);
        } else {
          const defaultImageBlob = await fetch(
            "/images/menu_default_image.png"
          ).then((res) => res.blob());
          formData.append(
            `menus[${index}][image]`,
            defaultImageBlob,
            "menu_default_image.png"
          );
        }
      }

      // editItemId에 따라 URL과 메서드 결정
      const url = editItemId
        ? `${API_DOMAIN}/api/menus/${editItemId}/` // Update API
        : `${API_DOMAIN}/api/menus/`; // Create API

      const method = editItemId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "서버 전송에 실패했습니다.");
      }

      const result = await response.json();
      onSave(result);
      setMessage(`${menuTitle}이(가) 성공적으로 저장되었습니다.`);
      setShowMessageModal(true);

      // 상태 초기화
      setNewItem({ image: "", name: "", price: "", category: "", store: "" });
      setMenuItems([]);
      setEditItemId(null);
      setEditItem(null);
    } catch (error) {
      setErrorMessage(error.message || "저장에 실패했습니다.");
      setShowErrorMessageModal(true);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      borderRadius: "0.5rem",
      borderColor: "#E2E8F0",
      padding: "2px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#A5B4FC",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#6366F1"
        : state.isFocused
        ? "#EEF2FF"
        : null,
      color: state.isSelected ? "white" : "#4B5563",
    }),
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fadeIn w-full"
        style={{ maxWidth: "95%", maxHeight: "95vh", width: "850px" }}
      >
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white relative">
          <div className="flex items-center" style={{ fontFamily: "NanumSquareExtraBold" }}> 
            <CirclePlus className="mr-2" />
            <h2 className="text-2xl font-bold">{menuTitle} 추가</h2>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 md:p-5" style={{ fontFamily: "NanumSquareExtraBold" }}>
          {/* 모바일 전용 탭 네비게이션 */}
          {isMobile && (
            <div className="flex mb-4">
              <button
                className={`flex-1 py-3 font-medium ${
                  !showItemList ? "bg-indigo-600 text-white" : "text-gray-500"
                }`}
                onClick={() => setShowItemList(false)}
              >
                새 {menuTitle} 추가
              </button>
              <button
                className={`flex-1 py-3 font-medium relative ${
                  showItemList ? "bg-indigo-600 text-white" : "text-gray-500"
                }`}
                onClick={() => setShowItemList(true)}
              >
                {menuTitle} 목록
                {menuItems.length > 0 && (
                  <span className="absolute top-2 right-3 md:right-6 bg-indigo-100 text-indigo-800 text-xs font-medium py-0.5 px-1.5 ">
                    {menuItems.length}
                  </span>
                )}
              </button>
            </div>
          )}

          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "md:grid-cols-2 gap-6"
            }`}
          >
            {/* 좌측 입력 폼 - 모바일에서는 조건부 렌더링 */}
            {(!isMobile || !showItemList) && (
              <div className="space-y-4">
                <div className="bg-white md:bg-gray-50 p-2 md:p-5 rounded-xl md:border border-gray-200">
                  {!isMobile && (
                    <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                      <Plus className="mr-2 text-indigo-500" size={20} />새{" "}
                      {menuTitle} 추가
                    </h3>
                  )}

                  {/* 이미지 업로드 영역 */}
                  <div
                    className={`mb-4 rounded-xl border-2 border-dashed transition-all duration-200 ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-400 bg-white"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    ref={dropAreaRef}
                  >
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center cursor-pointer p-5"
                    >
                      {newItem.image ? (
                        <div className="relative group w-full">
                          <img
                            src={getImagePreview(newItem.image)}
                            alt="Preview"
                            className="w-full max-h-48 object-contain rounded-lg shadow-sm"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
                            <UploadCloud className="text-white h-8 w-8" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-6" style={{ fontFamily: "NanumSquareBold" }}>
                          <div className="bg-indigo-100 rounded-full p-3 mb-3">
                            <UploadCloud className="h-8 w-8 text-indigo-500" />
                          </div>
                          <p className="text-sm font-medium text-gray-700 mb-1 text-center">
                            {isMobile
                              ? "탭하여 이미지 추가"
                              : "이미지를 여기에 드래그하거나"}
                          </p>
                          {!isMobile && (
                            <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                              컴퓨터에서 선택
                            </button>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG 파일 지원
                          </p>
                        </div>
                      )}
                      <input
                        id="image-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleImageChange(e)}
                        accept="image/*"
                      />
                    </label>
                  </div>

                  {/* 입력 필드 그룹 */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {menuTitle} 이름
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={`${menuTitle} 이름을 입력하세요`}
                        value={newItem.name}
                        onChange={(e) => handleInputChange(e)}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        style={{ fontFamily: "NanumSquareBold" }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        가격
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="price"
                          placeholder="가격을 입력하세요"
                          value={newItem.price}
                          onChange={(e) => handleInputChange(e)}
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                          style={{ fontFamily: "NanumSquareBold" }}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500">원</span>
                        </div>
                      </div>
                    </div>

                    {/* 카테고리 섹션 - 모바일 최적화 */}
                    <div className="space-y-2">
                      <div
                        className="flex items-center justify-between"
                        onClick={() =>
                          isMobile &&
                          setShowCategorySection(!showCategorySection)
                        }
                      >
                        <label className="block text-sm font-medium text-gray-700">
                          카테고리 선택
                        </label>
                        {isMobile && (
                          <button className="p-1 text-gray-400">
                            {showCategorySection ? (
                              <X size={16} />
                            ) : (
                              <Plus size={16} />
                            )}
                          </button>
                        )}
                      </div>

                      {/* 선택된 카테고리 표시 */}
                      {newItem.category && (
                        <div className="mt-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100 flex items-center justify-between" style={{ fontFamily: "NanumSquareBold" }}>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 text-indigo-500 mr-2" />
                            <span className="text-sm font-medium text-indigo-700">
                              {category.find(
                                (c) => c.value === newItem.category
                              )?.label || newItem.category}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              setNewItem({ ...newItem, category: "" })
                            }
                            className="text-indigo-400 hover:text-indigo-600 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}

                      {/* 카테고리 버튼 그룹 - 모바일에서는 접을 수 있게 */}
                      {(!isMobile || showCategorySection) && (
                        <>
                          {/* 카테고리 버튼 그룹 */}
                          <div className="relative">
                            <div className="flex overflow-x-auto hide-scrollbar gap-2 py-1" style={{ fontFamily: "NanumSquareBold" }}>
                              {category.length > 0 ? (
                                category.map((cat) => (
                                  <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() =>
                                      setNewItem({
                                        ...newItem,
                                        category: cat.value,
                                      })
                                    }
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                      newItem.category === cat.value
                                        ? "bg-indigo-100 text-indigo-700 border border-indigo-300 shadow-sm"
                                        : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                    }`}
                                  >
                                    <span className="flex items-center">
                                      <Tag className="h-3.5 w-3.5 mr-1 opacity-70" />
                                      {cat.label}
                                    </span>
                                  </button>
                                ))
                              ) : (
                                <div className="w-full text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                  <p className="text-sm text-gray-500" style={{ fontFamily: "NanumSquareBold" }}>
                                    등록된 카테고리가 없습니다
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 새 카테고리 추가 영역 */}
                          <div className="flex items-center space-x-2 mt-3">
                            <div className="relative flex-grow">
                              <Tag className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="text"
                                value={newCategoryInput}
                                onChange={(e) =>
                                  setNewCategoryInput(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    newCategoryInput.trim()
                                  ) {
                                    // 새 카테고리 추가 로직 (기존과 동일)
                                    const newCategoryValue =
                                      newCategoryInput.trim();
                                    if (
                                      category.some(
                                        (c) =>
                                          c.value.toLowerCase() ===
                                          newCategoryValue.toLowerCase()
                                      )
                                    ) {
                                      setErrorMessage(
                                        "이미 존재하는 카테고리입니다"
                                      );
                                      setShowErrorMessageModal(true);
                                      return;
                                    }
                                    setCategory([
                                      ...category,
                                      {
                                        value: newCategoryValue,
                                        label: newCategoryValue,
                                      },
                                    ]);
                                    setNewItem({
                                      ...newItem,
                                      category: newCategoryValue,
                                    });
                                    setNewCategoryInput("");
                                  }
                                }}
                                placeholder="새 카테고리 입력"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                style={{ fontFamily: "NanumSquareBold" }}
                              />
                              {newCategoryInput && (
                                <button
                                  onClick={() => setNewCategoryInput("")}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                  <X size={16} />
                                </button>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                // 새 카테고리 추가 로직 (기존과 동일)
                                if (newCategoryInput.trim()) {
                                  const newCategoryValue =
                                    newCategoryInput.trim();
                                  if (
                                    category.some(
                                      (c) =>
                                        c.value.toLowerCase() ===
                                        newCategoryValue.toLowerCase()
                                    )
                                  ) {
                                    setErrorMessage(
                                      "이미 존재하는 카테고리입니다"
                                    );
                                    setShowErrorMessageModal(true);
                                    return;
                                  }
                                  setCategory([
                                    ...category,
                                    {
                                      value: newCategoryValue,
                                      label: newCategoryValue,
                                    },
                                  ]);
                                  setNewItem({
                                    ...newItem,
                                    category: newCategoryValue,
                                  });
                                  setNewCategoryInput("");
                                }
                              }}
                              disabled={!newCategoryInput.trim()}
                              className={`p-1.5 rounded-full font-medium flex items-center ${
                                !newCategoryInput.trim()
                                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                  : "bg-indigo-500 text-white hover:bg-indigo-600"
                              } transition-colors duration-200`}
                              style={{ fontFamily: "NanumSquareBold" }}
                            >
                              <Plus size={20}/>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 메뉴 추가 버튼 */}
                  <button
                    onClick={handleAddItem}
                    className="w-full mt-4 flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                  >
                    <Plus className="mr-2" size={20} />
                    {menuTitle} 목록에 추가
                  </button>
                </div>
              </div>
            )}

            {/* 우측 목록 - 모바일에서는 조건부 렌더링 */}
            {(!isMobile || showItemList) && (
              <div className="flex flex-col h-full">
                <div className="bg-white md:bg-gray-50 p-3 md:p-5 rounded-xl md:border border-gray-200 flex-1 mb-4">
                  {!isMobile && (
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-700 flex items-center">
                        <CategoryIcon
                          className="mr-2 text-indigo-500"
                          size={20}
                        />
                        현재 {menuTitle} 목록
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium py-1 px-2.5 rounded-full">
                        {menuItems.length}개
                      </span>
                    </div>
                  )}

                  {menuItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center bg-gray-100/50 rounded-lg border border-dashed border-gray-300">
                      <div className="bg-gray-200 rounded-full p-3 mb-3">
                        <MenuIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <p className="text-gray-500 mb-1">
                        등록된 {menuTitle}이 없습니다
                      </p>
                      <p className="text-sm text-gray-400" style={{ fontFamily: "NanumSquareBold" }}>
                        {isMobile
                          ? "새 항목을 추가해주세요"
                          : "왼쪽 폼에서 항목을 추가해주세요"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[70vh] md:max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                      {Object.entries(groupedMenuItems).map(
                        ([categoryName, items]) => (
                          <div key={categoryName} className="mb-4">
                            <div className="flex items-center mb-2">
                              <div className="w-1.5 h-5 bg-indigo-500 rounded-r mr-2"></div>
                              <h4 className="text-lg font-medium text-gray-700">
                                {categoryName}
                              </h4>
                            </div>
                            {items.map((item) => (
                              <div
                                key={item.menu_number}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-2 transition-all duration-200 hover:shadow-md"
                              >
                                {editItemId === item.menu_number ? (
                                  <div className="animate-fadeIn">
                                    {/* 수정 모드 UI */}
                                    <div className="flex items-center mb-3">
                                      <img
                                        src={getImagePreview(
                                          editItem.image || item.image
                                        )}
                                        alt={editItem.name}
                                        className="w-12 h-12 object-cover rounded-md mr-2"
                                      />
                                      <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e) =>
                                          handleImageChange(e, true)
                                        }
                                        accept="image/*"
                                        id={`edit-image-${item.menu_number}`}
                                      />
                                      <label
                                        htmlFor={`edit-image-${item.menu_number}`}
                                        className="text-sm text-indigo-600 rounded-full px-2 py-1 hover:bg-indigo-100 cursor-pointer"
                                        style={{ fontFamily: "NanumSquareBold" }}
                                      >
                                        이미지 변경
                                      </label>
                                    </div>

                                    <div className="space-y-2">
                                      {/* 이름 입력 필드 */}
                                      <input
                                        type="text"
                                        name="name"
                                        value={editItem.name}
                                        onChange={(e) =>
                                          handleInputChange(e, true)
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                        placeholder="이름"
                                        style={{ fontFamily: "NanumSquareBold" }}
                                      />

                                      {/* 가격 필드 */}
                                      <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <DollarSign className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                          type="number"
                                          name="price"
                                          value={editItem.price}
                                          onChange={(e) =>
                                            handleInputChange(e, true)
                                          }
                                          className="w-full pl-8 p-2 border border-gray-300 rounded-md"
                                          placeholder="가격"
                                          style={{ fontFamily: "NanumSquareBold" }}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                          <span className="text-xs text-gray-500">
                                            원
                                          </span>
                                        </div>
                                      </div>

                                      {/* 카테고리 선택 UI */}
                                      <div>
                                        <label className="block text-sm font-medium text-gray-600 mt-4 mb-2 flex items-center justify-between">
                                          <span className="flex items-center">
                                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                                            카테고리 선택
                                          </span>
                                          {editItem.category && (
                                            <span className="text-xs text-indigo-600">
                                              선택됨:{" "}
                                              {category.find(
                                                (c) =>
                                                  c.value === editItem.category
                                              )?.label || editItem.category}
                                            </span>
                                          )}
                                        </label>

                                        {/* 카테고리 버튼 그룹 */}
                                        <div className="max-h-24 overflow-y-auto pr-1 custom-scrollbar" style={{ fontFamily: "NanumSquareBold" }}>
                                          <div className="flex flex-wrap gap-1.5 mb-1">
                                            {category.map((cat) => (
                                              <button
                                                key={cat.value}
                                                type="button"
                                                onClick={() =>
                                                  setEditItem({
                                                    ...editItem,
                                                    category: cat.value,
                                                  })
                                                }
                                                className={`px-2 py-1 text-xs rounded-md transition-colors ${
                                                  editItem.category ===
                                                  cat.value
                                                    ? "bg-indigo-100 text-indigo-700 border border-indigo-300 font-medium"
                                                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
                                                }`}
                                              >
                                                {cat.label}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex justify-end space-x-2 mt-3">
                                      <button
                                        onClick={handleCancelEdit}
                                        className="p-2 text-gray-500 hover:text-gray-700 rounded-md transition-colors"
                                      >
                                        <X size={20} />
                                      </button>
                                      <button
                                        onClick={handleSaveEdit}
                                        className="p-2 text-indigo-600 hover:text-indigo-800 rounded-md transition-colors"
                                      >
                                        <Check size={20} />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  // 표시 모드 코드
                                  <div className="flex items-center">
                                    <img
                                      src={getImagePreview(item.image)}
                                      alt={item.name}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="ml-3 flex-1 ">
                                      <h5 className="font-medium text-gray-800">
                                        {item.name}
                                      </h5>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-indigo-600 ">
                                          {Number(item.price).toLocaleString()}
                                          원
                                        </span>
                                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                                          {item.category}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex space-x-1">
                                      <button
                                        onClick={() => handleEdit(item)}
                                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-md transition-colors"
                                        title="수정"
                                      >
                                        <PencilLine size={isMobile ? 18 : 20} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteItem(item)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        title="삭제"
                                      >
                                        <Trash size={isMobile ? 18 : 20} />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>

                {/* 저장 버튼 - 모바일에서는 항상 표시 */}
                <button
                  onClick={handleComplete}
                  disabled={menuItems.length === 0}
                  className={`w-full py-4 rounded-xl font-medium flex items-center justify-center transition-all duration-200 ${
                    menuItems.length === 0
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm hover:shadow"
                  }`}
                >
                  <Check className="mr-2" size={20} />
                  {menuItems.length > 0
                    ? `${menuItems.length}개 ${menuTitle} 저장하기`
                    : `저장할 ${menuTitle}을 추가해주세요`}
                </button>
              </div>
            )}
          </div>

          {/* 모바일에서 탭 전환 버튼 (화면 아래 고정) */}
          {isMobile && !showItemList && menuItems.length > 0 && (
            <div className="fixed bottom-4 right-4 z-30">
              <button
                onClick={() => setShowItemList(true)}
                className="bg-indigo-600 text-white p-3 rounded-full shadow-lg flex items-center justify-center"
              >
                <MenuIcon size={24} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {menuItems.length}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* 메시지 모달들 */}
        <ModalMSG
          show={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          title="Success"
        >
          <p style={{ whiteSpace: "pre-line" }}>{message}</p>
        </ModalMSG>

        <ModalErrorMSG
          show={showErrorMessageModal}
          onClose={() => setShowErrorMessageModal(false)}
          title="Error"
        >
          <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
        </ModalErrorMSG>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }

          /* iOS 스타일 패딩 제거 */
          input,
          textarea,
          select,
          button {
            -webkit-appearance: none;
            border-radius: 0.5rem;
          }

          /* 입력필드 포커스 시 아웃라인 스타일 */
          input:focus,
          textarea:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}
