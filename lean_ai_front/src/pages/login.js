import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/authContext";
import { useStore } from "../contexts/storeContext";
import { usePublic } from "../contexts/publicContext";
import ConvertSwitch from "../components/component/convertSwitch1";
import ModalErrorMSG from "../components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태 추가
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const { saveToken, token } = useAuth();
  const { storeID, setStoreID } = useStore();
  const { isPublicOn, togglePublicOn } = usePublic();

  const handleErrorMessageModalClose = () => {
    setShowErrorMessageModal(false);
  };

  // 로그인 요청 함수
  const handleLoginClick = async () => {
    try {
      const url = isPublicOn
        ? `${API_DOMAIN}/public/login/`
        : `${API_DOMAIN}/api/login/`;

      const response = await axios.post(url, {
        username,
        password,
      });

      const { access, public_id, store_id, user_data } = response.data;

      // 토큰 저장
      await saveToken(access);

      // 사용자 데이터 및 storeID 설정
      setUserData(user_data);
      const id = isPublicOn ? public_id : store_id;
      setStoreID(id);
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      const errorMsg = error.response?.data?.error || "로그인에 실패했습니다";
      setErrorMessage(errorMsg);
      setShowErrorMessageModal(true);
    }
  };

  // token, storeID, userData 변경 감지
  /*
    useEffect(() => {
        if (token && storeID && userData) {
            console.log('userData.subscription : ',userData.subscription);
            const hasSubscription = userData.subscription?.is_active;

            // 구독 여부에 따라 페이지 이동
            if (hasSubscription) {
                if (isPublicOn) {
                    router.push('/mainPageForPublic');
                } else {
                    router.push('/mainPage');
                }
            } else {
                router.push('/subscriptionPlans');
            }
        }
    }, [token, storeID, userData, isPublicOn]);
    */

  useEffect(() => {
    if (token && storeID) {
      if (isPublicOn) {
        router.push("/mainPageForPublic");
      } else {
        router.push("/mainPage");
      }
    }
  }, [token, storeID, isPublicOn]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLoginClick();
    }
  };

  return (
    <div className="bg-violet-50 flex justify-center items-center h-screen font-sans">
      <div
        className="bg-white rounded-lg shadow-lg p-8 max-w-md m-10"
        style={{ width: "400px" }}
      >
        <h1
          className="text-3xl font-bold text-indigo-600 text-center mb-8 cursor-pointer"
          style={{ fontFamily: "NanumSquareExtraBold" }}
          onClick={() => router.push("/")}
        >
          MUMUL
        </h1>
        <div className="space-y-4">
          <ConvertSwitch
            isPublicOn={isPublicOn}
            togglePublicOn={togglePublicOn} // toggle 함수 전달
          />
          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="ml-2 w-full border-none focus:ring-0"
            />
          </div>

          <div className="flex items-center border rounded-md px-4 py-2">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="ml-2 w-full border-none focus:ring-0"
              onKeyDown={handleKeyDown}
            />
          </div>

          <button
            className="bg-indigo-500 text-white text-lg font-semibold py-2 px-4 rounded-full w-full"
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </div>

        <div className="mt-4 text-center text-gray-500">
          <p>
            <Link
              href="/signupType"
              className="hover:underline text-blue-500 m-1"
            >
              회원가입
            </Link>
            {" | "}
            <Link
              href="/findAccount"
              className="hover:underline text-blue-500 m-1"
            >
              계정찾기
            </Link>
          </p>
        </div>

        <ModalErrorMSG
          show={showErrorMessageModal}
          onClose={handleErrorMessageModalClose}
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
    </div>
  );
};

export default Login;
