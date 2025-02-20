import React, { useState } from "react";
import { CreditCard, ArrowRight } from "lucide-react";
import CardRegistrationModal from "../../modal/cardRegistrationModal";
import ModalMSG from "../../modal/modalMSG";
import ModalErrorMSG from "../../modal/modalErrorMSG";

const SubscriptionSignup = ({ token, userData }) => {
  const [isRegistrationOpen, setRegistrationOpen] = useState(false);
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

  return (
    <div className="flex flex-col space-y-4 items-center text-center justify-center">
      <h3
        style={{ fontFamily: "NanumSquareBold" }}
        className="text-center text-lg text-gray-900"
      >
        AI 기반 맞춤 서비스를 경험하세요!
      </h3>

      <div className="space-y-4 w-full">
        <div className="p-4 bg-gray-50 rounded-lg space-y-3 ">
          <div className="flex items-center justify-center ">
            <ArrowRight className="w-4 h-4 text-indigo-600 mr-2" />
            <span style={{ fontFamily: "NanumSquare" }}>
              무제한 AI 질문 답변
            </span>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-indigo-600 mr-2" />
            <span style={{ fontFamily: "NanumSquare" }}>
              실시간 데이터 분석
            </span>
          </div>
          <div className="flex items-center justify-center">
            <ArrowRight className="w-4 h-4 text-indigo-600 mr-2" />
            <span style={{ fontFamily: "NanumSquare" }}>
              맞춤형 리포트 제공
            </span>
          </div>
        </div>

        <button
          onClick={() => setRegistrationOpen(true)} // 정기 결제 모달 열기
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
        >
          <CreditCard className="w-5 h-5" />
          <span style={{ fontFamily: "NanumSquareBold" }} className="ml-2">
            구독 시작하기
          </span>
        </button>
      </div>

      <CardRegistrationModal
        userData={userData}
        token={token}
        isOpen={isRegistrationOpen}
        onClose={() => setRegistrationOpen(false)} // 카드 등록 모달 닫기
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

export default SubscriptionSignup;
