import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import ModalMSG from "@/components/modal/modalMSG";
import ModalErrorMSG from "@/components/modal/modalErrorMSG";
import OpeningHoursSelector from "@/components/component/ui/openingHours";
import FileInput from "@/components/component/ui/fileInput";
import TextInput from "@/components/component/ui/textInput";
import { Building2, MapPin, Phone, Image, Clock } from "lucide-react";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

export default function RegisterPublicModal({
  show,
  onRegisterSuccess,
  onClose,
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    publicName: "",
    publicAddress: "",
    publicTel: "",
    publicLogo: null,
  });

  const [errors, setErrors] = useState({
    publicName: false,
    publicAddress: false,
    publicTel: false,
  });

  const [weekdayHours, setWeekdayHours] = useState({
    startHour: "09",
    startMinute: "00",
    endHour: "18",
    endMinute: "00",
  });
  const [weekendHours, setWeekendHours] = useState({
    startHour: "09",
    startMinute: "00",
    endHour: "13",
    endMinute: "00",
  });
  const [isWeekendEnabled, setIsWeekendEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 모달이 표시될 때 폼 데이터 초기화
  useEffect(() => {
    if (show) {
      setFormData({
        publicName: "",
        publicAddress: "",
        publicTel: "",
        publicLogo: null,
      });
      setErrors({
        publicName: false,
        publicAddress: false,
        publicTel: false,
      });
      setWeekdayHours({
        startHour: "09",
        startMinute: "00",
        endHour: "18",
        endMinute: "00",
      });
      setWeekendHours({
        startHour: "09",
        startMinute: "00",
        endHour: "13",
        endMinute: "00",
      });
      setIsWeekendEnabled(false);
    }
  }, [show]);

  const handleMessageModalClose = () => {
    setShowMessageModal(false);
    setMessage("");
    onClose();
    if (onRegisterSuccess) {
      onRegisterSuccess();
    } else {
      router.reload();
    }
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 입력 값이 있으면 해당 필드의 오류 상태를 제거
    if (value.trim() !== "") {
      setErrors({ ...errors, [name]: false });
    }
  };

  const handleFileChange = (file) => {
    setFormData({ ...formData, publicLogo: file });
  };

  const validateForm = () => {
    const newErrors = {
      publicName: !formData.publicName.trim(),
      publicAddress: !formData.publicAddress.trim(),
      publicTel: !formData.publicTel.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((hasError) => hasError);
  };

  const handleRegisterPublic = async () => {
    // 폼 유효성 검사
    if (!validateForm()) {
      setErrorMessage("모든 필수 항목을 입력해주세요.");
      setShowErrorModal(true);
      return;
    }

    setIsLoading(true);
    setIsSaving(true);

    try {
      const formattedHours = `평일: ${weekdayHours.startHour}:${
        weekdayHours.startMinute
      }-${weekdayHours.endHour}:${weekdayHours.endMinute}, ${
        isWeekendEnabled
          ? `주말: ${weekendHours.startHour}:${weekendHours.startMinute}-${weekendHours.endHour}:${weekendHours.endMinute}`
          : "주말: 휴무"
      }`;

      const formPayload = new FormData();
      formPayload.append("public_name", formData.publicName);
      formPayload.append("opening_hours", formattedHours);
      formPayload.append("public_address", formData.publicAddress);
      formPayload.append("public_tel", formData.publicTel);
      if (formData.publicLogo) {
        formPayload.append("logo", formData.publicLogo);
      }

      const response = await axios.post(
        `${API_DOMAIN}/public/publics/`,
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status === "success") {
        setMessage(
          `"${formData.publicName}" 기관이 성공적으로 등록되었습니다.`
        );
        setShowMessageModal(true);
      } else {
        throw new Error("등록 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Registration error:", error);

      if (error.response && error.response.status === 400) {
        if (error.response.data.public_name) {
          setErrorMessage(`기관명 오류: ${error.response.data.public_name}`);
        } else if (error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("기관 정보가 유효하지 않습니다. 다시 확인해주세요.");
        }
      } else {
        setErrorMessage(
          "서버 연결 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요."
        );
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 p-4">
      <div className="bg-white px-6 py-10 rounded-lg shadow-lg w-full max-w-md relative max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold text-indigo-600 mb-2"
            style={{ fontFamily: "NanumSquareExtraBold" }}
          >
            기관 등록
          </h1>
          <p
            className="text-gray-600"
            style={{ fontFamily: "NanumSquareBold" }}
          >
            등록할 기관 정보를 입력해주세요
          </p>
        </div>

        {/* 폼 필드 */}
        <div className="space-y-4" style={{ fontFamily: "NanumSquareBold" }}>
          <div className="relative">
            <TextInput
              id="publicName"
              name="publicName"
              label="기관 이름"
              placeholder="기관명을 입력하세요"
              value={formData.publicName}
              onChange={handleInputChange}
              required={true}
              error={errors.publicName}
              icon={<Building2 className="h-5 w-5 text-indigo-500" />}
            />
            {errors.publicName && (
              <p className="text-red-500 text-xs italic mt-1">
                기관 이름을 입력해주세요
              </p>
            )}
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center">
              <Clock className="h-5 w-5 text-indigo-500 mr-2" />
              <label className="block text-sm font-medium text-gray-700">
                운영 시간
              </label>
            </div>
            <OpeningHoursSelector
              weekdayHours={weekdayHours}
              setWeekdayHours={setWeekdayHours}
              weekendHours={weekendHours}
              setWeekendHours={setWeekendHours}
              isWeekendEnabled={isWeekendEnabled}
              setIsWeekendEnabled={setIsWeekendEnabled}
            />
          </div>

          <div className="relative">
            <TextInput
              id="publicAddress"
              name="publicAddress"
              label="주소"
              placeholder="기관 주소를 입력하세요"
              value={formData.publicAddress}
              onChange={handleInputChange}
              required={true}
              error={errors.publicAddress}
              icon={<MapPin className="h-5 w-5 text-indigo-500" />}
            />
            {errors.publicAddress && (
              <p className="text-red-500 text-xs italic mt-1">
                기관 주소를 입력해주세요
              </p>
            )}
          </div>

          <div className="relative">
            <TextInput
              id="publicTel"
              name="publicTel"
              label="대표번호"
              placeholder="대표 전화번호를 입력하세요"
              value={formData.publicTel}
              onChange={handleInputChange}
              required={true}
              error={errors.publicTel}
              icon={<Phone className="h-5 w-5 text-indigo-500" />}
            />
            {errors.publicTel && (
              <p className="text-red-500 text-xs italic mt-1">
                대표번호를 입력해주세요
              </p>
            )}
          </div>

          <div className="relative">
            <div className="mb-2 flex items-center">
              <Image className="h-5 w-5 text-indigo-500 mr-2" />
              <label
                htmlFor="publicLogo"
                className="block text-sm font-medium text-gray-700"
              >
                기관 로고{" "}
                <span className="text-gray-400 text-xs">(선택사항)</span>
              </label>
            </div>
            <FileInput
              id="publicLogo"
              name="publicLogo"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex justify-between mt-6">
          <button
            className="w-1/2 bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg mr-2 transition duration-200"
            onClick={onClose}
            disabled={isLoading}
          >
            취소
          </button>
          <button
            className={`w-1/2 ${
              isLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-medium py-2 px-4 rounded-lg transition duration-200`}
            onClick={handleRegisterPublic}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
                등록 중...
              </div>
            ) : (
              "기관 등록하기"
            )}
          </button>
        </div>

        {/* 로딩 오버레이 */}
        {isSaving && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg">
            <div className="text-center p-4 rounded-lg">
              <svg
                className="animate-spin h-10 w-10 mx-auto text-indigo-600 mb-4"
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
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <p className="text-indigo-700 font-medium">
                기관 정보를 저장하는 중입니다...
              </p>
              <p className="text-gray-500 text-sm mt-1">잠시만 기다려주세요</p>
            </div>
          </div>
        )}

        {/* 모달 */}
        <ModalMSG
          show={showMessageModal}
          onClose={handleMessageModalClose}
          title="등록 완료"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">{message}</p>
            <p className="text-sm text-gray-500 mt-2">
              이제 기관을 선택할 수 있습니다.
            </p>
          </div>
        </ModalMSG>

        <ModalErrorMSG show={showErrorModal} onClose={handleErrorModalClose}>
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-lg font-medium">오류가 발생했습니다</p>
            <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
          </div>
        </ModalErrorMSG>
      </div>
    </div>
  );
}
