import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSwipeable } from "react-swipeable";
import { motion } from "framer-motion";
import { Headset, User, MailCheck, Home, MailWarning } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faClock,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/authContext";
import { fetchPublicDetailData } from "@/fetch/fetchPublicDetailData";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import PublicBanner from "@/components/ui/publicBanner";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import Chatbot from "../chatBotMSG";
import { formatPhoneNumber } from "@/utils/telUtils";

const StoreIntroductionPublic = () => {
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
  }, [slug]);

  useEffect(() => {
    if (publicData) {
      //console.log("publicData : ",publicData);
      setAgentId(publicData.agent_id); // agentId 설정
      setIsLoading(false); // 로딩 상태 해제
    }
  }, [publicData]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div
        {...handlers}
        className="bg-white rounded-2xl shadow-2xl relative overflow-hidden w-[95%] h-[90%] md:min-w-[400px] md:max-w-[30%]"
      >
        {/* 상단 배너 */}
        <PublicBanner
          banner={publicData.banner}
          onBack={() => router.push("/mainPageForPublic")}
          isOwner={false}
        />

        {/* 탭 네비게이션 */}
        <div className="px-2 bg-white shadow-sm">
          <div className="flex justify-around -mt-6 mb-2 relative z-20">
            <div className="flex space-x-1 bg-white rounded-full p-1 shadow-lg">
              <button
                className={`flex items-center justify-center space-x-1 py-2 px-4 rounded-full transition-all duration-300 ${
                  activeTab === "home"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("home")}
              >
                <Home className="h-4 w-4" />
                <span className="font-medium">홈</span>
              </button>
              <button
                className={`flex items-center justify-center space-x-1 py-2 px-4 rounded-full transition-all duration-300 ${
                  activeTab === "complaint"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("complaint")}
              >
                <MailWarning className="h-4 w-4" />
                <span className="font-medium">민원</span>
              </button>
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div
          className="py-4 px-4 font-sans"
          style={{ height: "calc(97vh - 300px)", overflowY: "auto" }}
        >
          {activeTab === "home" && (
            <div className="flex flex-col space-y-8 p-2">
              <div className="flex items-center">
                <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r mr-3"></div>
                <motion.h2
                  className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  기관 정보
                </motion.h2>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col space-y-4 text-lg px-3"
              >
                {publicData.public_address && (
                  <InfoItem
                    icon={faLocationDot}
                    text={publicData.public_address}
                  />
                )}
                {publicData.opening_hours && (
                  <InfoItem icon={faClock} text={publicData.opening_hours} />
                )}
                {publicData.public_tel && (
                  <InfoItem
                    icon={faPhone}
                    text={formatPhoneNumber(publicData.public_tel)}
                  />
                )}
              </motion.div>
            </div>
          )}

          {activeTab === "complaint" && (
            <>
              <div className="flex items-center p-2">
                <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-r mr-3"></div>
                <motion.h2
                  className="text-2xl font-bold text-gray-800 flex items-center min-w-0"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  민원 접수하기
                </motion.h2>
              </div>
              <div className="flex flex-col space-y-4 px-4 py-6">
                {[
                  {
                    icon: Headset,
                    step: "STEP 1",
                    text: "아래 민원 접수 버튼을 통해 민원을 접수합니다.",
                  },
                  {
                    icon: User,
                    step: "STEP 2",
                    text: "접수된 민원은 담당부서로 전달됩니다.",
                  },
                  {
                    icon: MailCheck,
                    step: "STEP 3",
                    text: "민원처리 결과를 문자로 통보받습니다.",
                  },
                ].map(({ icon: Icon, step, text }, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-4"
                  >
                    <Icon className="w-12 h-12 rounded-full bg-indigo-400 text-white p-2.5" />
                    <div>
                      <p className="font-semibold text-indigo-500">{step}</p>
                      <p>{text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* 버튼 영역 */}
              <div className="absolute bottom-0 left-0 right-0 p-7 border-t border-indigo-100">
                <div className="flex justify-center space-x-2">
                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold"
                    onClick={() =>
                      router.push({
                        pathname: "/complaintRegister",
                        query: { slug },
                      })
                    }
                  >
                    민원 접수
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-indigo-500 text-white font-semibold"
                    onClick={() => router.push("/complaintStatusLookup")}
                  >
                    민원 조회
                  </button>
                </div>
              </div>
            </>
          )}
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

const InfoItem = ({ icon, text }) => {
  return (
    <div className="flex space-x-3 items-center">
      <FontAwesomeIcon icon={icon} className="text-indigo-500 text-xl" />
      <p className="leading-normal whitespace-pre-line">{text}</p>
    </div>
  );
};

export default StoreIntroductionPublic;
