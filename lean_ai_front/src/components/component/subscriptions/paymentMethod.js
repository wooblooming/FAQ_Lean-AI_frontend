import React, { useState } from "react";
import { CreditCard, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CardChangeModal from "../../modal/cardChangeModal";
import ModalMSG from "../../modal/modalMSG";
import ModalErrorMSG from "../../modal/modalErrorMSG";

const PaymentMethod = ({ userData, cardInfo }) => {
  // 상태 관리
  const [isChangeOpen, setChangeOpen] = useState(false); // 카드 변경 모달 상태
  const [message, setMessage] = useState(""); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 표시 여부
  const [showErrorModal, setShowErrorModal] = useState(false); // 에러 모달 표시 여부

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

  // 카드사별 스타일 결정 함수
  const getCardStyle = (cardName) => {
    const styles = {
      신한: "bg-[#1B2F7E]",
      국민: "bg-[#423125]",
      삼성: "bg-[#1428A0]",
      현대: "bg-[#007158]",
      롯데: "bg-[#DA291C]",
      하나: "bg-[#00857E]",
      우리: "bg-[#0082C8]",
      농협: "bg-[#1A8C3C]",
    };

    const brandKey = Object.keys(styles).find((brand) =>
      cardName.includes(brand)
    );
    return styles[brandKey] || "bg-gradient-to-r from-indigo-500 to-indigo-600";
  };

  return (
    <div>
      {/* 결제 수단 카드 */}
      <Card className="bg-white">
        <CardContent className="p-3 md:p-6">
          {/* 결제 수단 제목 */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
              <Wallet className="h-6 w-6" />
              현재 결제 수단
            </h3>
          </div>

          {/* 카드 정보 표시 */}
          <div className="w-full mb-6">
            <div
              className={`p-6 rounded-xl ${getCardStyle(
                cardInfo.card_name
              )} text-white shadow-lg`}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-1">
                  <p className="text-xs opacity-80" style={{ fontFamily: "NanumSquare" }}>
                    등록된 카드
                  </p>
                  <p className="font-bold text-lg" style={{ fontFamily: "NanumSquareExtraBold" }}>
                    {cardInfo.card_name}
                  </p>
                </div>
                <CreditCard className="h-8 w-8" />
              </div>

              {/* 카드 번호 표시 */}
              <div>
                <p className="text-xs opacity-80 mb-1" style={{ fontFamily: "NanumSquare" }}>
                  카드 번호
                </p>
                <p className="font-mono text-lg tracking-wider">
                  {cardInfo.card_number}
                </p>
              </div>
            </div>
          </div>

          {/* 카드 변경 버튼 */}
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full py-6 text-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
              style={{ fontFamily: "NanumSquareBold" }}
              onClick={() => setChangeOpen(true)}
            >
              카드 변경하기
            </Button>

            <p className="text-xs text-gray-500 text-center" style={{ fontFamily: "NanumSquare" }}>
              결제 카드 변경은 다음 결제일부터 적용됩니다
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 카드 변경 모달 */}
      <CardChangeModal
        userData={userData}
        isOpen={isChangeOpen}
        onClose={() => setChangeOpen(false)}
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

export default PaymentMethod;
