import React, { useState } from "react";
import { Store, Building2, Landmark } from "lucide-react";
import { usePublic } from "@/contexts/publicContext";
import { useCorporate } from "@/contexts/corporateContext";
import { useStore } from "@/contexts/storeContext";

const TypeButton = () => {
  const { isPublicOn, togglePublicOn } = usePublic();
  const { isCorporateOn, toggleCorporateOn } = useCorporate();
  const { setStoreID } = useStore();
  const [selectedType, setSelectedType] = useState("");

  const userTypes = [
    { id: "store", name: "소상공인", icon: <Store className="h-4 w-4" />, type: "store" },
    { id: "corporate", name: "기업", icon: <Building2 className="h-4 w-4" />, type: "corporate" },
    { id: "public", name: "공공기관", icon: <Landmark className="h-4 w-4" />, type: "public" }
  ];

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    const selectedUserType = userTypes.find(type => type.id === typeId);

    if (selectedUserType) {
      if (selectedUserType.type === "public") {
        if (!isPublicOn) togglePublicOn(); // 공공기관 선택 시 활성화
        if (isCorporateOn) toggleCorporateOn(); // 기업이면 해제
        setStoreID(null, "public");
      } else if (selectedUserType.type === "corporate") {
        if (isPublicOn) togglePublicOn(); // 공공기관이면 해제
        if (!isCorporateOn) toggleCorporateOn(); // 기업 선택 시 활성화
        setStoreID(null, "corporate");
      } else {
        if (isPublicOn) togglePublicOn(); // 공공기관이면 해제
        if (isCorporateOn) toggleCorporateOn(); // 기업이면 해제
        setStoreID(null, "store");
      }
    }
  };

  return (
    <div className="mb-3">
      <div className="flex space-x-1 rounded-md">
        {userTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`flex items-center justify-center py-1 px-2 rounded-md text-sm flex-1 transition-colors ${
              selectedType === type.id
                ? "bg-indigo-500 text-white font-medium"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {type.icon}
            <span className="ml-1" style={{ fontFamily: "NanumSquareBold" }}>
              {type.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TypeButton;
