import React, { useState, useEffect } from "react";
import ModalMSG from "./modalMSG";
import ModalErrorMSG from "./modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const IdCheckModal = ({ show, onClose, username, onIdCheckComplete, type }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // API 경로 설정 함수
  const APIUrl = () => {
    let url;
    if (type == "public") url = `${API_DOMAIN}/public/check-username/`;
    else if (type == "corp") url = `${API_DOMAIN}/corp/check-username/`;
    else url = `${API_DOMAIN}/api/check-username/`;
    console.log("[DEBUG] API URL: ", url);
    return url;
  };

  const handleIdCheck = async () => {
    console.log("[DEBUG] handleIdCheck 실행");
    console.log("[DEBUG] 요청할 username: ", username);

    setLoading(true);
    try {
      const apiUrl = APIUrl();
      console.log("[DEBUG] API 요청 URL: ", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      console.log("[DEBUG] 서버 응답 상태 코드: ", response.status);

      const result = await response.json();
      console.log("[DEBUG] 서버 응답 데이터: ", result);

      if (response.status === 409) {
        console.warn("[WARN] 이미 사용 중인 사용자 아이디");
        onIdCheckComplete(false);
        setErrorMessage(
          result.message || "이미 사용 중인 사용자 아이디입니다."
        );
        setShowErrorModal(true);
      } else if (response.status === 400) {
        console.warn("[WARN] 아이디 유효성 검사 실패");
        onIdCheckComplete(false);
        let errorMessage = "아이디 조건에 맞지 않습니다.";
        if (result.username && Array.isArray(result.username)) {
          errorMessage = result.username.join(", ");
        }
        setErrorMessage(errorMessage);
        setShowErrorModal(true);
      } else if (response.status === 200) {
        console.log("[SUCCESS] 아이디 사용 가능");
        onIdCheckComplete(true);
        setMessage(result.message);
      } else {
        console.error("[ERROR] 예상치 못한 응답 상태 코드:", response.status);
        onIdCheckComplete(false);
        setErrorMessage("아이디 중복 검사 중 알 수 없는 오류가 발생했습니다.");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("[ERROR] fetch 요청 중 오류 발생:", error);
      setErrorMessage("아이디 중복 검사 중 오류가 발생했습니다.");
      setShowErrorModal(true);
    } finally {
      console.log("[DEBUG] handleIdCheck 종료");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      console.log("[DEBUG] Modal이 열려서 handleIdCheck 실행");
      handleIdCheck();
    }
  }, [show]);

  return (
    <div>
      {show && !showErrorModal && (
        <ModalMSG show={show} onClose={onClose} title="ID 확인">
          {loading ? (
            <p>확인 중...</p>
          ) : (
            <p className="text-center mt-2">{message}</p>
          )}
        </ModalMSG>
      )}
      {showErrorModal && (
        <ModalErrorMSG
          show={showErrorModal}
          onClose={() => {
            setShowErrorModal(false);
            onClose();
          }}
        >
          <p>{errorMessage}</p>
        </ModalErrorMSG>
      )}
    </div>
  );
};

export default IdCheckModal;
