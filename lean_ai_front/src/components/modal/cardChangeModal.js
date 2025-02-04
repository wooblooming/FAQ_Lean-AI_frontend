import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";
import config from "../../../config";

const CardChangeModal = ({ userData, isOpen, onClose }) => {
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

  // 성공 메시지 확인 시 동작
  const handleSuccessConfirm = () => {
    closeMessageModal(); // 성공 메시지 모달 닫기
    onClose(); // 카드 변경 모달 닫기
    window.location.reload(); // 페이지 리로드
  };


// "변경하기" 버튼 클릭 핸들러
const handleChangeClick = async () => {
  try {
    // ✅ PortOne 결제 모듈 초기화 (가맹점 코드 설정)
    if (!window.IMP) {
      throw new Error("PortOne 결제 모듈이 로드되지 않았습니다. 페이지를 새로고침해주세요.");
    }
    window.IMP.init(config.impKey); // ✅ 가맹점 코드 초기화 (반드시 필요!)

    // merchant_uid 생성 (고유 주문 번호)
    const merchant_uid = `${userData.billing_key.plan}_${new Date().getTime()}`;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    // PortOne 결제 요청 (Promise로 래핑)
    await new Promise((resolve, reject) => {
      window.IMP.request_pay(
        {
          pg: config.pgCode, // PG사 코드
          pay_method: "card", // 결제 방식
          merchant_uid: merchant_uid, // 주문 번호
          customer_uid: userData.billing_key.customer_uid, // 기존 customer_uid 사용
          name: "정기결제 카드 변경", // 결제 이름
          amount: userData.billing_key.amount, // 결제 금액
          buyer_email: userData.email, // 구매자 이메일
          buyer_name: userData.name || "테스트 유저", // 구매자 이름
          buyer_tel: userData.phone_number || "010-0000-0000", // 구매자 전화번호
          m_redirect_url: isMobile
            ? `${config.frontendDomain}/paymentChange`
            : undefined,
        },
        function (rsp) {
          if (rsp.success) {
            resolve(rsp); // 결제가 성공하면 Promise를 resolve
          } else {
            let errorMsg = rsp.error_msg;
            if (errorMsg.includes("PAY_PROCESS_CANCELED")) {
              errorMsg = "사용자가 결제를 취소하였습니다.";
              setShowErrorModal(true);
              setErrorMessage(errorMsg);
              onClose();
              return;
            }
            reject(new Error(errorMsg || "결제 요청 실패"));
          }
        }
      );
    });

    setShowMessageModal(true);
    setMessage("카드 정보가 성공적으로 변경되었습니다!");
  } catch (error) {
    console.error("Card change error:", error);

    let errorMsg = error.message;
    if (errorMsg.includes("PAY_PROCESS_CANCELED")) {
      errorMsg = "사용자가 결제를 취소하였습니다.";
    }

    setShowErrorModal(true);
    setErrorMessage("카드 변경 실패: " + errorMsg);
  }
};


  // 모달이 닫혀 있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-[480px] relative animate-in fade-in duration-300">
        {/* 닫기 버튼 */}
        <button
          onClick={() => {
            onClose();
          }}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        {/* 제목 및 설명 */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">카드 변경</h2>
          <p className="text-gray-500 mt-2">새로운 카드 정보를 입력해주세요</p>
        </div>

        {/* 동작 버튼 */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleChangeClick}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
          >
            변경하기
          </button>
        </div>
      </div>

      {/* 성공 메시지 모달 */}
      <ModalMSG
        show={showMessageModal}
        onClose={handleSuccessConfirm}
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

export default CardChangeModal;
