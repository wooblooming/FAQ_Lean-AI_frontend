import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Header from "@/components/component/ui/header";
import { Eye, Send, SquareCheckBig, ClipboardList } from "lucide-react";
import LoadingSpinner from "@/components/ui/loadingSpinner";
import { useAuth } from "@/contexts/authContext";
import { useStore } from "@/contexts/storeContext";
import { useLoginType } from "@/contexts/loginTypeContext";
import { notifications } from "/public/text/notification.js";
import SubscriptionActive from "@/components/component/subscriptions/subscriptionActive";
import SubscriptionSignup from "@/components/component/subscriptions/subscriptionSignup";
import RequestService from "./requestService";
import RegisterChatbotDataModal from "@/components/modal/registerChatbotDataModal";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import Footer from "@/components/component/ui/footer";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

// 버튼 컴포넌트 정의: 아이콘과 텍스트를 포함한 버튼 스타일 지정
const Button = ({ children, icon: Icon, className, disabled, ...props }) => (
  <button
    className={`flex items-center justify-center space-x-2 mt-4 px-4 py-3 w-full rounded-lg font-semibold font-sans ${
      disabled
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-indigo-500 text-white hover:bg-indigo-600"
    } ${className}`}
    disabled={disabled}
    {...props}
  >
    {Icon && <Icon className="h-5 w-5" />}
    <span>{children}</span>
  </button>
);

// 카드 컴포넌트 정의: 배경, 그림자, 여백 등을 스타일링하여 카드 UI로 사용
const Card = ({ children, className, disabled, ...props }) => (
  <div
    className={`bg-white shadow rounded-lg p-6 space-y-3 font-sans w-full ${
      disabled ? "opacity-50" : ""
    } ${className}`}
    {...props}
  >
    {children}
  </div>
);

// 최신 순으로 공지사항을 정렬하여 상위 3개만 반환하는 함수
const getLastNotifications = () => {
  return [...notifications]
    .sort(
      (a, b) =>
        new Date(b.date.replace(/-/g, "/")) -
        new Date(a.date.replace(/-/g, "/"))
    ) // 최신순 정렬
    .slice(0, 3); // 상위 3개만 선택
};

const MainPageWithMenuPublic = () => {
  const [isMobile, setIsMobile] = useState(false); // 모바일 화면 여부 상태
  const [isRequestDataModalOpen, setIsRequestDataModalOpen] = useState(false); // 데이터 요청 모달 상태
  const [isEditDataModalOpen, setIsEditDataModalOpen] = useState(false); // 데이터 편집 모달 상태
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 여부 상태
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태
  const [publicData, setPublicData] = useState("");
  const [publicName, setPublicName] = useState(""); // 상점 이름 상태
  const [slug, setPublicSlug] = useState(""); // 상점 슬러그 상태
  const router = useRouter();
  const { token, removeToken } = useAuth();
  const { storeID, removeStoreID } = useStore();
  const { resetLoginType } = useLoginType();
  const lastNotifications = getLastNotifications(); // 최신 공지사항 가져오기

  // 통계 관련 상태
  const [statisticsData, setStatisticsData] = useState([]); // 통계 데이터 상태
  const [isLoadingStatistics, setIsLoadingStatistics] = useState(true); // 로딩 상태

  // 화면 크기에 따라 모바일 여부를 설정하는 함수
  const handleResize = () => {
    const isMobileDevice = window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  // 화면 크기 조정 시 이벤트 리스너 설정 및 초기 실행
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 컴포넌트 마운트 시 공공기관, 통계 정보 불러오기
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // token이 존재할 때만 API 호출
    if (storeID) {
      Promise.all([
        fetchPublicInfo(), // 세미콜론 제거
        fetchStatistics(),
      ]).finally(() => {
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [token, storeID]);

  useEffect(() => {
    if (publicData) {
      //console.log("publicData : ", publicData);
      setPublicName(publicData.public_name); // 상점 이름 설정
      setPublicSlug(publicData.slug); // 상점 슬러그 설정
    }
  }, [publicData]);

  // 공공기관 정보 API 호출
  const fetchPublicInfo = async () => {
    try {
      const response = await axios.post(
        `${API_DOMAIN}/public/publics/user_info/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 토큰
          },
        }
      );

      if (response.status === 401) {
        // 인증 실패 시 에러 처리
        setErrorMessage(
          "세션이 만료되었거나 인증에 실패했습니다. 다시 로그인해 주세요."
        );
        setShowErrorMessageModal(true);
        setIsLoggedIn(false);
        removeToken();
        removeStoreID();
        resetLoginType();
        router.push("/login");
        return;
      }

      setPublicData(response.data.public);
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("로딩 중에 에러가 발생 했습니다.");
      setShowErrorMessageModal(true);
    }
  };

  // 통계 데이터 API 호출
  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/public/statistics/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      //console.log("data.data : ", data.data);
      if (response.ok && data.status === "success") {
        setStatisticsData(data.data); // 통계 데이터를 상태에 저장
      } else {
        setStatisticsData(null); // 데이터가 없으면 null로 설정
      }
    } catch (error) {
      console.error("Error:", error);
      setStatisticsData(null); // 오류 발생 시 데이터 없음으로 설정
    } finally {
      setIsLoadingStatistics(false); // 로딩 상태를 완료로 설정
    }
  };

  // 챗봇 페이지로 이동하는 함수
  const goToChatbot = () => {
    if (slug) {
      const encodedSlug = encodeURIComponent(slug);
      router.push(`/publicIntroductionOwner/${encodedSlug}`);
    }
  };

  // 민원 확인인 페이지로 이동하는 함수
  const goToComplaintsDashboard = () => {
    router.push("/complaintsDashboard");
  };

  // 구독 여부 확인 후 실행할 함수
  const handleActionWithSubscriptionCheck = (callback) => {
    /*
    if (!publicData?.billing_key?.is_active) {
      setErrorMessage("구독을 먼저 신청해주세요.");
      setShowErrorMessageModal(true);
      return;
    }
      */
    callback();
  };

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
    <div className="flex flex-col min-h-screen bg-violet-50">
      <div className="flex-grow font-sans ">
        {/* 헤더 컴포넌트 */}
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          errorMessage={errorMessage}
          showErrorMessageModal={showErrorMessageModal}
          handleErrorMessageModalClose={() => setShowErrorMessageModal(false)}
        />

        {/* 메인 콘텐츠 */}
        <main className="container md:mx-auto px-2 md:px-4 py-10 mt-12 flex-grow flex justify-center items-center">
          <div className="flex flex-col justify-center items-center text-center space-y-10">
            <h2
              className="text-2xl md:text-3xl mt-5 md:mt-10"
              style={{ fontFamily: "NanumSquareBold" }}
            >
              안녕하세요!{" "}
              <span
                className="hover:text-indigo-600 hover:font-bold hover:underline cursor-pointer"
                onClick={() => router.push("/myPagePublic")}
              >
                {publicName}님
              </span>
            </h2>

            {/* 버튼 카드 영역 */}
            <main className="container md:mx-auto px-2 md:px-0 py-0 md:py-5 justify-center items-center text-center font-sans">
              <div className="grid grid-cols-1 gap-6 w-full md:grid-cols-2 lg:grid-cols-4 md:gap-4">
                {/* 챗봇 미리보기 카드 */}
                <Card
                //disabled={!publicData?.billing_key?.is_active}
                >
                  <h3
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    챗봇 미리보기
                  </h3>
                  <p className="h-16">
                    고객에게 보여지는 <br /> 챗봇 화면을 미리 확인해보세요
                  </p>
                  <div className="flex justify-center items-center">
                    <Button
                      icon={Eye}
                      //disabled={!publicData?.billing_key?.is_active}
                      onClick={() =>
                        handleActionWithSubscriptionCheck(goToChatbot)
                      }
                    >
                      미리보기
                    </Button>
                  </div>
                </Card>

                {/* 민원 확인 카드 */}
                <Card
                //disabled={!publicData?.billing_key?.is_active}
                >
                  <h3
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    민원 확인
                  </h3>
                  <p className="h-16">
                    고객들의 민원 내용을 <br /> 편하게 확인하세요.
                  </p>
                  <div className="flex justify-center items-center">
                    <Button
                      icon={SquareCheckBig}
                      //disabled={!publicData?.billing_key?.is_active}
                      onClick={() =>
                        handleActionWithSubscriptionCheck(
                          goToComplaintsDashboard
                        )
                      }
                    >
                      확인하기
                    </Button>
                  </div>
                </Card>

                <Card
                //disabled={!userData?.subscription?.is_active}
                >
                  <h3
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    데이터 등록
                  </h3>
                  <p className="h-16">
                    챗봇에 이용 될 <br /> 데이터를 등록하세요.
                  </p>
                  <div className="flex justify-center items-center">
                    <Button
                      icon={ClipboardList}
                      //disabled={!userData?.subscription?.is_active}
                      onClick={() =>
                        handleActionWithSubscriptionCheck(() =>
                          setIsEditDataModalOpen(true)
                        )
                      }
                    >
                      데이터 등록
                    </Button>
                  </div>
                </Card>

                {/* 서비스 요청 카드 */}
                <Card>
                  <h3
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    서비스 요청
                  </h3>
                  <p className="h-16">
                    FAQ 수정이나 서비스 관련 요청을 <br /> 편하게 문의하세요.
                  </p>
                  <div className="flex justify-center items-center">
                    <Button
                      icon={Send}
                      onClick={() => setIsRequestDataModalOpen(true)}
                    >
                      문의하기
                    </Button>
                  </div>
                </Card>
              </div>

              {/* 공지사항, FAQ, 통계 및 분석 섹션 */}
              <div className="grid grid-cols-1 gap-6 mt-10 w-full md:grid-cols-3">
                {/* 정기 구독 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4 w-full">
                  <h2
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    정기 구독
                  </h2>
                  <div>
                    {publicData?.billing_key?.is_active ? (
                      <SubscriptionActive subscriptionData={billing_key} />
                    ) : (
                      <SubscriptionSignup
                        token={token}
                        publicData={publicData}
                      />
                    )}
                  </div>
                </div>

                {/* 공지사항 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4 ">
                  <h2
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    공지사항
                  </h2>
                  <ul className="space-y-4 px-0 md:px-4 h-36">
                    {lastNotifications.map((notification) => (
                      <li
                        key={notification.id}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <h3
                          className="text-base font-semibold text-black truncate"
                          style={{ maxWidth: "70%" }} // 긴 제목을 생략하고 너비 제한
                        >
                          {notification.title}
                        </h3>
                        <p className="text-xs text-gray-500 hidden md:block">
                          {notification.date}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end">
                    <button
                      className="text-indigo-500 font-semibold text-sm"
                      onClick={() => router.push("/notice")}
                    >
                      자세히 보기
                    </button>
                  </div>
                </div>

                {/* 통계 및 분석 섹션 */}
                <div className="bg-white rounded-lg p-6 space-y-4 text-center">
                  <h2
                    className="text-2xl text-indigo-600"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    통계 및 분석
                  </h2>
                  {isLoadingStatistics ? (
                    <p className="text-gray-700 px-0 md:px-4">
                      데이터 로딩 중...
                    </p>
                  ) : statisticsData ? (
                    <>
                      <ul className="text-gray-700 px-0 md:px-4 space-y-2 h-36">
                        {statisticsData.map((stat, index) => (
                          <li
                            key={index}
                            className="text-gray-800 text-base font-semibold truncate"
                          >
                            <p>
                              {" "}
                              {index + 1}. {stat.utterance} - {stat.count}회{" "}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <div className="flex justify-end mt-5">
                        <button
                          className="text-indigo-500 font-semibold text-sm"
                          onClick={() => router.push("/statistics")}
                        >
                          더 보기
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-700 px-0 md:px-4">
                      데이터가 준비 중입니다.
                    </p>
                  )}
                </div>
              </div>
            </main>
          </div>
        </main>
      </div>

      <Footer className="w-full mt-auto hidden md:block" isMobile={isMobile} />

      <RegisterChatbotDataModal
        show={isEditDataModalOpen}
        onClose={() => {
          setIsEditDataModalOpen(false);
        }}
      />

      {/* 데이터 요청 모달 */}
      <RequestService
        show={isRequestDataModalOpen}
        onClose={() => {
          setIsRequestDataModalOpen(false);
        }}
      />

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={() => setShowErrorMessageModal(false)}
      >
        <p style={{ whiteSpace: "pre-line" }}>
          {typeof errorMessage === "object"
            ? Object.entries(errorMessage).map(([key, value]) => (
                <span key={key}>
                  {key}:{" "}
                  {Array.isArray(value) ? value.join(", ") : value.toString()}
                  <br />
                </span>
              ))
            : errorMessage}
        </p>
      </ModalErrorMSG>
    </div>
  );
};

export default MainPageWithMenuPublic;
