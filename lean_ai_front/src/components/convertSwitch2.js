import React from "react";

const ConvertSwitch = ({ isPublicOn, togglePublicOn }) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div
        className="flex border border-indigo-500 rounded-full"
        style={{ width: "220px", height: "35px" }}
      >
        {/* 일반 회원 버튼 */}
        <button
          onClick={() => togglePublicOn(false)} // 클릭 시 부모 컴포넌트의 상태를 업데이트
          className={`flex-1 text-center transition-all rounded-l-full duration-300 ${
            !isPublicOn ? "bg-indigo-400 text-white font-semibold shadow-md" : "text-indigo-500"
          }`}
        >
          일반 회원
        </button>

        {/* 공공기관 회원 버튼 */}
        <button
          onClick={() => togglePublicOn(true)} // 클릭 시 부모 컴포넌트의 상태를 업데이트
          className={`flex-1 text-center rounded-r-full transition-all duration-300 ${
            isPublicOn ? "bg-indigo-400 text-white font-semibold shadow-md" : "text-indigo-500"
          }`}
        >
          공공기관 회원
        </button>
      </div>
    </div>
  );
};

export default ConvertSwitch;
