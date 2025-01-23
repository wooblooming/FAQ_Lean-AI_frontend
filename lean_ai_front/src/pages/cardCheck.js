import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { useAuth } from "../contexts/authContext"; 
import ModalErrorMSG from "../components/modal/modalErrorMSG"; 
import config from "../../config"; 

const CardCheck = () => {
  // 상태 정의
  const [paymentHistory, setPaymentHistory] = useState([]); // 결제 내역 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 9; // 페이지당 항목 수
  const router = useRouter(); 
  const { token } = useAuth(); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const [showErrorModal, setShowErrorModal] = useState(false); 

  // 총 페이지 수 계산
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  
  // 현재 페이지에 표시할 항목 계산
  const currentItems = paymentHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 에러 모달 닫기 함수
  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 컴포넌트 로드 시 결제 내역 가져오기
  useEffect(() => {
    if (token) {
      fetchPaymentHistory();
    }
  }, [token]);

  // 결제 내역 가져오는 함수
  const fetchPaymentHistory = async () => {
    try {
      // 결제 내역 API 호출
      const response = await axios.get(
        `${config.apiDomain}/api/payment-history/`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더
          },
        }
      );
      console.log("Payment History:", response.data);

      // 응답 데이터 포맷팅
      const formattedData = response.data.payment_data.map((payment) => ({
        ...payment,
        // 결제 상태에 따라 날짜 포맷 처리
        formattedDate:
          payment.status === "scheduled"
            ? new Date(payment.scheduled_at).toLocaleString()
            : new Date(payment.created_at || payment.paid_at).toLocaleString(),
        // 결제 금액 포맷
        formattedAmount: Number(payment.amount).toLocaleString(),
      }));
      setPaymentHistory(formattedData); // 상태 업데이트
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      setErrorMessage("결제 내역을 가져오는데 실패했습니다.");
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen p-6 font-sans bg-violet-50">
      {/* 헤더 및 설명 */}
      <div className="flex flex-col space-y-6 w-full py-12 px-6 shadow-md rounded-lg bg-white">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center">
            <ChevronLeft
              className="h-6 w-6 md:h-8 md:w-8 text-indigo-700 cursor-pointer mr-2"
              onClick={() => router.push("/myPage")} // 이전 페이지로 이동
            />
            <h1
              className="text-xl md:text-3xl font-bold text-center text-indigo-600"
              style={{ fontFamily: "NanumSquareExtraBold" }}
            >
              정기 결제 조회
            </h1>
          </div>
          <p
            className="text-gray-600 mx-8 md:mx-10 text-sm md:text-lg whitespace-nowrap"
            style={{ fontFamily: "NanumSquare" }}
          >
            지금까지 결제하신 내역을 확인해보세요
          </p>
        </div>

        {/* 결제 내역 테이블 */}
        <div className="rounded-t-lg overflow-x-auto">
          {paymentHistory.length === 0 ? (
            // 결제 내역이 없을 경우
            <p className="text-gray-600 text-center p-6">
              결제 내역이 없습니다.
            </p>
          ) : (
            <>
              <table className="w-full min-w-full divide-y divide-gray-200 table-fixed border-b border-gray-200">
                <thead className="bg-indigo-50">
                  <tr className="text-indigo-500 font-medium text-center">
                    {/* 테이블 헤더 */}
                    <th className="w-[20%] px-2 md:px-6 py-3 uppercase tracking-wider">
                      결제일시
                    </th>
                    <th className="w-[20%] px-2 md:px-6 py-3 uppercase tracking-wider">
                      결제금액
                    </th>
                    <th className="w-[10%] px-2 md:px-6 py-3 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="w-[35%] px-2 md:px-6 py-3 uppercase tracking-wider">
                      주문번호
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {currentItems.map((history) => (
                    <tr key={history.merchant_uid}>
                      <td className="w-[20%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {history.formattedDate} {/* 결제일시 */}
                      </td>
                      <td className="w-[20%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {history.formattedAmount}원 {/* 결제금액 */}
                      </td>
                      <td className="w-[10%] px-2 md:px-6 py-3 whitespace-nowrap align-middle">
                        <div className="flex justify-center">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${
                              history.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : history.status === "failed"
                                ? "bg-red-100 text-red-800"
                                : history.status === "scheduled"
                                ? "bg-blue-100 text-blue-800"
                                : history.status === "canceled"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {/* 결제 상태 */}
                            {history.status === "paid"
                              ? "결제완료"
                              : history.status === "failed"
                              ? "결제실패"
                              : history.status === "scheduled"
                              ? "결제예정"
                              : history.status === "canceled"
                              ? "결제취소"
                              : "결제중"}
                          </span>
                        </div>
                      </td>
                      <td className="w-[35%] px-2 md:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                        {history.merchant_uid} {/* 주문번호 */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 1 && (
                // 페이지 네비게이션
                <div
                  className="flex justify-center space-x-2 py-4"
                  style={{ fontFamily: "NanumSquare" }}
                >
                  <button
                    className="text-indigo-500 font-bold"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      className={`p-2 rounded-md ${
                        currentPage === index + 1
                          ? "text-indigo-500 font-bold"
                          : "text-gray-400"
                      }`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className="text-indigo-500 font-bold"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 에러 메시지 모달 */}
      <ModalErrorMSG show={showErrorModal} onClose={closeErrorModal}>
        {errorMessage}
      </ModalErrorMSG>
    </div>
  );
};

export default CardCheck;
