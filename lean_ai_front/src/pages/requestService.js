import { useState, useEffect, useRef } from "react";
import {
  X,
  MessageSquare,
  FileText,
  Send,
  FileUp,
  CheckCircle,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { usePublic } from "@/contexts/publicContext";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function RequestService({ show, onClose }) {
  const { token } = useAuth();
  const { isPublicOn } = usePublic();
  const [title, setTitle] = useState(""); // 제목 상태
  const [content, setContent] = useState(""); // 요청 내용 상태
  const [fileNames, setFileNames] = useState([]); // 파일 이름 목록 상태
  const [message, setMessage] = useState(""); // 성공 메시지 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false); // 에러 모달 상태
  const [showMessageModal, setShowMessageModal] = useState(false); // 성공 모달 상태
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태
  const [isDragging, setIsDragging] = useState(false); // 드래그 상태

  const fileInputRef = useRef(null); // 파일 입력 참조

  // 파일 변경 시 호출되는 함수
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // 선택된 파일을 배열로 변환
    const names = files.map((file) => file.name); // 파일 이름을 배열로 저장
    setFileNames(names); // 파일 이름 상태 업데이트
  };

  // 폼을 초기화하는 함수
  const resetForm = () => {
    setTitle(""); // 제목 초기화
    setContent(""); // 내용 초기화
    setFileNames([]); // 파일 이름 초기화
    if (fileInputRef.current) fileInputRef.current.value = ""; // 파일 입력 값 초기화
  };

  // 드래그 오버 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // 드래그 리브 핸들러
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // 드롭 핸들러
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const names = files.map((file) => file.name);
      setFileNames(names);
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
    }
  };

  // 제출 버튼 클릭 시 호출되는 함수
  const handleSubmit = async () => {
    const files = fileInputRef.current?.files; // 파일 입력 참조

    // 제목, 내용, 파일 중 하나라도 입력되지 않았을 때 에러 메시지 표시
    if (!title && !content && (!files || files.length === 0)) {
      setErrorMessage(
        "제목, 요청 내용 또는 파일 중 하나는 반드시 입력해야 합니다."
      );
      setShowErrorMessageModal(true);
      return;
    }

    setIsLoading(true); // 로딩 상태 활성화

    const formData = new FormData(); // 서버 전송을 위한 FormData 생성
    if (title) formData.append("title", title); // 제목 추가
    if (content) formData.append("content", content); // 내용 추가
    if (files) {
      Array.from(files).forEach((file) => formData.append("files", file)); // 파일 추가
    }

    let fetchUrl; // URL 변수를 선언

    try {
      fetchUrl = isPublicOn
        ? `${API_DOMAIN}/public/request-service/`
        : `${API_DOMAIN}/api/request-service/`;

      const response = await fetch(fetchUrl, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 전송 성공 시 성공 메시지 표시 및 폼 초기화
      if (response.ok) {
        setMessage("서비스 요청이 성공적으로 등록되었습니다.");
        setShowMessageModal(true);
        resetForm();
      } else {
        // 전송 실패 시 에러 메시지 표시
        const errorData = await response.json();
        console.error("요청 전송 실패:", errorData);
        setErrorMessage("서비스 요청 등록에 실패했습니다.");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      // 전송 중 에러 발생 시 에러 메시지 표시
      console.error("요청 전송 중 오류 발생:", error);
      setErrorMessage("전송 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    } finally {
      setIsLoading(false); // 로딩 상태 비활성화
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 overflow-y-auto scroll-auto w-[95%] h-[70%] md:min-h-[720px] md:min-w-[400px] md:max-w-[25%]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="relative">
          <div className="flex flex-col items-center justify-center text-center w-full">
            <h2
              className="text-2xl font-bold text-gray-800 mt-4"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              서비스 요청하기
            </h2>
            <p
              className="text-gray-500 text-sm mt-1"
              style={{ fontFamily: "NanumSquareBold" }}
            >
              필요한 서비스를 손쉽게 요청하세요
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-indigo-500 rounded-full text-white p-1 absolute -top-2 -right-2 z-20"
            aria-label="닫기"
          >
            <X className="h-5 w-5 " />
          </button>
        </div>

        <main className="w-full space-y-4 px-2 mt-5">
          <div className="flex flex-col space-y-6 justify-center w-full bg-indigo-50 rounded-xl p-4 mb-3">
            {/* 제목 입력 섹션 */}
            <div className="transition-all duration-300 ">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-lg mr-3">
                  <MessageSquare className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2
                    className="text-lg font-semibold text-gray-800 mb-2"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    제목
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    요청하시는 서비스의 제목을 입력해주세요.
                  </p>
                  <input
                    id="title"
                    type="text"
                    placeholder="제목을 입력하세요"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 내용 입력 섹션 */}
            <div className="transition-all duration-300">
              <div className="flex items-start">
                <div className="bg-white p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h2
                    className="text-lg font-semibold text-gray-800 mb-2"
                    style={{ fontFamily: "NanumSquareExtraBold" }}
                  >
                    요청 내용
                  </h2>
                  <p className="text-sm text-gray-600 mb-3">
                    요청하시는 서비스에 대한 자세한 내용을 입력해주세요.
                  </p>
                  <textarea
                    id="content"
                    placeholder="내용 입력"
                    className="w-full p-3 border rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 w-full mb-3" />

          {/* 파일 업로드 섹션  */}
          <div className="bg-gray-50 rounded-xl p-3 transition-all duration-300 mb-4">
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <FileUp className="h-5 w-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-semibold text-gray-800 mb-1"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  파일 업로드
                </h2>

                {/* 파일 업로드 영역  */}
                <div className="flex items-center">
                  <div
                    className={`flex-1 border border-dashed rounded-lg p-3 text-center transition-all duration-200 cursor-pointer mr-2 ${
                      isDragging
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-300 hover:border-indigo-300 bg-white"
                    }`}
                    onClick={() => fileInputRef.current.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      id="fileInput"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center justify-center">
                      <CloudUpload className="h-5 w-5 text-gray-400 mr-2" />
                      <span
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "NanumSquareBold" }}
                      >
                        파일 선택 또는 드래그
                      </span>
                    </div>
                  </div>
                </div>

                {/* 업로드된 파일 목록 */}
                {fileNames.length > 0 && (
                  <div className="mt-2 bg-white border border-gray-100 rounded-lg p-1.5">
                    <div className="max-h-16 overflow-y-auto">
                      <ul className="space-y-0.5">
                        {fileNames.map((file, index) => (
                          <li
                            key={index}
                            className="text-xs text-gray-600 flex items-center py-0.5"
                          >
                            <FileText className="h-3 w-3 mr-1 text-indigo-500 flex-shrink-0" />
                            <span className="truncate">{file}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-xs text-gray-400 text-right mt-1">
                      {fileNames.length}개 파일 선택됨
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                처리 중...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" /> 요청하기
              </>
            )}
          </button>
        </main>

        {/* 성공 메시지 모달 */}
        <ModalMSG
          show={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          title="Success"
        >
          <div className="flex items-center text-center justify-center text-lg" >
            <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
            <p className="whitespace-pre-line text-sm md:text-base" style={{ fontFamily: "NanumSquareBold" }}>{message}</p>
          </div>
        </ModalMSG>

        {/* 에러 메시지 모달 */}
        <ModalErrorMSG
          show={showErrorMessageModal}
          onClose={() => setShowErrorMessageModal(false)}
          title="Error"
        >
          <div className="flex items-center text-center justify-center text-lg">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <p className="whitespace-pre-line text-sm md:text-base"style={{ fontFamily: "NanumSquareBold" }}>{errorMessage}</p>
          </div>
        </ModalErrorMSG>

        <style jsx global>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }

          /* iOS 스타일 패딩 제거 */
          input,
          textarea,
          select,
          button {
            -webkit-appearance: none;
            border-radius: 0.5rem;
          }

          /* 입력필드 포커스 시 아웃라인 스타일 */
          input:focus,
          textarea:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
          }
        `}</style>
      </div>
    </div>
  );
}
