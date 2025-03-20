import { useState, useRef } from "react";
import {
  X,
  Download,
  Upload,
  FileText,
  FileUp,
  CheckCircle,
  AlertCircle,
  CloudUpload,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function RegisterStoreData({ show, onClose }) {
  const { token } = useAuth();
  const [fileNames, setFileNames] = useState([]);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessageModal, setShowErrorMessageModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const names = files.map((file) => file.name);
    setFileNames(names);
  };

  const resetForm = () => {
    setFileNames([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/templates/mumul_service_data_guideline_2.xlsx";
    link.download = "[무물] 초기 데이터 입력 양식.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

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

  const handleSubmit = async () => {
    const files = fileInputRef.current?.files;

    if (!files || files.length === 0) {
      setErrorMessage("파일을 업로드 해주세요.");
      setShowErrorMessageModal(true);
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    try {
      const response = await fetch(`${API_DOMAIN}/api/register-data/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();

        const successMessages = result.results
          .filter((r) => r.status === "success")
          .map((r) => `✅ ${r.file}: \n ${r.message}`)
          .join("\n");

        const errorMessages = result.results
          .filter((r) => r.status === "error")
          .map((r) => `❌ ${r.file}: \n ${r.message}`)
          .join("\n");

        if (errorMessages) {
          setErrorMessage(
            `다음 파일 처리 중 오류가 발생했습니다:\n${errorMessages}`
          );
          setShowErrorMessageModal(true);
        }

        if (successMessages) {
          setMessage(`성공적으로 업로드되었습니다.`);
          setShowMessageModal(true);
        }

        resetForm();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "파일 업로드에 실패했습니다.");
        setShowErrorMessageModal(true);
      }
    } catch (error) {
      console.error("요청 전송 중 오류 발생:", error);
      setErrorMessage("전송 중 오류가 발생했습니다.");
      setShowErrorMessageModal(true);
    } finally {
      setIsLoading(false);
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
              데이터 등록하기
            </h2>
            <p
              className="text-gray-500 text-sm mt-1"
              style={{ fontFamily: "NanumSquareBold" }}
            >
              매장의 정보를 쉽고 빠르게 등록하세요
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
          {/* 양식 다운로드 섹션 */}
          <div className="bg-indigo-50 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-start">
              <div className="bg-white p-2 rounded-lg mr-3">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-semibold text-gray-800 mb-2"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  데이터 등록 양식 다운로드
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  데이터 등록에 필요한 양식을 다운로드하여 작성 후
                  업로드해주세요.
                </p>
                <button
                  onClick={handleDownload}
                  className="w-full py-2 px-4 rounded-lg bg-indigo-600 text-white font-medium flex items-center justify-center transition duration-300 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-200 focus:outline-none"
                >
                  <Download className="mr-2 h-4 w-4" /> 양식 다운로드
                </button>
              </div>
            </div>
          </div>

          <hr className="border-t border-gray-200 w-full" />

          {/* 파일 업로드 섹션 */}
          <div className="bg-gray-50 rounded-xl p-4 transition-all duration-300 hover:shadow-sm">
            <div className="flex items-start">
              <div className="bg-gray-200 p-2 rounded-lg mr-3">
                <FileUp className="h-5 w-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <h2
                  className="text-lg font-semibold text-gray-800 mb-2"
                  style={{ fontFamily: "NanumSquareExtraBold" }}
                >
                  파일 업로드
                </h2>
                <p className="text-sm text-gray-600 mb-3">
                  작성한 양식을 업로드하여 매장 정보를 등록하세요.
                </p>

                {/* 파일 업로드 영역 */}
                <div className="mb-3">
                  <div
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 cursor-pointer ${
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
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center">
                      <CloudUpload className="h-8 w-8 text-gray-400 mb-2" />
                      <p
                        className="text-sm text-gray-500 mb-1"
                        style={{ fontFamily: "NanumSquareBold" }}
                      >
                        파일을 끌어다 놓거나 <br /> 클릭하여 선택하세요
                      </p>
                    </div>
                  </div>
                </div>

                {/* 업로드된 파일 목록 */}
                {fileNames.length > 0 && (
                  <div className="mb-3 bg-gray-100 rounded-lg p-2">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      선택된 파일:
                    </p>
                    <ul className="space-y-1">
                      {fileNames.map((file, index) => (
                        <li
                          key={index}
                          className="text-xs text-gray-600 flex items-center"
                        >
                          <FileText className="h-3 w-3 mr-1 text-indigo-500" />
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 업로드 버튼 */}
                <button
                  onClick={handleSubmit}
                  disabled={fileNames.length === 0 || isLoading}
                  className={`w-full py-2 px-4 rounded-lg flex items-center justify-center transition duration-300 ${
                    fileNames.length > 0 && !isLoading
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      업로드 중...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" /> 파일 업로드
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full py-3 px-4 rounded-lg" />
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
            <p className="whitespace-pre-line text-sm md:text-base"style={{ fontFamily: "NanumSquareBold" }}>{message}</p>
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
