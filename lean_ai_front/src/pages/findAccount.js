import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { 
  ChevronLeft, 
  User, 
  Key, 
  Clock,
  Send,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useLoginType } from "@/contexts/loginTypeContext";
import TypeButton from "@/components/component/ui/typeButton";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import ModalResetPassword from "@/components/modal/resetPasswordModal";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

function FindAccount() {
  const router = useRouter();
  const { loginType } = useLoginType();
  const [activeTab, setActiveTab] = useState("id");
  const [formData, setFormData] = useState({
    id: "",
    phone: "",
    verificationCode: "",
  });
  const [codeSent, setCodeSent] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const path =
    loginType === "public"
      ? "public"
      : loginType === "corporation"
      ? "corp"
      : "api";

  const apiEndpoint = `${API_DOMAIN}/${path}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendCode = async () => {
    const phoneRegex = /^\d{11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage("휴대폰 번호는 '-' 제외 11자리 숫자로 입력해주세요");
      setShowErrorMessageModal(true);
      return;
    }

    try {
      const response = await fetch(`${apiEndpoint}/send-code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.id || undefined,
          phone: formData.phone,
          type: activeTab === "id" ? "findID" : "findPW",
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCodeSent(true);
        setModalMessage("인증번호가 발송되었습니다!");
        setIsModalOpen(true);
        setTimeLeft(180);
        setTimerActive(true);
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("인증 번호 요청 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch(`${apiEndpoint}/verify-code/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.id || undefined,
          phone: formData.phone,
          code: formData.verificationCode,
          type: activeTab === "id" ? "findID" : "findPW",
        }),
      });

      const data = await response.json();
      if (data.success) {
        if (activeTab === "id") {
          sessionStorage.setItem("userId", data.user_id);
          sessionStorage.setItem("dateJoined", data.date_joined);
          router.push("/findAccountResult");
        } else {
          setShowResetPasswordModal(true);
        }
      } else {
        setErrorMessage(data.message);
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      setErrorMessage("인증 확인 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
    setErrorMessage("");
  };

  const handleCloseResetPasswordModal = () => {
    setShowResetPasswordModal(false);
  };

  useEffect(() => {
    let timer;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setTimerActive(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && codeSent) {
      setErrorMessage("인증 시간이 초과되었습니다.");
      setShowErrorMessageModal(true);
      setCodeSent(false);
    }
  }, [timeLeft, codeSent]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // 타이머 색상 계산
  const getTimerColor = () => {
    if (timeLeft > 60) return "text-green-500";
    if (timeLeft > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-violet-50 flex items-center justify-center min-h-screen py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white w-full max-w-md mx-auto rounded-2xl shadow-xl overflow-hidden"
      >
        {/* 헤더 */}
        <div className="bg-indigo-500 px-6 py-5 text-white">
          <div className="flex items-center mb-3">
            <motion.div 
              whileHover={{ scale: 1.1 }} 
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft
                className="h-6 w-6 text-white cursor-pointer mr-2"
                onClick={() => router.push("/login")}
              />
            </motion.div>
            <h1 className="text-xl font-bold">
              계정 찾기
            </h1>
          </div>
          
          {/* 탭 버튼 */}
          <div className="flex bg-white/10 rounded-lg p-1 mt-2">
            <button
              onClick={() => setActiveTab("id")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-4 rounded-lg transition-all ${
                activeTab === "id"
                  ? "bg-white text-indigo-600 font-medium"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <User className="w-4 h-4" />
              <span>아이디</span>
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 flex items-center justify-center space-x-1.5 py-2 px-4 rounded-lg transition-all ${
                activeTab === "password"
                  ? "bg-white text-indigo-600 font-medium"
                  : "text-white hover:bg-white/20"
              }`}
            >
              <Key className="w-4 h-4" />
              <span>비밀번호</span>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {/* 안내 메시지 */}
            <div className="flex items-start p-4 bg-indigo-50 rounded-xl">
              <AlertCircle className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-indigo-800">
                {activeTab === "id" 
                  ? "가입 시 등록한 휴대폰 번호로 아이디를 찾을 수 있습니다." 
                  : "아이디와 가입 시 등록한 휴대폰 번호로 비밀번호를 재설정할 수 있습니다."}
              </p>
            </div>
            
            {/* 회원 유형 선택 */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">회원 유형</p>
              <TypeButton />
            </div>

            {/* 찾기 폼 */}
            <div className="space-y-4">
              {activeTab === "password" && (
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">아이디</label>
                  <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="아이디를 입력하세요"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">휴대폰 번호</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="'-' 제외 11자리"
                  />
                  <button
                    onClick={handleSendCode}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl transition-colors flex-shrink-0 font-medium"
                  >
                    전송
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">인증번호</label>
                  {timerActive && (
                    <div className="flex items-center text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      <span className="font-mono text-sm">
                        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    placeholder="인증번호 6자리"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleVerifyCode}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-xl transition-colors flex-shrink-0 font-medium"
                  >
                    확인
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <ModalMSG title="알림" show={isModalOpen} onClose={handleCloseModal}>
        {modalMessage}
      </ModalMSG>

      <ModalErrorMSG
        show={showErrorMessageModal}
        onClose={handleErrorMessageModalClose}
      >
        <p>{errorMessage}</p>
      </ModalErrorMSG>

      <ModalResetPassword
        show={showResetPasswordModal}
        onClose={handleCloseResetPasswordModal}
        phone={formData.phone}
      />
    </div>
  );
}

export default FindAccount;