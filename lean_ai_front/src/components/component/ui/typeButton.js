import React from "react";
import { Store, Building2, Landmark } from "lucide-react";
import { useLoginType } from "@/contexts/loginTypeContext";
import { useStore } from "@/contexts/storeContext";

const TypeButton = () => {
  const { loginType, setLoginType } = useLoginType();
  const { setStoreID } = useStore();

  const userTypes = [
    { id: "store", name: "소상공인", icon: <Store className="h-4 w-4" /> },
    { id: "corporation", name: "기업", icon: <Building2 className="h-4 w-4" /> },
    { id: "public", name: "공공기관", icon: <Landmark className="h-4 w-4" /> },
  ];

  const handleTypeSelect = (typeId) => {
    setLoginType(typeId);
    setStoreID(null, typeId);
  };

  return (
    <div className="mb-3">
      <div className="flex space-x-1 rounded-md">
        {userTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => handleTypeSelect(type.id)}
            className={`flex items-center justify-center py-1 px-2 rounded-md text-sm flex-1 transition-colors ${
              loginType === type.id
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
