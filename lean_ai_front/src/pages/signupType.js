import React from "react";
import { useRouter } from "next/router";
import { ChevronLeft, Store, Building2 } from "lucide-react";

const Card = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-2 p-8 rounded-lg 
                 border border-gray-200 hover:border-2 hover:border-indigo-400 cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      <div className="h-28 w-28 flex items-center justify-center rounded-full bg-indigo-400">
        {icon}
      </div>
      <p
        className="text-gray-600 text-lg flex text-center items-center whitespace-pre-line h-20"
        style={{ fontFamily: "NanumSquareBold" }}
      >
        {description}
      </p>
      <button
        className="text-lg px-3 py-2 rounded-md bg-indigo-400 hover:bg-indigo-500 text-white"
        style={{ fontFamily: "NanumSquareBold" }}
      >
        가입하기
      </button>
    </div>
  );
};

const SignupType = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex justify-center items-center bg-violet-50">
      <div className="max-w-5xl w-full mx-auto py-12 px-8 shadow-lg rounded-xl bg-white flex flex-col gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <ChevronLeft
              className="h-8 w-8 text-indigo-600 cursor-pointer mr-2"
              onClick={() => router.push("/")}
            />
            <h1
              className="text-4xl font-bold text-center text-indigo-600"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              회원가입
            </h1>
          </div>
        </div>

        <div
          className="text-3xl text-center text-gray-700"
          style={{ fontFamily: "NanumSquareBold" }}
        >
          회원 유형을 선택해주세요
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
          <Card
            title="음식점/판매점"
            description={"음식점이나 판매점을 \n운영 중이시라면?"}
            icon={<Store className="text-white h-20 w-20" />}
            onClick={() => router.push("/signupStep1")}
          />
          <Card
            title="공공기관"
            description={"공공기관에서 \n업무 중이시라면?"}
            icon={<Building2 className="text-white h-20 w-20" />}
            onClick={() => router.push("/signupPublicStep1")}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupType;
