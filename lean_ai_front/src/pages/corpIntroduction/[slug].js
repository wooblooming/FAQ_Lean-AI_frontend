"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headset,
  User,
  MailCheck,
  Home,
  MessageSquareWarning,
  Send,
  SearchCheck,
  MapPin,
  Building2,
  Phone,
} from "lucide-react";
import { fetchCorpDetailData } from "@/fetch/fetchCorpDetailData";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import CorpBanner from "@/components/ui/publicBanner";
import { CorpInfoItem } from "@/components/component/ui/infoItem";
import { formatPhoneNumber } from "@/utils/telUtils";
import Chatbot from "../chatBotMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const CorpIntroduction = () => {
  const router = useRouter();
  const { slug } = router.query; // URL에서 기관 식별자(slug) 가져오기
  const [isOwner, setIsOwner] = useState(true); // 기관 소유자인지 여부 (현재 기본값 true)
  const [corpData, setCorpData] = useState([]); // 기관 데이터 저장
  const [agentId, setAgentId] = useState(null); // 챗봇 ID 저장
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태
  const [activeTab, setActiveTab] = useState("home"); // 현재 활성화된 탭 ('home' 또는 'complaint')
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 모달 표시 여부

  // 스와이프 이벤트 (홈 ↔ 민원 탭 이동)
  const handlers = useSwipeable({
    onSwipedLeft: () => activeTab === "home" && setActiveTab("complaint"),
    onSwipedRight: () => activeTab === "complaint" && setActiveTab("home"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // 공공기관 데이터 가져오기
  useEffect(() => {
    if (slug) {
      setIsOwner(false);
      fetchCorpDetailData(
        slug,
        null,
        setCorpData,
        setErrorMessage,
        setShowErrorMessageModal,
        isOwner
      );
    }
  }, [slug, isOwner]);

  // corpData 변경되었을 때 에이전트 ID 설정 및 로딩 상태 업데이트
  useEffect(() => {
    if (corpData) {
      //console.log("corpData : ", corpData);
      setAgentId(corpData.agent_id); // 챗봇 ID 설정
      setIsLoading(false); // 로딩 종료
    }
  }, [corpData]);

  // 로딩 중인 경우 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2 justify-center items-center min-h-screen bg-violet-50">
        <LoadingSpinner />
        <p className="text-lg" style={{ fontFamily: "NanumSquareBold" }}>
          데이터를 가져오는 중입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div
        {...handlers}
        className="bg-white rounded-3xl shadow-2xl relative overflow-hidden w-[95%] h-[90%] md:min-w-[420px] md:max-w-[30%]"
      >
        {/* 상단 배너 */}
        <CorpBanner
          banner={corpData.logo}
          onBack={() => router.push("/mainPageForCorp")}
          isOwner={false}
        />

        {/* 탭 네비게이션 */}
        <div className="px-4 py-2 bg-white/80 backdrop-blur-md shadow-md">
          <div className="flex justify-around -mt-6 mb-2 relative z-20">
            <div className="flex space-x-3 bg-white rounded-full p-1.5 shadow-lg">
              {/* 홈 탭 버튼 */}
              <button
                className={`flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full transition-all duration-300 ${
                  activeTab === "home"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700  hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("home")}
              >
                <Home className="h-5 w-5" />
                <span className="font-medium text-lg">홈</span>
              </button>

              {/* 민원 탭 버튼 */}
              <button
                className={`flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full transition-all duration-300 ${
                  activeTab === "complaint"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700  hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("complaint")}
              >
                <MessageSquareWarning className="h-5 w-5" />
                <span className="font-medium text-lg">문의</span>
              </button>
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div
          className="py-5 px-5 font-sans bg-gray-50"
          style={{ height: "calc(97vh - 300px)", overflowY: "auto" }}
        >
          <AnimatePresence mode="wait">
            {/* 홈 탭 내용 */}
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.15 },
                  },
                  exit: { opacity: 0, y: -20 },
                }}
                className="flex flex-col space-y-6"
              >
                {/* 기업 정보 */}
                <div
                  className="flex items-center"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center min-w-0">
                    기업 정보
                  </h2>
                </div>

                {/* 기관 정보 목록 */}
                <div
                  className="flex flex-col space-y-5 text-lg px-3 bg-white rounded-xl p-5 shadow-md"
                  style={{ fontFamily: "NanumSquareBold" }}
                >
                  {corpData.corp_name && (
                    <CorpInfoItem
                      icon={Building2}
                      text={corpData.corp_name}
                      label="기업명"
                    />
                  )}
                  {corpData.corp_address && (
                    <CorpInfoItem
                      icon={MapPin}
                      text={corpData.corp_address}
                      label="주소"
                    />
                  )}
                  {corpData.corp_tel && (
                    <CorpInfoItem
                      icon={Phone}
                      text={formatPhoneNumber(corpData.corp_tel)}
                      label="연락처"
                    />
                  )}
                </div>
              </motion.div>
            )}

            {/* 민원 탭 내용 */}
            {activeTab === "complaint" && (
              <motion.div
                key="complaint"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full space-y-6"
              >
                <div
                  className="flex items-center"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center min-w-0">
                    문의하기
                  </h2>
                </div>

                {/* 민원 접수 과정 */}
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        icon: Headset,
                        step: "01",
                        title: "문의 접수",
                        text: "아래 버튼으로 \n 문의 사항 등록",
                        color: "bg-indigo-300",
                      },
                      {
                        icon: User,
                        step: "02",
                        title: "검토 진행",
                        text: "담당자 확인\n답변 준비",
                        color: "bg-indigo-400",
                      },
                      {
                        icon: MailCheck,
                        step: "03",
                        title: "답변 완료",
                        text: "답변 확인\n추가 문의 가능",
                        color: "bg-indigo-500",
                      },
                    ].map(({ icon: Icon, step, title, text, color }, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col"
                        style={{ fontFamily: "NanumSquareExtraBold" }}
                      >
                        {/* 헤더 */}
                        <div className={`${color} h-2 w-full`}></div>

                        {/* 숫자 및 아이콘 */}
                        <div className="px-3 py-3 flex justify-between items-center">
                          <div
                            className={`${color} bg-opacity-10 rounded-full w-7 h-7 flex items-center justify-center`}
                          >
                            <span
                              className={`text-sm font-bold ${color.replace(
                                "bg-",
                                "text-"
                              )}`}
                            >
                              {step}
                            </span>
                          </div>
                          <Icon
                            className={`w-6 h-6 ${color.replace(
                              "bg-",
                              "text-"
                            )}`}
                          />
                        </div>

                        {/* 내용 */}
                        <div className="px-3 pb-3">
                          <h4 className="font-bold text-gray-800">{title}</h4>
                          <p
                            className="text-gray-500 text-sm mt-1 leading-relaxed whitespace-pre-line"
                            style={{ fontFamily: "NanumSquareBold" }}
                          >
                            {text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 민원 접수/조회 버튼 */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-2"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  <div className="relative space-y-3">
                    {/* 민원 접수 버튼 */}
                    <button
                      className="w-full px-5 py-4 rounded-xl bg-indigo-500 text-white font-medium flex items-center justify-between shadow-sm hover:bg-indigo-600 transition-colors"
                      onClick={() =>
                        router.push({
                          pathname: "/complaintRegister",
                          query: { slug },
                        })
                      }
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                          <Send className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xl">문의하기</span>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {/* 민원 조회 버튼 */}
                    <button
                      className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors"
                      onClick={() => router.push("/complaintStatusLookup")}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-full">
                          <SearchCheck className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="font-medium text-xl">
                          문의 조회하기
                        </span>
                      </div>

                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 챗봇 표시 */}
        {agentId && <Chatbot agentId={agentId} />}
      </div>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        <p>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
};

export default CorpIntroduction;
