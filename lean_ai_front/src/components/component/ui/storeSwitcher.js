"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Store, Check, Plus, Minus } from "lucide-react";
import { useRouter } from "next/router";
import { useStore } from "@/contexts/storeContext";
import AddStoreModal from "@/components/modal/addStoreModal";
import DeleteStoreModal from "@/components/modal/deleteStoreModal";

const StoreSwitcher = ({ storeList = [], setStoreList }) => {
  // ✅ setStoreList 추가
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { storeID, setStoreID } = useStore();
  const [showAddStoreModal, setShowAddStoreModal] = useState(false);
  const [showDeleteStoreModal, setShowDeleteStoreModal] = useState(false);

  // 현재 선택된 스토어 찾기
  const [currentStore, setCurrentStore] = useState(null);

  useEffect(() => {
    if (storeList.length > 0) {
      const matchingStore = storeList.find(
        (store) => store.store_id === Number(storeID)
      );
      setCurrentStore(matchingStore || storeList[0]);
    }
  }, [storeID, storeList]);

  // storeID 값이 sessionStorage와 일치하는지 확인
  useEffect(() => {
    const storedID = sessionStorage.getItem("storeID");
    if (storedID && storeID === null) {
      setStoreID(storedID);
    }
  }, []);

  // 스토어 전환 처리 함수
  const handleStoreChange = (newStoreID) => {
    setStoreID(newStoreID);
    setCurrentStore(
      storeList.find((store) => store.store_id === newStoreID) || storeList[0]
    );
    setIsOpen(false);
    router.reload();
  };


  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (storeList.length <= 0 || !currentStore) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 transition-colors"
        style={{width: "160px"}}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-100 rounded-md p-1.5">
            <Store className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-gray-800 truncate">
              {currentStore?.store_name || "스토어 선택"}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10" >
          {storeList.map((store) => (
            <button
              key={store.store_id}
              className={`w-full px-4 py-2 text-left hover:bg-indigo-50 flex items-center justify-between ${
                store.store_id === storeID ? "bg-indigo-50" : ""
              }`}
              onClick={() => handleStoreChange(store.store_id)}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-indigo-100 rounded-md p-1.5">
                  <Store className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800 truncate max-w-[150px]">
                    {store.store_name}
                  </span>
                </div>
              </div>
              {store.store_id === storeID && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
            </button>
          ))}

          {/* "스토어 추가하기" 버튼 추가 */}
          <button
            className="w-full px-4 py-2 text-left flex items-center font-medium hover:bg-blue-200 transition-colors"
            onClick={() => setShowAddStoreModal(true)}
          >
            <div className="bg-blue-100 rounded-full p-1 flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
            <span className="ml-2">스토어 추가</span>
          </button>

          {/* "스토어 삭제하기" 버튼 추가 */}
          <button
            className="w-full px-4 py-2 text-left flex items-center font-medium hover:bg-gray-200 transition-colors"
            onClick={() => setShowDeleteStoreModal(true)}
          >
            <div className="bg-gray-100 rounded-full p-1 flex items-center justify-center">
              <Minus className="h-4 w-4 text-gray-600" />
            </div>
            <span className="ml-2">스토어 삭제</span>
          </button>
        </div>
      )}

      {showAddStoreModal && (
        <AddStoreModal
          show={showAddStoreModal}
          onClose={() => setShowAddStoreModal(false)}
        />
      )}
      {showDeleteStoreModal && (
        <DeleteStoreModal
          show={showDeleteStoreModal}
          storeList={storeList}
          currentStore={currentStore}
          onClose={() => setShowDeleteStoreModal(false)}
        />
      )}
    </div>
  );
};

export default StoreSwitcher;
