"use client";

import React from "react";
import { X } from "lucide-react";

const SubscriptionRulesModal = ({ show, onClose }) => {

    if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-[90vh] w-full max-h-[90vh] overflow-y-auto  items-start text-start">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-600" style={{ fontFamily: "NanumSquareExtraBold" }}>
            구독형 서비스 교환 및 환불 규정
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
           <X className="bg-indigo-500 rounded-full text-white p-1"/>
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>
              환불 규정
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg " style={{ fontFamily: "NanumSquare" }}>
              <li>결제 후 환불이 불가능합니다.</li>
              <li>단, 서비스 장애 또는 결제 오류 발생 시 환불 가능합니다.</li>
              <li>
                자동결제 후 24시간 이내 취소 요청 시 전액 환불 가능. (이용 내역이
                없는 경우)
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>
              교환 규정
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg " style={{ fontFamily: "NanumSquare" }}>
              <li>디지털 서비스 특성상 교환은 불가능합니다.</li>
              <li>서비스 장애 발생 시 동일한 기간만큼 연장 보상됩니다.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2" style={{ fontFamily: "NanumSquareExtraBold" }}>
              구독 취소 및 해지
            </h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg " style={{ fontFamily: "NanumSquare" }}>
              <li>
                다음 결제일 전까지 구독을 취소하면 추가 비용이 발생하지
                않습니다.
              </li>
              <li>
                해지 후에도 결제된 구독 기간 동안 서비스 이용이 가능합니다.
              </li>
            </ul>
          </section>

          <section className="mt-8 text-lg text-gray-600 font-semibold" style={{ fontFamily: "NanumSquareBold" }}>
            <p>📩 문의: ch@lean-ai.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionRulesModal;
