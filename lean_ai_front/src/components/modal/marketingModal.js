import React, { useState, useEffect } from "react";
import ModalText from "../modal/modalText";

const MarketingModal = ({ show, onClose, onAgree }) => {
  const [agreements, setAgreements] = useState({
    marketing: false,
  });

  useEffect(() => {
    if (!show) {
      setAgreements({
        marketing: false,
      });
    }
  }, [show]);

  const marketingOfService = `
        ㈜린에이아이는 정보통신망의 이용촉진 및 정보보호 등에 관한 법률 제50조 제1항에 따라 광고성 정보를 전송하기 위해 수신자의 사전 동의를 받고 있으며, 수신 동의여부를 정기적으로 확인합니다.

        광고성 정보 수신에 동의하실 경우, (주)린에이아이가 제공하는 이벤트/혜택 등 다양한 정보 및 기타 유용한 광고성 정보가 휴대전화(카카오톡 알림 또는 문자), 이메일을 통해 발송됩니다.

        본 광고성 정보수신 동의 항목은 선택사항이므로 동의를 거부하는 경우에도 ㈜린에이아이 서비스의 이용에는 영향이 없습니다. 
        
        다만 거부 시 동의를 통해 제공 가능한 각종 혜택 이벤트 안내를 받아 보실 수 없습니다.
        
        단, 결제 정보, 정기 결제 알림 등 광고성 정보 이외 의무적으로 안내되어야 하는 정보성 내용은 수신동의 여부와 무관하게 제공됩니다.

        수신동의의 의사표시 이후에도 마이페이지 접속을 통해 이용자의 의사에 따라 수신동의 상태를 변경(동의/철회)할 수 있습니다.
    `;

  function handleCheckbox(type) {
    setAgreements((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  }

  function handleSubmit() {
    onAgree(agreements.marketing);
    onClose();
  }

  return (
    <div>
      <ModalText
        show={show}
        onClose={onClose}
        title="마케팅 활용 동의 및 광고 수신 동의"
      >
        <div className="flex flex-col space-y-4">
          {/* 마케팅 동의 섹션 */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={agreements.marketing}
                  onChange={() => handleCheckbox("marketing")}
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="font-medium">
                  마케팅 활용 동의 및 광고 수신 동의 (선택)
                </span>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-600">
                {marketingOfService}
              </pre>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="flex space-x-3 justify-center pt-4">
            <button
              onClick={handleSubmit}
              disabled={!agreements.marketing}
              className={`px-6 py-2 rounded-lg transition-colors font-medium min-w-[120px]
              ${
                agreements.marketing
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-indigo-100 text-gray-600 cursor-not-allowed"
              }`}
            >
              확인
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors font-medium min-w-[120px]"
            >
              취소
            </button>
          </div>
        </div>
      </ModalText>
    </div>
  );
};

export default MarketingModal;
