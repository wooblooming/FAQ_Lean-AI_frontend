import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import axios from "axios";
import { useStore } from "@/contexts/storeContext";
import useConvertToJwtToken from "@/hooks/useConvertToJwtToken";
import DOBModal from "@/components/modal/dobModal";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const SignupStep2 = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    dob: "",
    phone: "",
    email: "",
    store_category: "",
    store_name: "",
    store_address: "",
  });
  const [isOAuthUser, setIsOAuthUser] = useState(false);
  const { convertToJwtToken } = useConvertToJwtToken(); // JWT 변환 훅 사용
  const { setStoreID } = useStore();
  const [errorMessage, setErrorMessage] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false); // 생년월일 입력 모달

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("signupUserData");
    setIsOAuthUser(sessionStorage.getItem("isOAuthUser") === "true");

    //console.log("storedUserData: ", storedUserData);

    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData);
      setFormData((prev) => ({ ...prev, ...parsedData }));

      if (!parsedData.dob) {
        setShowDobModal(true);
      }
  
    } else {
      router.push("/signupStep1");
    }
  }, []);

  // 입력 필드 변경 처리 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "store_category" && value !== "") setShowWarning(false);
  };

  // 생년월일 입력 완료 처리
  const handleDobSubmit = (dobValue) => {
    if (!/^\d{6}$/.test(dobValue)) {
      setErrorMessage("생년월일은 YYMMDD 형식이어야 합니다.");
      setShowErrorMessageModal(true);
      return;
    }

    setFormData({ ...formData, dob: dobValue });
    setShowDobModal(false);
  };

  // 회원가입 처리 함수
  const handleSignup = async () => {
    const {
      username,
      password,
      name,
      dob,
      phone,
      email,
      store_category,
      store_name,
      store_address,
    } = formData;

    if (!store_category || !store_name || !store_address) {
      setErrorMessage("필수 항목들을 기입해 주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    if (!dob) {
      setErrorMessage("생년 월일을 기입해 주세요.");
      setShowDobModal(true);
      return;
    }

    const signupEndpoint = isOAuthUser ? "/api/social-signup/" : "/api/signup/";

    let dobFormatted = dob;
    if (dob.includes("-")) {
      // YYYY-MM-DD 형식을 YYMMDD로 변환
      dobFormatted =
        dob.substring(2, 4) + dob.substring(5, 7) + dob.substring(8, 10);
    } else if (dob.length === 6) {
      // 이미 YYMMDD 형식이면 그대로 유지
      dobFormatted = dob;
    } else {
      setErrorMessage("생년월일을 YYMMDD 형태로 입력해 주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await axios.post(
        `${API_DOMAIN}${signupEndpoint}`,
        {
          username,
          password: isOAuthUser ? undefined : password, // 소셜 로그인 사용자는 비밀번호 제외
          name,
          dob: dobFormatted,
          phone,
          email: email || null,
          store_category,
          store_name,
          store_address,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        if (isOAuthUser) {
          setStoreID(response.data.store_id);
          const tokenSuccess = await convertToJwtToken(formData);

          if (tokenSuccess) {
            setShowWelcomeModal(true);
          } else {
            console.error("JWT 토큰 변환 실패");
          }
        } else {
          setShowWelcomeModal(true);
        }
      } else {
        setErrorMessage(response.data.message || "회원가입에 실패했습니다.");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      setErrorMessage(
        error.response?.data?.message || "회원가입 요청 중 오류가 발생했습니다."
      );
      setShowErrorMessageModal(true);
    }
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  const handleWelcomeModalClose = () => {
    setShowWelcomeModal(false);
    if (isOAuthUser) {
      //router.push('/subscriptionPlans');
      router.push("/mainPage");
    } else router.push("/login"); // 환영 모달 닫기 후 로그인 페이지로 이동
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50 px-2 md:px-0">
      <div className="bg-white px-3 py-6 rounded-md shadow-lg max-w-md w-full space-y-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ChevronLeft
                className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                onClick={() => router.back()}
              />
            </motion.div>
            <h1 className="text-3xl font-bold text-left text-indigo-600">
              회원가입
            </h1>
          </div>
          <div className="text-l text-left text-gray-600 px-5">
            사업장 정보를 입력해주세요
          </div>
        </div>

        <div className="px-5 space-y-3">
          {/* 비즈니스 종류 선택 - 드롭다운 */}
          <div className="mb-4">
            <select
              name="store_category"
              value={formData.store_category}
              onChange={handleInputChange}
              className={`w-full border rounded-md p-2 ${
                showWarning ? "border-red-500" : ""
              }`}
            >
              <option value="">비즈니스 종류를 선택해주세요</option>
              <option value="FOOD">음식점</option>
              <option value="RETAIL">판매점</option>
              <option value="UNMANNED">무인매장</option>
              <option value="OTHER">기타</option>
            </select>

            {showWarning && (
              <p className="text-red-500 text-sm mt-1">
                비즈니스 종류를 선택해주세요.
              </p>
            )}
          </div>

          {/* 사업자명 입력 필드 */}
          <div>
            <label className="flex text-gray-700 mb-3">
              <input
                type="text"
                name="store_name"
                placeholder="매장명"
                value={formData.store_name || ""}
                onChange={handleInputChange}
                className="border px-4 py-2 border-gray-300 rounded-md w-full"
              />
            </label>
          </div>

          {/* 주소 입력 필드 */}
          <div>
            <label className="flex text-gray-700 w-full">
              <input
                type="text"
                name="store_address"
                placeholder="주소"
                value={formData.store_address || ""}
                onChange={handleInputChange}
                className="border px-4 py-2 border-gray-300 rounded-md w-full"
              />
            </label>
          </div>

          {/* 회원가입 버튼 */}
          <button
            className="w-full bg-indigo-500 text-white py-2 rounded-lg text-lg font-semibold"
            onClick={handleSignup}
          >
            회원가입
          </button>

          <DOBModal
            show={showDobModal}
            onClose={() => setShowDobModal(false)}
            onSubmit={handleDobSubmit}
            initialDOB={formData.dob}
            setErrorMessage={setErrorMessage}
          />

          {/* 에러 메시지 모달 */}
          <ModalErrorMSG
            show={showErrorMessageModal}
            onClose={handleErrorMessageModalClose}
          >
            <p className="whitespace-pre-line">
              {typeof errorMessage === "object"
                ? Object.entries(errorMessage).map(([key, value]) => (
                    <span key={key}>
                      {key}:{" "}
                      {Array.isArray(value)
                        ? value.join(", ")
                        : value.toString()}
                      <br />
                    </span>
                  ))
                : errorMessage}
            </p>
          </ModalErrorMSG>

          {/* 회원가입 성공 모달 */}
          <ModalMSG
            show={showWelcomeModal}
            onClose={handleWelcomeModalClose}
            title="Welcome"
          >
            <p className="">{formData.username}님 환영합니다!</p>
          </ModalMSG>
        </div>
      </div>
    </div>
  );
};

export default SignupStep2;
