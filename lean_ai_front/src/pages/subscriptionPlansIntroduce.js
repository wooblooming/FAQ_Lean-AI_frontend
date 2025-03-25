import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Check, ChevronLeft, ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import plans from "/public/text/plan.json";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { useLoginType } from "@/contexts/loginTypeContext";
import { fetchStoreUser } from "@/fetch/fetchStoreUser";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const SubscriptionPlansIntroduce = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { storeID } = useStore();
  const { loginType } = useLoginType();
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [userData, setUserData] = useState(null); // 유저 데이터 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
  const toggleRules = () => setIsRulesOpen(!isRulesOpen);

  const handleSubscriptionButton = async () => {
    if (!token) {
      router.push("/signupType");
      return;
    }

    try {
      const userData = await fetchStoreUser(
        { storeID },
        token,
        setUserData,
        setErrorMessage,
        setShowErrorMessageModal
      );

      //console.log(userData);

      if (userData?.subscription?.is_active) {
        if (loginType === "public") {
          router.push("/mainPageForPublic");
        } else if (loginType === "corporation") {
          router.push("/mainPageForCorp");
        } else {
          router.push("/mainPage");
        }
      } else {
        router.push("/subscriptionPlans");
      }
    } catch (error) {
      console.error("구독 상태 확인 실패:", error);
      setErrorMessage("구독 상태를 확인할 수 없습니다.");
      setShowErrorMessageModal(true);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 fon                                                                                                             t-sans bg-violet-50">
      <div className="max-w-5xl mx-auto py-12 px-8 shadow-lg rounded-xl bg-white">
        <div className="flex items-center mb-12">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <ChevronLeft
              className="h-8 w-8 text-indigo-600 cursor-pointer mr-2"
              onClick={() => router.push("/")}
            />
          </motion.div>
          <h1
            className="text-4xl font-bold text-center text-indigo-600"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            구독 플랜 소개
          </h1>
        </div>

        <motion.div
          name="contents"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col space-y-10"
        >
          {/* 플랜 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative p-6 rounded-3xl bg-indigo-50 transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* 가격 태그 */}
                <div className="absolute -top-3 -right-3 bg-indigo-500 text-white px-4 py-2 rounded-xl shadow-lg">
                  <span className="text-xl font-bold">
                    {plan.price.toLocaleString()}원
                  </span>
                  <span className="text-sm ml-1 opacity-80">/월</span>
                </div>

                {/* 플랜 내용 */}
                <div className="pt-8">
                  <h3
                    className="text-3xl font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    {plan.plan}
                  </h3>
                  <p
                    className="text-lg text-gray-600 mb-6"
                    style={{ fontFamily: "NanumSquareBold" }}
                  >
                    {plan.description}
                  </p>

                  {/* 기능 목록 */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-700"
                        style={{ fontFamily: "NanumSquare" }}
                      >
                        <div className=" flex items-center justify-center mr-3 flex-shrink-0">
                          <Check className="w-6 h-6 text-indigo-500" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 구독 신청 섹션 */}
          <div className="text-center">
            <div className="inline-flex flex-col items-center">
              <p
                className="text-xl text-gray-600 mb-3"
                style={{ fontFamily: "NanumSquareBold" }}
              >
                지금 바로 시작하세요!
              </p>
              <motion.button
                onClick={handleSubscriptionButton}
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
                className="bg-indigo-500 text-white px-10 py-5 rounded-2xl text-2xl 
                            hover:bg-indigo-600 transition-colors duration-200 shadow-lg"
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                구독 신청하러 가기
              </motion.button>
            </div>
          </div>

          {/* 규정 섹션 */}
          <div className="">
            <button
              onClick={toggleRules}
              className={`flex justify-between items-center w-full text-left text-indigo-600 
                          font-semibold px-6 py-4 transition-all
              ${isRulesOpen ? "rounded-t-md" : "rounded-md"}  
            `}
            >
              <span
                className="text-xl font-bold text-indigo-600"
                style={{ fontFamily: "NanumSquareExtraBold" }}
              >
                교환 및 환불 규정
              </span>
              {isRulesOpen ? (
                <ChevronUp className="w-6 h-6 text-indigo-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-indigo-600" />
              )}
            </button>

            {isRulesOpen && (
              <div
                className="bg-white px-10 py-2 "
                style={{ fontFamily: "NanumSquare" }}
              >
                {/* 환불 규정 */}
                <div className="mb-6">
                  <h4
                    className="text-lg font-bold text-gray-700 mb-3"
                    style={{ fontFamily: "NanumSquareBold" }}
                  >
                    환불 규정
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>결제 후 환불이 불가능합니다.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>
                        단, 서비스 장애 또는 결제 오류 발생 시 환불 가능합니다.
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>
                        자동결제 후 24시간 이내 취소 요청 시 전액 환불 가능
                        (이용 내역이 없는 경우)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 교환 규정 */}
                <div className="mb-6">
                  <h4
                    className="text-lg font-bold  text-gray-700 mb-3"
                    style={{ fontFamily: "NanumSquareBold" }}
                  >
                    교환 규정
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>디지털 서비스 특성상 교환은 불가능합니다.</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>
                        서비스 장애 발생 시 동일한 기간만큼 연장 보상됩니다.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 구독 취소 및 해지 */}
                <div className="mb-6">
                  <h4
                    className="text-lg font-bold  text-gray-700 mb-3"
                    style={{ fontFamily: "NanumSquareBold" }}
                  >
                    구독 취소 및 해지
                  </h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>
                        다음 결제일 전까지 구독을 취소하면 추가 비용이 발생하지
                        않습니다.
                      </span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-3" />
                      <span>
                        해지 후에도 결제된 구독 기간 동안 서비스 이용이
                        가능합니다.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 문의처 */}
                <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-gray-600 font-medium">
                    궁금하신 점이 있으신가요?
                  </p>
                  <div
                    className="mt-2 text-gray-600 font-bold"
                    style={{ fontFamily: "NanumSquareBold" }}
                  >
                    📧 ch@lean-ai.com &nbsp;|&nbsp; ☎️ 02-6951-1510
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default SubscriptionPlansIntroduce;
