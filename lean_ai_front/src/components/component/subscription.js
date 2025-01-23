import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CreditCard } from "lucide-react";
import { fetchCardInfo } from "../../fetch/fetchCardInfo";
import CardRegistrationModal from "../modal/cardRegistrationModal";
import CardChangeModal from "../modal/cardChangeModal";
import CardCancelModal from "../modal/cardCancelModal";
import ModalMSG from "../modal/modalMSG";
import ModalErrorMSG from "../modal/modalErrorMSG";
import config from "../../../config";

const SubscriptionSection = ({ isPublicOn, token, userData }) => {
  const router = useRouter(); 
  const [isRegistrationOpen, setRegistrationOpen] = useState(false); 
  const [isChangeOpen, setChangeOpen] = useState(false);
  const [isCancelOpen, setCancelOpen] = useState(false); 
  const [cardInfo, setCardInfo] = useState(null); 
  const [message, setMessage] = useState(""); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showMessageModal, setShowMessageModal] = useState(false); 
  const [showErrorModal, setShowErrorModal] = useState(false); 

  // 성공 메시지 모달 닫기
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessage("");
  };

  // 에러 메시지 모달 닫기
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  // 포트원 결제 모듈 로드
  useEffect(() => {
    const loadPortOne = () => {
      const script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js"; // 포트원 SDK
      script.async = true; // 비동기 로드
      document.head.appendChild(script); // DOM에 추가

      script.onload = () => {
        if (window.IMP) {
          // 포트원 모듈 초기화
          window.IMP.init(config.impKey);
        }
      };

      script.onerror = () => {
        console.error("Failed to load PortOne SDK script.");
      };
    };

    loadPortOne(); // 포트원 로드 함수 호출
  }, []);

  // 카드 정보 가져오기
  useEffect(() => {
    if (token) {
      fetchCardInfo(token, setCardInfo, setErrorMessage); // 카드 정보를 API에서 가져와 설정
    }
  }, [token]);

  return (
    <div className="flex flex-col space-y-2 items-start mb-5">
      {/* 제목 */}
      <div
        className="font-semibold text-start text-lg"
        style={{ fontFamily: "NanumSquareExtraBold" }}
      >
        정기 구독
      </div>

      {/* 카드 정보 표시 */}
      {cardInfo ? (
        <div className="flex justify-center w-full">
          <div className="bg-white rounded-xl shadow-md p-6 mb-2 border border-indigo-100 flex flex-col items-center">
            <div className="flex items-center justify-between mb-2 w-full">
              <h3
                className="text-lg font-semibold text-indigo-600"
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                등록된 카드 정보
              </h3>
              <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-indigo-500" />
              </div>
            </div>

            {/* 카드 상세 정보 */}
            <div className="space-y-3 w-full">
              <div className="flex items-start space-x-2">
                <span className="text-sm text-gray-500 w-16 ">카드 번호</span>
                <span className="text-sm font-medium text-gray-700">
                  {cardInfo.card_number}
                </span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-sm text-gray-500 w-16 ">카드 회사</span>
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  {/* 카드 회사에 따른 색상 및 라벨 */}
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs rounded-full 
                  ${
                    cardInfo.card_name.includes("신한")
                      ? "bg-blue-100 text-blue-700"
                      : cardInfo.card_name.includes("국민")
                      ? "bg-yellow-100 text-yellow-700"
                      : cardInfo.card_name.includes("삼성")
                      ? "bg-sky-100 text-sky-700"
                      : cardInfo.card_name.includes("현대")
                      ? "bg-green-100 text-green-700"
                      : cardInfo.card_name.includes("롯데")
                      ? "bg-red-100 text-red-700"
                      : cardInfo.card_name.includes("하나")
                      ? "bg-emerald-100 text-emerald-700"
                      : cardInfo.card_name.includes("우리")
                      ? "bg-cyan-100 text-cyan-700"
                      : cardInfo.card_name.includes("농협")
                      ? "bg-lime-100 text-lime-700"
                      : "bg-indigo-100 text-indigo-700" // 기본 색상
                  }`}
                  >
                    {cardInfo.card_name}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // 카드 정보 없을 때 표시
        <div className="flex justify-center w-full">
          <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200 text-center flex flex-col items-center">
            <div className="text-gray-400 mb-2">
              <CreditCard className="h-8 w-8 mx-auto mb-2" />
            </div>
            <p className="text-gray-600" style={{ fontFamily: "NanumSquare" }}>
              등록된 카드 정보가 없습니다
            </p>
          </div>
        </div>
      )}

      {/* 버튼 그룹 */}
      {userData.billing_key ? (
        // Billing Key가 존재할 경우 버튼
        <div className="grid grid-cols-3 gap-2 w-full">
          <button
            className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap w-full"
            style={{ fontFamily: "NanumSquareBold" }}
            onClick={() => setChangeOpen(true)} // 카드 변경 모달 열기
          >
            카드 변경
          </button>
          <button
            className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap w-full"
            style={{ fontFamily: "NanumSquareBold" }}
            onClick={() => setCancelOpen(true)} // 카드 해지 모달 열기
          >
            결제 해지
          </button>
          <button
            className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap w-full"
            style={{ fontFamily: "NanumSquareBold" }}
            onClick={() => router.push("/cardCheck")} // 결제 조회 페이지로 이동
          >
            결제 조회
          </button>
        </div>
      ) : (
        // Billing Key가 없을 경우 버튼
        <div className="grid grid-cols-1 gap-2 w-full">
          <button
            className="text-center bg-indigo-500 text-white rounded-lg px-2 py-1.5 whitespace-nowrap"
            style={{ fontFamily: "NanumSquareBold" }}
            onClick={() => setRegistrationOpen(true)} // 정기 결제 모달 열기
          >
            정기 결제
          </button>
        </div>
      )}

      {/* 모달 컴포넌트 */}
      <CardRegistrationModal
        userData={userData}
        token={token}
        isOpen={isRegistrationOpen}
        onClose={() => setRegistrationOpen(false)} // 카드 등록 모달 닫기
      />

      <CardChangeModal
        userData={userData}
        isOpen={isChangeOpen}
        onClose={() => setChangeOpen(false)} // 카드 변경 모달 닫기
      />

      <CardCancelModal
        userData={userData}
        token={token}
        isOpen={isCancelOpen}
        onClose={() => setCancelOpen(false)} // 카드 해지 모달 닫기
      />

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={closeMessageModal}
        title="Success"
      >
        {message}
      </ModalMSG>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionSection;
