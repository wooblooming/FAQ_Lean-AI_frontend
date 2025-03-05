import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  X,
  Camera,
  Store,
  Clock,
  MapPin,
  Phone,
  Info,
  Download,
  Plus,
  Search,
  Image as ImageIcon,
  ChevronRight,
  AlertCircle,
  Coffee,
  ShoppingBag,
  Package,
} from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { formatPhoneNumber } from "@/utils/telUtils";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { fetchStoreData } from "@/fetch/fetchStoreData";
import { fetchStoreMenu } from "@/fetch/fetchStoreMenu";
import StoreHourEdit from "@/components/component/store/storeHourEdit";
import AddMenuModal from "@/components/modal/addMenuModal";
import ViewMenuModal from "@/components/modal/viewMenuModal";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

// Store Info Item Component - Displays individual information with edit button
const StoreInfoItem = ({
  icon: Icon,
  label,
  value,
  onEdit,
  noValue,
  editable = true,
}) => {
  return (
    <div className="mb-5 group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="bg-indigo-50 p-1.5 rounded-full mr-2 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          <label className="font-semibold text-gray-700">{label}</label>
        </div>
        {editable && (
          <button
            onClick={onEdit}
            className="text-indigo-500 hover:text-indigo-600 p-1.5 rounded-full hover:bg-indigo-50 transition-all duration-200 hover:scale-125"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      {noValue ? (
        <div className="ml-9 flex items-center text-gray-400 italic text-sm">
          <AlertCircle className="h-4 w-4 mr-1.5" />
          정보를 입력해주세요
        </div>
      ) : (
        <div className="ml-9 text-gray-700 min-h-[1.5rem] break-words">
          {value || ""}
        </div>
      )}
      <div className="mt-3 ml-9 border-b border-gray-100"></div>
    </div>
  );
};

// Menu Action Button Component - Creates consistent button styling
const MenuActionButton = ({
  icon: Icon,
  title,
  description,
  onClick,
  color = "indigo",
}) => (
  <button
    onClick={onClick}
    className="flex items-center p-4 bg-indigo-50 border border-indigo-100 rounded-xl transition-all duration-300 hover:shadow-md hover:translate-y-[-2px] text-indigo-600 group"
  >
    <div className="bg-white border border-indigo-100 shadow-sm group-hover:bg-indigo-400 group-hover:text-white group-hover:border-indigo-400 p-2.5 rounded-full mr-4 transition-colors duration-300">
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex flex-col items-start">
      <span className="font-medium text-gray-800 group-hover:text-indigo-700 transition-colors">
        {title}
      </span>
      <span className="text-xs text-gray-500">{description}</span>
    </div>
  </button>
);

// Tab Button Component
const TabButton = ({ active, icon: Icon, label, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
      active
        ? "bg-indigo-600 text-white shadow-md"
        : "bg-white text-gray-700 hover:bg-indigo-50"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span className="font-medium">{label}</span>
  </button>
);

const ChangeInfo = () => {
  const { token } = useAuth();
  const { storeID } = useStore();
  const [isOwner, setIsOwner] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isStoreHourEditModalOpen, setIsStoreHourEditModalOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("basic"); // 'basic' or 'product'

  const [storeImage, setStoreImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isAddMenuModalOpen, setIsAddMenuModalOpen] = useState(false);
  const [isViewMenuModalOpen, setIsViewMenuModalOpen] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    store_name: "",
    store_introduction: "",
    store_category: "",
    opening_hours: "",
    store_address: "",
    store_tel: "",
    store_information: "",
  });
  const [menu, setMenu] = useState([]);
  const [slug, setSlug] = useState();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [currentEditElement, setCurrentEditElement] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const fileInputRef = useRef(null);

  // Business type mapping
  const businessTypeMap = {
    FOOD: "음식점",
    RETAIL: "판매점",
    UNMANNED: "무인매장",
    OTHER: "기타",
  };

  useEffect(() => {
    if (token && storeID) {
      setIsOwner(true);
      fetchStoreData(
        { storeID },
        token,
        (data) => {
          const store = data.store;

          // Map data
          setStoreInfo({
            store_name: store.store_name || "",
            store_introduction: store.store_introduction || "",
            store_category: store.store_category || "",
            opening_hours: store.opening_hours || "",
            store_address: store.store_address || "",
            store_tel: store.store_tel || "",
            store_information: store.store_information || "",
          });

          setSlug(store.slug);

          // Set banner image
          const bannerPath = store.banner || "";
          const storeImageUrl = bannerPath.startsWith("/media/")
            ? `${MEDIA_URL}${bannerPath}`
            : "/images/chatbot.png";
          setPreviewImage(storeImageUrl);
        },
        setErrorMessage,
        setShowErrorMessageModal,
        isOwner
      ).finally(() => setIsLoading(false));

      fetchStoreMenu(
        { storeID },
        token,
        setMenu,
        setErrorMessage,
        setShowErrorMessageModal
      );
    }
  }, [storeID, token]);

  // UI to display while loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-full p-8 bg-white rounded-lg">
        <LoadingSpinner />
        <p className="mt-4 text-indigo-600 font-semibold">
          정보를 불러오는 중...
        </p>
      </div>
    );
  }

  // Modal handlers
  const openStoreHourEditModal = () => setIsStoreHourEditModalOpen(true);
  const closeStoreHourEditModal = () => setIsStoreHourEditModalOpen(false);
  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const openEditModal = (elementId) => {
    setCurrentEditElement(elementId);
    setEditText(storeInfo[elementId] || "");
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => setIsEditModalOpen(false);
  const goToAddMenu = () => setIsAddMenuModalOpen(true);
  const closeAddMenuModal = () => setIsAddMenuModalOpen(false);
  const goToViewMenu = () => setIsViewMenuModalOpen(true);
  const closeViewMenu = () => setIsViewMenuModalOpen(false);
  const goToModifyFeed = () => router.push("/modifyFeed");

  // Business function handlers
  const handleStoreHoursSave = (updatedHours) => {
    setStoreInfo({
      ...storeInfo,
      opening_hours: updatedHours,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoreImage(file);
      setPreviewImage(URL.createObjectURL(file));
      closeImageModal();
    }
  };

  const chooseImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const applyDefaultImage = () => {
    setPreviewImage("/images/chatbot.png");
    setStoreImage(null);
    closeImageModal();
  };

  const saveChanges = () => {
    if (editText.trim() !== "") {
      setStoreInfo({
        ...storeInfo,
        [currentEditElement]: editText,
      });
    }
    closeEditModal();
  };

  const deleteElement = () => {
    setStoreInfo({
      ...storeInfo,
      [currentEditElement]: "",
    });
    closeEditModal();
  };

  const saveAllChanges = async () => {
    try {
      setIsSaving(true);
      const formData = new FormData();

      // Add storeInfo fields
      Object.keys(storeInfo).forEach((key) => {
        formData.append(key, storeInfo[key] || "");
      });

      // Add image file
      if (storeImage) {
        formData.append("banner", storeImage);
      }

      const response = await fetch(`${API_DOMAIN}/api/stores/${storeID}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("정보 저장에 실패했습니다.");
      }

      await response.json();
      setMessage("정보가 성공적으로 저장되었습니다.");
      setShowMessageModal(true);
    } catch (error) {
      console.error("Error saving changes:", error);
      setErrorMessage("정보 저장에 실패했습니다. 다시 시도해주세요.");
      setShowErrorMessageModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // Modal close handlers
  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  // Set menu title based on store category
  const menuTitle =
    storeInfo.store_category === "FOOD"
      ? "메뉴"
      : storeInfo.store_category === "RETAIL" ||
        storeInfo.store_category === "UNMANNED" ||
        storeInfo.store_category === "OTHER"
      ? "상품"
      : "";

  // Get the appropriate icon based on store category
  const getCategoryIcon = () => {
    switch (storeInfo.store_category) {
      case "FOOD":
        return Coffee;
      case "RETAIL":
      case "UNMANNED":
        return ShoppingBag;
      default:
        return Package;
    }
  };

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Banner image with overlay gradient for better text visibility */}
      <div className="relative w-full" style={{ height: "200px" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60 z-10"></div>
        <img
          src={previewImage}
          className="w-full h-full object-cover"
          alt="Store Banner"
        />
        <div className="absolute bottom-0 left-0 w-full p-5 z-20">
          <h2 className="text-3xl font-bold text-white drop-shadow-md">
            {storeInfo.store_name || "매장 정보 입력"}
          </h2>
        </div>
        <div className="absolute bottom-4 right-4 z-20">
          <button
            onClick={openImageModal}
            className="bg-white/90 hover:bg-white text-indigo-600 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            title="배너 이미지 변경"
          >
            <Camera className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-center p-2">
        <div className="flex space-x-3">
          <TabButton
            active={activeTab === "basic"}
            icon={Store}
            label="기본 정보"
            onClick={() => setActiveTab("basic")}
          />
          <TabButton
            active={activeTab === "product"}
            icon={CategoryIcon}
            label={`${menuTitle || "상품"} 정보`}
            onClick={() => setActiveTab("product")}
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4 py-2 overflow-y-auto">
        {/* Basic Information Section */}
        {activeTab === "basic" && (
          <div className="animate-fadeIn">
            <div className="flex items-center mb-4">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-r mr-2"></div>
              <h3 className="text-2xl text-gray-800 font-bold">기본 정보</h3>
            </div>

            <StoreInfoItem
              icon={Store}
              label="매장 이름"
              value={storeInfo.store_name}
              onEdit={() => openEditModal("store_name")}
              noValue={!storeInfo.store_name}
            />

            <StoreInfoItem
              icon={Info}
              label="매장 소개"
              value={storeInfo.store_introduction}
              onEdit={() => openEditModal("store_introduction")}
              noValue={!storeInfo.store_introduction}
            />

            <StoreInfoItem
              icon={Store}
              label="비즈니스 종류"
              value={businessTypeMap[storeInfo.store_category] || ""}
              onEdit={() => openEditModal("store_category")}
              noValue={!storeInfo.store_category}
            />

            <StoreInfoItem
              icon={Clock}
              label="영업 시간"
              value={storeInfo.opening_hours}
              onEdit={openStoreHourEditModal}
              noValue={!storeInfo.opening_hours}
            />

            <StoreInfoItem
              icon={MapPin}
              label="매장 위치"
              value={storeInfo.store_address}
              onEdit={() => openEditModal("store_address")}
              noValue={!storeInfo.store_address}
            />

            <StoreInfoItem
              icon={Phone}
              label="매장 번호"
              value={formatPhoneNumber(storeInfo.store_tel)}
              onEdit={() => openEditModal("store_tel")}
              noValue={!storeInfo.store_tel}
            />

            <StoreInfoItem
              icon={Info}
              label="매장 정보"
              value={storeInfo.store_information}
              onEdit={() => openEditModal("store_information")}
              noValue={!storeInfo.store_information}
            />
          </div>
        )}

        {/* Menu/Product Information Section */}
        {activeTab === "product" && (
          <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-r mr-2"></div>
                <div className="flex items-center">
                  <h3 className="text-2xl text-gray-800 font-bold">
                    {menuTitle || "상품"} 정보
                  </h3>
                </div>
              </div>
            </div>

            {/* Menu Action Buttons */}
            <div className="grid gap-4 mt-4">
              <MenuActionButton
                icon={Plus}
                title={`${menuTitle || "상품"} 추가`}
                description={`새로운 ${
                  menuTitle || "상품"
                }을 추가하고 관리하세요`}
                onClick={goToAddMenu}
              />

              <MenuActionButton
                icon={Search}
                title={`${menuTitle || "상품"} 보기`}
                description={`등록된 ${menuTitle || "상품"} 목록을 확인하세요`}
                onClick={goToViewMenu}
              />

              <MenuActionButton
                icon={ImageIcon}
                title="피드 추가"
                description="피드를 추가하여 고객들의 관심을 끌어보세요"
                onClick={goToModifyFeed}
              />
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      {activeTab === "basic" && (
      <div className="p-5 border-t border-indigo-100">
        <button
          onClick={saveAllChanges}
          disabled={isSaving}
          className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl text-white font-semibold text-lg transition-all ${
            isSaving
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 active:from-indigo-800 active:to-indigo-900 shadow-md hover:shadow-lg"
          }`}
        >
          {isSaving ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>저장 중...</span>
            </>
          ) : (
            <>
              <Download className="h-5 w-5" />
              <span>변경사항 저장</span>
            </>
          )}
        </button>
      </div>
    )}

      {/* Banner Image Change Modal */}
      {isImageModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-80 transform transition-all animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                배너 사진 설정
              </h2>
              <button
                onClick={closeImageModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4">
              <button
                onClick={chooseImage}
                className="w-full py-3 px-4 flex items-center space-x-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors"
              >
                <Camera className="h-5 w-5" />
                <span>앨범에서 사진 선택</span>
              </button>

              <button
                onClick={applyDefaultImage}
                className="w-full py-3 px-4 flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
              >
                <Store className="h-5 w-5" />
                <span>기본 이미지 적용</span>
              </button>

              <button
                onClick={closeImageModal}
                className="w-full py-3 px-4 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors mt-2"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Info Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 animate-fadeIn">
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-96 transform transition-all animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {(() => {
                  switch (currentEditElement) {
                    case "store_name":
                      return "매장 이름";
                    case "store_introduction":
                      return "매장 소개";
                    case "store_category":
                      return "비즈니스 종류";
                    case "store_address":
                      return "매장 위치";
                    case "store_tel":
                      return "매장 번호";
                    case "store_information":
                      return "매장 정보";
                    default:
                      return "내용 수정";
                  }
                })()}
              </h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {currentEditElement === "store_category" ? (
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-white mt-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              >
                <option value="">비즈니스 종류 선택</option>
                <option value="FOOD">음식점</option>
                <option value="RETAIL">판매점</option>
                <option value="UNMANNED">무인매장</option>
                <option value="OTHER">기타</option>
              </select>
            ) : (
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 min-h-[120px] resize-none mt-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder={`${
                  currentEditElement === "store_name"
                    ? "매장 이름을 입력하세요"
                    : currentEditElement === "store_introduction"
                    ? "매장 소개를 입력하세요"
                    : currentEditElement === "store_address"
                    ? "매장 위치를 입력하세요"
                    : currentEditElement === "store_tel"
                    ? "매장 번호를 입력하세요"
                    : currentEditElement === "store_information"
                    ? "매장 정보를 입력하세요"
                    : "내용을 입력하세요"
                }`}
              />
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={deleteElement}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                초기화
              </button>
              <button
                onClick={saveChanges}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* StoreHourEdit Modal */}
      <StoreHourEdit
        isOpen={isStoreHourEditModalOpen}
        onClose={closeStoreHourEditModal}
        onSave={handleStoreHoursSave}
        hours={storeInfo.opening_hours}
      />

      {/* AddMenuModal */}
      <AddMenuModal
        isOpen={isAddMenuModalOpen}
        onClose={closeAddMenuModal}
        onSave={(newMenu) => {
          setMenu([...menu, newMenu]);
        }}
        slug={slug}
        menuTitle={menuTitle}
      />

      {/* ViewMenuModal */}
      <ViewMenuModal
        isOpen={isViewMenuModalOpen}
        onClose={closeViewMenu}
        slug={slug}
        menuTitle={menuTitle}
      />

      {/* Success Message Modal */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
      </ModalMSG>

      {/* Error Message Modal */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
      </ModalErrorMSG>

      <style jsx global>{`
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChangeInfo;
