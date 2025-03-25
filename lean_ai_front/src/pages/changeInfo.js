import React, { useState, useEffect, useRef } from "react";
import { Camera, Store, Download } from "lucide-react";
import LoadingSection from "@/components/component/commons/loadingSection";
import { getCategoryIcon, getMenuTitle } from "@/utils/storeUtils";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { fetchStoreData } from "@/fetch/fetchStoreData";
import { fetchStoreMenu } from "@/fetch/fetchStoreMenu";
import ActiveTabBasic from "@/components/component/store/storeActiveTabBasic";
import ActiveTabMenu from "@/components/component/store/storeActiveTabMenu";
import TabButton from "@/components/component/ui/tabButton";
import StoreHourEdit from "@/components/component/store/storeHourEdit";
import ImageModal from "@/components/modal/bannerImageModal";
import EditModal from "@/components/modal/storeInfoEditModal";
import AddMenuModal from "@/components/modal/addMenuModal";
import ViewMenuModal from "@/components/modal/viewMenuModal";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

const ChangeInfo = () => {
  const { token } = useAuth(); // 인증 토큰 가져오기
  const { storeID } = useStore(); // 현재 매장 ID 가져오기
  const [isOwner, setIsOwner] = useState(""); // 매장 소유 여부
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("basic"); // 현재 활성화된 탭 ('basic' or 'menu')

  // 배너 이미지 관련 상태
  const [storeImage, setStoreImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  // 매장 정보 상태
  const [storeInfo, setStoreInfo] = useState({
    store_name: "",
    store_introduction: "",
    store_category: "",
    opening_hours: "",
    store_address: "",
    store_tel: "",
    store_information: "",
  });

  // 모달 상태 관리
  const [modalState, setModalState] = useState({
    storeHourEdit: false,
    addMenu: false,
    viewMenu: false,
    image: false,
    edit: false,
    error: false,
    message: false,
  });

  const [menu, setMenu] = useState([]); // 메뉴 데이터
  const [slug, setSlug] = useState(); // 매장 식별자
  const menuTitle = getMenuTitle(storeInfo.store_category); // 메뉴 제목 설정
  const CategoryIcon = getCategoryIcon(storeInfo.store_category); // 카테고리에 따른 아이콘 가져오기
  const fileInputRef = useRef(null); // 파일 입력 필드 참조

  // 수정 모달 관련 상태
  const [editText, setEditText] = useState("");
  const [currentEditElement, setCurrentEditElement] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 매장 및 메뉴 데이터 가져오기
  useEffect(() => {
    if (token && storeID) {
      setIsOwner(true);
      fetchStoreData(
        { storeID },
        token,
        (data) => {
          const store = data.store;

          // 서버에서 받은 데이터를 상태에 매핑
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

          // 배너 이미지 URL 설정
          const bannerPath = store.banner || "";
          const storeImageUrl = bannerPath.startsWith("/media/")
            ? `${MEDIA_URL}${bannerPath}`
            : "/images/chatbot.png";
          setPreviewImage(storeImageUrl);
        },
        (errorMsg) => {
          setErrorMessage(errorMsg);
          updateModalState("error", true);
        },
        isOwner
      ).finally(() => setIsLoading(false));

      // 매장 메뉴 데이터 가져오기
      fetchStoreMenu({ storeID }, token, setMenu, (errorMsg) => {
        setErrorMessage(errorMsg);
        updateModalState("error", true);
      });
    }
  }, [storeID, token]);

  // 모달 상태 업데이트
  const updateModalState = (modalKey, isOpen) => {
    setModalState((prevState) => ({
      ...prevState,
      [modalKey]: isOpen,
    }));
  };

  // 모달 닫기 함수들
  const closeStoreHourEditModal = () =>
    updateModalState("storeHourEdit", false);
  const closeImageModal = () => updateModalState("image", false);
  const closeEditModal = () => updateModalState("edit", false);
  const closeAddMenuModal = () => updateModalState("addMenu", false);
  const closeViewMenu = () => updateModalState("viewMenu", false);
  const handleMessageModalClose = () => {
    updateModalState("message", false);
    setMessage("");
  };
  const handleErrorMessageModalClose = () => {
    updateModalState("error", false);
    setErrorMessage("");
  };

  // 영업 시간 저장 핸들러
  const handleStoreHoursSave = (updatedHours) => {
    setStoreInfo({
      ...storeInfo,
      opening_hours: updatedHours, // 업데이트된 영업 시간 저장
    });
  };

  // 이미지 모달 열기
  const openImageModal = () => updateModalState("image", true);

  // 이미지 선택 버튼 클릭 핸들러
  const handleChooseImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 파일 변경 핸들러
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setStoreImage(file);
      setPreviewImage(URL.createObjectURL(file));
      closeImageModal();
    }
  };

  // 기본 이미지 적용 핸들러
  const applyDefaultImage = () => {
    setPreviewImage("/images/chatbot.png");
    setStoreImage(null);
    closeImageModal();
  };

  // 텍스트 수정 저장 핸들러
  const saveChanges = () => {
    if (editText.trim() !== "") {
      setStoreInfo({
        ...storeInfo,
        [currentEditElement]: editText,
      });
    }
    closeEditModal();
  };

  // 텍스트 요소 삭제 핸들러
  const deleteElement = () => {
    setStoreInfo({
      ...storeInfo,
      [currentEditElement]: "",
    });
    closeEditModal();
  };

  // 모든 변경사항 저장
  const saveAllChanges = async () => {
    try {
      setIsSaving(true); // 저장 중 상태로 설정 - 버튼 비활성화
      const formData = new FormData();

      // 매장 정보 필드 추가
      Object.keys(storeInfo).forEach((key) => {
        formData.append(key, storeInfo[key] || "");
      });

      // 이미지 파일 추가 (있는 경우)
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
      updateModalState("message", true);
    } catch (error) {
      console.error("Error saving changes:", error);
      setErrorMessage("정보 저장에 실패했습니다. 다시 시도해주세요.");
      updateModalState("error", true);
    } finally {
      setIsSaving(false); // 저장 중 상태 해제 - 버튼 활성화
    }
  };

  // 로딩 상태 UI
  if (isLoading) {
    return <LoadingSection message="매장 데이터를 가져오는 중 입니다!"/>
  }

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* 이미지 업로드 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* 배너 이미지 섹션 */}
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

      {/* 탭 네비게이션 */}
      <div className="flex items-center justify-center p-2">
        <div className="flex space-x-3">
          <TabButton
            active={activeTab === "basic"}
            icon={Store}
            label="기본 정보"
            onClick={() => setActiveTab("basic")}
          />
          <TabButton
            active={activeTab === "menu"}
            icon={CategoryIcon}
            label={`${menuTitle || "상품"} 정보`}
            onClick={() => setActiveTab("menu")}
          />
        </div>
      </div>

      <div className="flex flex-col flex-grow px-4 py-2 overflow-y-auto">
        {/* 기본정보 탭 내용 */}
        {activeTab === "basic" && (
          <ActiveTabBasic
            storeInfo={storeInfo}
            updateModalState={updateModalState}
            setCurrentEditElement={setCurrentEditElement} // 추가
            setEditText={setEditText} // 추가
          />
        )}

        {/*메뉴/제품 탭 내용 */}
        {activeTab === "menu" && (
          <ActiveTabMenu
            menuTitle={menuTitle}
            updateModalState={updateModalState}
          />
        )}
      </div>

      {/* 저장 버튼 - 기본 정보 탭에서만 표시 */}
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

      {/* 각종 모달 컴포넌트들 */}
      {/* 이미지 편집 모달 */}
      <ImageModal
        isOpen={modalState.image}
        onClose={closeImageModal}
        onChooseImage={handleChooseImage}
        onApplyDefaultImage={applyDefaultImage}
      />

      {/* 텍스트 편집 모달 */}
      <EditModal
        isOpen={modalState.edit}
        onClose={closeEditModal}
        currentEditElement={currentEditElement}
        editText={editText}
        setEditText={setEditText}
        onSave={saveChanges}
        onDelete={deleteElement}
      />

      {/* 영업시간 편집 모달 */}
      <StoreHourEdit
        isOpen={modalState.storeHourEdit}
        onClose={closeStoreHourEditModal}
        onSave={handleStoreHoursSave}
        hours={storeInfo.opening_hours}
      />

      {/* 메뉴 추가 모달 */}
      <AddMenuModal
        isOpen={modalState.addMenu}
        onClose={closeAddMenuModal}
        onSave={(newMenu) => {
          setMenu([...menu, newMenu]); // 새 메뉴 항목 추가
        }}
        slug={slug}
        storeCategory={storeInfo.store_category}
      />

      {/* 메뉴 보기 모달 */}
      <ViewMenuModal
        isOpen={modalState.viewMenu}
        onClose={closeViewMenu}
        slug={slug}
        storeCategory={storeInfo.store_category}
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={modalState.message}
        onClose={handleMessageModalClose}
        title="Success"
      >
        <p style={{ whiteSpace: "pre-line" }}>{message}</p>
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={modalState.error}
        onClose={handleErrorMessageModalClose}
        title="Error"
      >
        <p style={{ whiteSpace: "pre-line" }}>{errorMessage}</p>
      </ModalErrorMSG>

      {/* 애니메이션 스타일 */}
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
