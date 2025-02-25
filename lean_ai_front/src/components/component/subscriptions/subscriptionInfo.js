import React from "react";
import { Dot, Calendar, Clock, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate, getLastAvailableDate } from "@/utils/dateUtils";
import plans from "/public/text/plan.json";

const SubscriptionInfo = ({ subscriptionData, setCancelOpen, setRestoreOpen }) => {
  if (!subscriptionData?.billing_key) {
    return (
      <div className="text-center p-6 text-gray-600">구독 정보가 없습니다.</div>
    );
  }

  const planType = subscriptionData.plan || " ";
  const currentPlan = plans.find((plan) => plan.plan === planType);
  const planFeatures = currentPlan?.features || [];


  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-3 md:p-6 space-y-6">
        <h3 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
          <BadgeCheck className="h-6 w-6" />
          현재 플랜 정보
        </h3>

        {/* 구독 정보 헤더 */}
        <div className="flex flex-col space-y-4 p-6 bg-indigo-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h2
                  className="text-2xl text-indigo-600"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  {planType}
                </h2>
              </div>
              <p
                className="text-gray-900"
                style={{ fontFamily: "NanumSquare" }}
              >
                월{" "}
                {parseFloat(subscriptionData.billing_key.amount).toLocaleString(
                  "ko-KR"
                )}
                원
              </p>
            </div>
            <span
              className="px-4 py-2 bg-white text-indigo-600 rounded-full font-bold"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              구독 중
            </span>
          </div>

          <div className="border-b border-indigo-200" />

          {/* 날짜 정보 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 ">
            <InfoCard
              icon={Clock}
              title="구독 시작일"
              value={formatDate(subscriptionData.billing_key.created_at)}
            />
            {subscriptionData?.billing_key?.deactivation_date ? (
              <InfoCard
                icon={Calendar}
                title="구독 해지일"
                value={getLastAvailableDate(subscriptionData.billing_key.deactivation_date)}
              />
            ) : (
              <InfoCard
                icon={Calendar}
                title="다음 결제일"
                value={formatDate(subscriptionData.next_billing_date)}
              />
            )}
          </div>

          <div className="border-b border-indigo-200" />

          {/* 구독 혜택 섹션 */}
          <div className="space-y-4 pb-6">
            <h3
              className="text-lg text-gray-900 mb-4"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              {planType}의 혜택
            </h3>
            <div className="space-y-3">
              {planFeatures.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </div>
          </div>
        </div>

        {/* 구독 취소 버튼 */}
        {subscriptionData?.billing_key?.deactivation_date ? (
          <div className="flex w-full">
            <Button
              variant="outline"
              className="w-full py-6 text-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors"
              style={{ fontFamily: "NanumSquareBold" }}
              onClick={() => setRestoreOpen(true)}
            >
              구독 해지 취소하기
            </Button>
          </div>
        ) : (
          <div className="flex w-full">
            <Button
              variant="outline"
              className="w-full py-6 text-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
              style={{ fontFamily: "NanumSquareBold" }}
              onClick={() => setCancelOpen(true)}
            >
              구독 해지하기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const InfoCard = ({ icon: Icon, title, value }) => (
  <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
    <Icon className="h-5 w-5 text-indigo-500" />
    <div>
      <p
        className="text-sm text-gray-500"
        style={{ fontFamily: "NanumSquare" }}
      >
        {title}
      </p>
      <p
        className="text-lg font-semibold text-gray-900"
        style={{ fontFamily: "NanumSquareExtraBold" }}
      >
        {value}
      </p>
    </div>
  </div>
);

const FeatureItem = ({ feature }) => (
  <div
    className="flex items-center space-x-2 text-gray-600"
    style={{ fontFamily: "NanumSquare" }}
  >
    <Dot className="h-6 w-6 text-indigo-500" />
    <span>{feature}</span>
  </div>
);

export default SubscriptionInfo;
