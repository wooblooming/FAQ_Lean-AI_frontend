import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CreditCard, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { fetchSubscription } from "../../fetch/fetchSubscription";

const SubscriptionStatus = ({ token, userData }) => {
  const billingKeyId = userData?.billing_key?.id;
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [cardInfo, setCardInfo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (token && billingKeyId) {
      fetchSubscription(
        token,
        billingKeyId,
        setSubscriptionData,
        setCardInfo,
        setErrorMessage
      ).finally(() => setLoading(false));
    }
  }, [token, billingKeyId]);

  // ✅ 경과 일 수 계산 함수
  const calculateSubscriptionDays = (startDate) => {
    console.log("startDate:", startDate);
    
    if (!startDate) return "정보 없음";

    // 시간대 오프셋 제거 & Date 객체 변환
    const start = new Date(startDate.split("+")[0]); // "+09:00" 같은 시간대 정보 제거
    const today = new Date();

    // 시간 차이 계산
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 밀리초 -> 일 변환
    
    return `${diffDays}일`;
};


  // ✅ 로딩 중 상태 처리
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 space-y-4 w-full text-center">
        <p className="text-gray-500">구독 정보를 불러오는 중...</p>
      </div>
    );
  }

  // ✅ 에러 메시지 처리
  if (errorMessage) {
    return (
      <div className="w-full text-center">
        <p className="text-red-500">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 w-full">
      {/* ✅ 구독 상태 섹션 */}
      <div className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50">
        {subscriptionData?.is_active ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        )}
        <span className="font-medium text-gray-700" style={{ fontFamily: "NanumSquareBold" }}>
          {subscriptionData?.is_active ? `${subscriptionData.plan} 구독 중` : "구독 중지됨"}
        </span>
      </div>

      <div className="space-y-4">
        {/* ✅ 구독 경과 일수 정보 */}
        <div className="flex items-center p-4 border rounded-lg shadow-sm">
          <Clock className="w-7 h-7 text-indigo-400 mr-3" />
          <div className="w-full flex justify-center">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: "NanumSquare" }}>구독한 지</p>
              <p className="font-medium text-gray-800" style={{ fontFamily: "NanumSquareBold" }}>
                {calculateSubscriptionDays(subscriptionData?.billing_key?.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ 다음 결제일 정보 */}
        <div className="flex items-center p-4 border rounded-lg shadow-sm">
          <Calendar className="w-7 h-7 text-indigo-400 mr-3" />
          <div className="w-full flex justify-center">
            <div className="flex flex-col items-center text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: "NanumSquare" }}>다음 결제일</p>
              <p className="font-medium text-gray-800" style={{ fontFamily: "NanumSquareBold" }}>
                {subscriptionData?.next_billing_date || "결제 예정 없음"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 구독 관리 버튼 */}
      <div className="w-full">
        <button
          className="w-full px-4 py-2 text-white font-semibold font-sans bg-indigo-500 rounded-lg whitespace-nowrap transition"
          onClick={() => router.push("/subscriptionsDashboard")}
        >
          구독 관리
        </button>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
