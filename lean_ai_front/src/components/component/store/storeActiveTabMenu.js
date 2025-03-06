import React from "react";
import { useRouter } from "next/router";
import { Plus, Search, Image as ImageIcon } from "lucide-react";
import MenuActionButton from "@/components/component/ui//menuActionButton";

export default function ActiveTabMenu({ menuTitle, updateModalState }) {
  const router = useRouter();
  const goToAddMenu = () => updateModalState("addMenu", true);
  const goToViewMenu = () => updateModalState("viewMenu", true);
  const goToModifyFeed = () => router.push("/modifyFeed");

  return (
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
          description={`새로운 ${menuTitle || "상품"}을 추가하고 관리하세요`}
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
  );
}
