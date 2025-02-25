import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import IdCheckModal from "@/components/modal/idCheckModal"; // 아이디 중복 검사 기능이 있는 컴포넌트
import VerificationModal from "@/components/modal/verificationModal"; // 핸드폰 인증 기능이 있는 컴포넌트
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const signupPublicStep1 = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    dob: "",
    phone: "",
    verificationCode: "",
    email: "",
  });
  const [idChecked, setIdChecked] = useState(false); // 아이디 중복 검사 여부 저장
  const [codeSent, setCodeSent] = useState(false); // 인증 번호 전송 여부 저장
  const [passwordsMatch, setPasswordsMatch] = useState(true); // 비밀번호와 비밀번호 확인이 일치하는지 여부 저장
  const [passwordValid, setPasswordValid] = useState(true); // 비밀번호가 정규식을 통과하는지 여부 저장
  const [phoneError, setPhoneError] = useState(""); // 핸드폰 번호 에러 메시지 저장
  const [verificationError, setVerificationError] = useState(null); // 인증 번호 에러 메시지 저장
  const [errorMessage, setErrorMessage] = useState(""); // 기타 에러 메시지 저장
  const [codeCheck, setCodeCheck] = useState(false); // 인증번호 확인 여부 저장
  const [showIdCheckModal, setShowIdCheckModal] = useState(false); // 아이디 중복 검사 모달 상태 관리
  const [showCodeModal, setShowCodeModal] = useState(false); // 인증번호 입력 모달 상태 관리
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 메시지 모달 상태 관리

  const router = useRouter();

  // 비밀번호와 비밀번호 확인 입력값이 일치하는지 확인
  useEffect(() => {
    setPasswordsMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    const hasUpper = /[A-Z]/.test(password); // 대문자 포함 여부
    const hasLower = /[a-z]/.test(password); // 소문자 포함 여부
    const hasDigit = /\d/.test(password); // 숫자 포함 여부
    const hasSpecial = /[!@#$%^&*]/.test(password); // 특수문자 포함 여부
    const isValidLength = password.length >= 8 && password.length <= 20; // 길이 검사

    return isValidLength && hasUpper + hasLower + hasDigit + hasSpecial >= 2; // 두 가지 이상의 조건을 만족하는지 검사
  };

  // 입력값에 대해 변화를 감지하여 상태 업데이트 및 추가적인 검증 로직 수행
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      // 비밀번호 유효성 검사 수행
      setPasswordValid(validatePassword(value));
    }

    if (name === "confirmPassword") {
      // 비밀번호 확인과 일치 여부 확인
      setPasswordsMatch(value === formData.password);
    }
  };

  // 인증번호 모달을 닫을 때 에러 메시지 초기화
  const handleCodeModalClose = () => {
    setShowCodeModal(false);
    setVerificationError(null); // 에러 메시지 초기화
    setFormData({
      ...formData,
      verificationCode: "", // 인증번호 입력값 초기화
    });
  };

  // 회원가입 버튼 클릭 시 필수 정보 확인 후 다음 페이지로 이동
  const handleNextStep = () => {
    const { username, password, confirmPassword, name, dob, phone } = formData;

    if (!username || !password || !confirmPassword || !name || !dob || !phone) {
      setErrorMessage("필수 항목들을 기입해주시길 바랍니다");
      setShowErrorMessageModal(true);
      return;
    }

    if (!idChecked) {
      setErrorMessage("아이디 중복 확인을 해주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      setShowErrorMessageModal(true);
      return;
    }

    if (!codeCheck) {
      setErrorMessage("핸드폰 인증을 해주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    sessionStorage.setItem("signupPublicUserData", JSON.stringify(formData));
    router.push("/signupPublicStep2");
  };

  // 에러 메시지 모달을 닫음
  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  // 핸드폰 번호로 인증번호 전송 요청
  const handleSendCode = async () => {
    // 핸드폰 번호가 '-' 없이 11자리인지 확인하는 정규식
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("핸드폰 번호를 확인해 주세요.");
      return;
    }

    setPhoneError("");

    // 인증 요청하여 백엔드에서 인증번호 전송
    try {
      const response = await fetch(`${API_DOMAIN}/public/send-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: formData.phone, type: "signup" }), // 회원가입 타입으로 요청
      });

      const data = await response.json();

      if (data.success) {
        // 인증번호가 성공적으로 전송된 경우
        setCodeSent(true);
        setShowCodeModal(true);
        setVerificationError(null); // 에러 메시지를 초기화
      } else if (data.message === "이미 가입한 전화번호입니다.") {
        // 핸드폰 번호가 이미 등록된 경우 에러 메시지 모달 표시
        setErrorMessage("이미 가입된 번호입니다.");
        setShowErrorMessageModal(true);
      } else {
        // 다른 에러 처리
        setPhoneError(data.message);
      }
    } catch (error) {
      setPhoneError("인증 번호 요청 중 오류가 발생했습니다.");
    }
  };

  // 받은 인증번호가 백엔드에서 보낸 인증번호와 일치하는지 확인
  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${API_DOMAIN}/public/verify-code/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: formData.phone,
          code: formData.verificationCode,
          type: "signup",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowCodeModal(false);
        setCodeCheck(true);
      } else {
        setVerificationError(data.message);
      }
    } catch (error) {
      setVerificationError("인증 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-violet-50 px-2 md:px-0">
      <div className="bg-white px-3 py-6 rounded-md shadow-lg max-w-md w-full space-y-3 ">
        <div className="flex flex-col gap-1">
          <div className="flex items-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <ChevronLeft
                className="h-8 w-8 text-indigo-700 cursor-pointer mr-2"
                onClick={() => router.push('/')}
              />
            </motion.div>
            <h1
              className="text-3xl font-bold text-left text-indigo-600"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              회원가입
            </h1>
          </div>
          <div
            className="text-l text-left text-gray-600 px-5"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            기본 정보를 입력해주세요
          </div>
        </div>

        <div className="px-5  space-y-3">
          {/* 아이디 입력 및 중복 확인 */}
          <div className="flex items-center w-full space-x-4 ">
            <div className="flex-grow relative">
              <input
                type="text"
                id="username"
                name="username"
                placeholder="아이디"
                value={formData.username}
                onChange={handleInputChange}
                className="border px-4 py-2 border-gray-300 rounded-md w-full"
              />
              <label
                htmlFor="username"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500"
              >
                *
              </label>
            </div>
            <button
              className="flex items-center justify-end text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
              onClick={() => setShowIdCheckModal(true)}
            >
              아이디 확인
            </button>
          </div>
          <div className="flex flex-col space-y-1">
            {/* 비밀번호 입력 */}
            <label
              className="flex items-center text-gray-700 w-full"
              htmlFor="password"
            >
              <div className="relative flex-grow">
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="border px-4 py-2 border-gray-300 rounded-md w-full"
                />
                <label
                  htmlFor="user-pw"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500"
                >
                  *
                </label>
              </div>
            </label>
            {/* 비밀번호가 정규식에 적합한지 여부에 따라 출력 메시지가 달라짐 */}
            {!passwordValid ? (
              <p className="text-red-400 text-sm font-medium whitespace-pre-line ">
                비밀번호가 8~20자 이내인지, 알파벳(대/소문자), 숫자, 특수문자 중
                최소 2가지를 포함하는지 확인해주세요.
              </p>
            ) : (
              <p className="text-gray-600 text-sm font-medium whitespace-pre-line">
                8~20자 비밀번호를 입력하고, 알파벳(대/소문자), 숫자, 특수문자 중
                최소 2가지를 포함해야 합니다.
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            {/* 비밀번호 확인 입력 */}
            <label
              className="flex items-center text-gray-700 w-full"
              htmlFor="confirmPassword"
            >
              <div className="relative flex-grow">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호 확인"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`border px-4 py-2 border-gray-300 rounded-md w-full ${
                    !passwordsMatch ? "border-red-500" : ""
                  }`}
                />
                <label
                  htmlFor="user-pw"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500"
                >
                  *
                </label>
              </div>
            </label>
            {/* 비밀번호와 비밀번호 확인란 입력값이 동일한지 확인 */}
            {!passwordsMatch && (
              <p className="text-red-500 text-sm font-medium">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>

          <div className="flex space-x-2">
            {/* 이름 입력 */}
            <label className="flex items-center block text-gray-700 w-1/2">
              <div className="relative w-full">
                <input
                  type="text"
                  name="name"
                  placeholder="이름"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border px-4 py-2 border-gray-300 rounded-md w-full"
                />
                <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </label>
              </div>
            </label>

            {/* 생년월일 입력 */}
            <label className="flex items-center justify-end text-gray-700 w-1/2">
              <div className="relative w-full">
                <input
                  type="text"
                  name="dob"
                  placeholder="생년월일(ex.880111)"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="border px-4 py-2 border-gray-300 rounded-md w-full"
                />
                <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">
                  *
                </label>
              </div>
            </label>
          </div>

          <div className="flex ">
            {/* 핸드폰 번호 입력 */}
            <label className="block text-gray-700 w-full">
              <div className="flex items-center justify-start space-x-2.5">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    name="phone"
                    placeholder="휴대폰 번호( - 제외숫자만)"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border px-4 py-2 border-gray-300 rounded-md w-full "
                  />
                  <label className="absolute left-2 top-1/2 transform -translate-y-1/2 text-red-500">
                    *
                  </label>
                </div>
                <button
                  className="flex items-center justify-end text-indigo-500 rounded-md px-4 py-2 hover:font-semibold whitespace-nowrap"
                  onClick={handleSendCode}
                >
                  인증번호 받기
                </button>
              </div>
              {/* 핸드폰 번호 오류 메시지 표시 */}
              {phoneError && (
                <p className="text-red-500 text-xs mt-1 font-medium ">
                  {phoneError}
                </p>
              )}
            </label>
          </div>

          <div>
            {/* 이메일 입력 */}
            <label className="flex text-gray-700 w-full">
              <input
                type="email"
                name="email"
                placeholder="이메일"
                value={formData.email}
                onChange={handleInputChange}
                className="border px-4 py-2 border-gray-300 rounded-md w-full "
              />
            </label>
          </div>

          <button
            className="w-full bg-indigo-500 text-white py-2 rounded-full text-lg font-semibold"
            onClick={handleNextStep}
          >
            다음
          </button>

          <div className="text-center text-gray-500 flex flex-col space-y-2">
            <p>
              이미 계정이 있나요?
              <Link href="/login" className="underline text-blue-500 p-1 m-1">
                로그인
              </Link>
            </p>
            <p className="">
              계정을 잊어버리셨나요?
              <Link
                href="/findAccount"
                className="underline text-blue-500 p-1 m-1"
              >
                계정찾기
              </Link>
            </p>
          </div>

          {/* 아이디 중복 검사 및 정규식 적합 검사하는 모달 */}
          <IdCheckModal
            show={showIdCheckModal}
            onClose={() => setShowIdCheckModal(false)}
            onIdCheckComplete={(isCheck) => {
              setIdChecked(isCheck);
              if (!isCheck) {
                setErrorMessage("");
              }
            }}
            username={formData.username}
            isPublic="true"
          />

          {/* 핸드폰 이용하여 본인 인증하는 모달 */}
          <VerificationModal
            isOpen={showCodeModal}
            onClose={handleCodeModalClose} // 에러 초기화를 위해 수정된 핸들러 사용
            onSubmit={handleVerifyCode}
            verificationCode={formData.verificationCode}
            onChange={handleInputChange}
            errorMessage={verificationError}
          />

          {/* 에러메시지 모달 */}
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
        </div>
      </div>
    </div>
  );
};

export default signupPublicStep1;
