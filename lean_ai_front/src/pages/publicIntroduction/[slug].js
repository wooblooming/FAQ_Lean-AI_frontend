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
  Clock,
  MapPin,Building2,
  Phone
} from "lucide-react";
import { fetchPublicDetailData } from "@/fetch/fetchPublicDetailData";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PublicBanner from "@/components/ui/publicBanner";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import Chatbot from "../chatBotMSG";
import { formatPhoneNumber } from "@/utils/telUtils";

const PublicIntroduction = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [isOwner, setIsOwner] = useState(true);
  const [publicData, setPublicData] = useState([]);
  const [agentId, setAgentId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);

  // 스와이프 이벤트
  const handlers = useSwipeable({
    onSwipedLeft: () => activeTab === "home" && setActiveTab("complaint"),
    onSwipedRight: () => activeTab === "complaint" && setActiveTab("home"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  useEffect(() => {
    if (slug) {
      fetchPublicDetailData(
        slug,
        null,
        setPublicData,
        setErrorMessage,
        setShowErrorMessageModal,
        isOwner
      );
    }
  }, [slug, isOwner]);

  useEffect(() => {
    if (publicData) {
      //console.log("publicData : ", publicData);
      setAgentId(publicData.agent_id);
      setIsLoading(false);
    }
  }, [publicData]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div
        {...handlers}
        className="bg-white rounded-3xl shadow-2xl relative overflow-hidden w-[95%] h-[90%] md:min-w-[400px] md:max-w-[30%]"
      >
        {/* 상단 배너 - 원래 코드 유지 */}
        <PublicBanner
          banner={publicData.banner}
          onBack={() => router.push("/mainPageForPublic")}
          isOwner={false}
        />

        {/* 탭 네비게이션 */}
        <div className="px-4 py-2 bg-white/80 backdrop-blur-md shadow-md">
          <div className="flex justify-around -mt-6 mb-2 relative z-20">
            <div className="flex space-x-3 bg-white rounded-full p-1.5 shadow-lg">
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
              <button
                className={`flex items-center justify-center space-x-1.5 py-2 px-4 rounded-full transition-all duration-300 ${
                  activeTab === "complaint"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-700  hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("complaint")}
              >
                <MessageSquareWarning className="h-5 w-5" />
                <span className="font-medium text-lg">민원</span>
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
                <div
                  className="flex items-center"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  <div className="w-1.5 h-8 bg-indigo-600 rounded-r mr-3"></div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center min-w-0">
                    기관 정보
                  </h2>
                </div>
                
                <div 
                  className="flex flex-col space-y-5 text-lg px-3 bg-white rounded-xl p-5 shadow-md"
                  style={{ fontFamily: "NanumSquareBold" }}
                >
                   {publicData.public_name && (
                    <InfoItem
                      icon={Building2}
                      text={publicData.public_name}
                      label="기관명"
                    />
                  )}
                  {publicData.public_address && (
                    <InfoItem
                      icon={MapPin}
                      text={publicData.public_address}
                      label="주소"
                    />
                  )}
                  {publicData.opening_hours && (
                    <InfoItem 
                      icon={Clock} 
                      text={publicData.opening_hours}
                      label="운영시간" 
                    />
                  )}
                  {publicData.public_tel && (
                    <InfoItem
                      icon={Phone}
                      text={formatPhoneNumber(publicData.public_tel)}
                      label="연락처"
                    />
                  )}
                </div>
              </motion.div>
            )}

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
                    민원 접수하기
                  </h2>
                </div>

                {/* 민원 접수 과정 - 깔끔한 카드 디자인 */}
                <div className="mb-4">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        icon: Headset,
                        step: "01",
                        title: "민원 접수",
                        text: "접수 버튼으로 \n 민원 신청",
                        color: "bg-indigo-300",
                      },
                      {
                        icon: User,
                        step: "02",
                        title: "담당부서",
                        text: "담당부서 \n 검토 및 처리",
                        color: "bg-indigo-400",
                      },
                      {
                        icon: MailCheck,
                        step: "03",
                        title: "결과 통보",
                        text: "처리결과 \n 문자 발송",
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
                          <div className={`${color} bg-opacity-10 rounded-full w-7 h-7 flex items-center justify-center`}>
                            <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>{step}</span>
                          </div>
                          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                        </div>
                        
                        {/* 내용 */}
                        <div className="px-3 pb-3">
                          <h4 className="font-bold text-gray-800">{title}</h4>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed whitespace-pre-line" style={{ fontFamily: "NanumSquareBold" }} >{text}</p>
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
                        <span className="font-bold text-xl">민원 접수하기</span>
                      </div>
                      
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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
                        <span className="font-medium text-xl">민원 조회하기</span>
                      </div>
                      
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {agentId && <Chatbot agentId={agentId} />}
      </div>
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        <p>{errorMessage}</p>
      </ModalErrorMSG>
    </div>
  );
};

const InfoItem = ({ icon: Icon, text, label }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    }}
    className="flex items-center space-x-4"
  >
    <div className="flex-shrink-0 bg-indigo-100 p-3 rounded-full shadow-sm">
      <Icon className="text-indigo-600 w-5 h-5" />
    </div>
    <div className="flex-1">
      {/* label이 '기관명'일 경우 큰 텍스트 적용 */}
      {label === "기관명" ? (
        <p className="text-2xl font-bold text-gray-800 flex items-center">{text}</p>
      ) : (
        <>
          <p className="text-sm text-indigo-500 font-medium mb-1">{label}</p>
          <p className="text-base text-gray-800">{text}</p>
        </>
      )}
    </div>
  </motion.div>
);


export default PublicIntroduction;