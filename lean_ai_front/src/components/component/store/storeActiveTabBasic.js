import React from "react";
import { Store, Clock, MapPin, Phone, Info } from "lucide-react";
import { StoreEditInfoItem } from "@/components/component/ui/infoItem";
import { formatPhoneNumber } from "@/utils/telUtils";

// Properly destructure props and add the missing function props
export default function ActiveTabBasic({ storeInfo, updateModalState, setCurrentEditElement, setEditText }) {
  const openStoreHourEditModal = () => updateModalState("storeHourEdit", true);
  const openEditModal = (elementId) => {
    setCurrentEditElement(elementId);
    setEditText(storeInfo[elementId] || "");
    updateModalState("edit", true);
  };

  // 사업 유형 매핑
  const businessTypeMap = {
    FOOD: "음식점",
    RETAIL: "판매점",
    UNMANNED: "무인매장",
    OTHER: "기타",
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center mb-4">
        <div className="w-1.5 h-6 bg-indigo-600 rounded-r mr-2"></div>
        <h3 className="text-2xl text-gray-800 font-bold">기본 정보</h3>
      </div>

      <StoreEditInfoItem
        icon={Store}
        label="매장 이름"
        value={storeInfo.store_name}
        onEdit={() => openEditModal("store_name")}
        noValue={!storeInfo.store_name}
      />

      <StoreEditInfoItem
        icon={Info}
        label="매장 소개"
        value={storeInfo.store_introduction}
        onEdit={() => openEditModal("store_introduction")}
        noValue={!storeInfo.store_introduction}
      />

      <StoreEditInfoItem
        icon={Store}
        label="비즈니스 종류"
        value={businessTypeMap[storeInfo.store_category] || ""}
        onEdit={() => openEditModal("store_category")}
        noValue={!storeInfo.store_category}
      />

      <StoreEditInfoItem
        icon={Clock}
        label="영업 시간"
        value={storeInfo.opening_hours}
        onEdit={openStoreHourEditModal}
        noValue={!storeInfo.opening_hours}
      />

      <StoreEditInfoItem
        icon={MapPin}
        label="매장 위치"
        value={storeInfo.store_address}
        onEdit={() => openEditModal("store_address")}
        noValue={!storeInfo.store_address}
      />

      <StoreEditInfoItem
        icon={Phone}
        label="매장 번호"
        value={formatPhoneNumber(storeInfo.store_tel)}
        onEdit={() => openEditModal("store_tel")}
        noValue={!storeInfo.store_tel}
      />

      <StoreEditInfoItem
        icon={Info}
        label="매장 정보"
        value={storeInfo.store_information}
        onEdit={() => openEditModal("store_information")}
        noValue={!storeInfo.store_information}
      />
    </div>
  );
}
